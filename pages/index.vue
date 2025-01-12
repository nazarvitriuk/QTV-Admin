<script setup>
import axios from "axios";
import AppToast from "~/components/AppToast.vue";
import AppModal from "~/components/AppModal.vue";

class User {
  constructor(id, username, avatar, color) {
    this.id = id;
    this.username = username;
    this.avatar = avatar;
    this.color = color;
  }
}

const users = ref([]);
const userEditID = ref('');
const username = ref('');
const avatar = ref('');
const color = ref('#FFFFFF');
const chatEnabled = ref(false);
const stringEnabled = ref(false);
const modal = ref(null);
const loading = ref(false);
const toast = ref();
const optionsLoaded = ref();

// METHODS

function deleteUser(id) {
  users.value = users.value.filter((item) => item.id !== id);
}

function save() {
  loading.value = true;

  axios.post('/api/options', {
    users: users.value,
    chatEnabled: chatEnabled.value,
    stringEnabled: stringEnabled.value,
  })
      .finally(() => {
        loading.value = false;
        toast.value.show('Options has been saved successfully.');
      })
}

function onNewUserAdd() {
  modal.value.show();
}

function onUserEdit(user) {
  userEditID.value = user.id;
  username.value = user.username;
  avatar.value = user.avatar;
  color.value = user.color;

  modal.value.show();
}

function submit() {
  if (userEditID.value) {
    const editedUserIndex = users.value.findIndex(user => user.id === userEditID.value);

    users.value[editedUserIndex] = {
      username: username.value,
      avatar: avatar.value,
      color: color.value,
      id: userEditID.value
    }
  } else {
    users.value = [ ...users.value, new User(generateID(), username.value, avatar.value, color.value) ];
  }

  closeModal();
}

function closeModal() {
  userEditID.value = '';
  username.value = '';
  avatar.value = '';
  color.value = '';

  modal.value.hide();
}

function generateID() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// HOOKS

onMounted(async () => {
  modal.value = new bootstrap.Modal('#addUserModal');
  toast.value = new bootstrap.Toast('#liveToast');

  const options = await axios.get('/api/options');

  optionsLoaded.value = true;
  username.value = options.data.username;
  avatar.value = options.data.avatar;
  color.value = options.data.color;
  chatEnabled.value = options.data.chatEnabled;
  stringEnabled.value = options.data.stringEnabled;
  users.value = options.data.users;
})

</script>

<template>
  <div id="app" class="container">
    <div v-show="optionsLoaded" class="row">
      <div class="col-12">
        <h3 class="admin-title">QTV ADMIN</h3>
      </div>

      <div class="col-12">
        <div class="admin-section">
          <div class="form-check form-switch">
            <input v-model="chatEnabled" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
            <label class="form-check-label" for="flexSwitchCheckDefault">Chat enabled</label>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="admin-section">
          <div class="form-check form-switch">
            <input v-model="stringEnabled" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
            <label class="form-check-label" for="flexSwitchCheckDefault">Running string enabled</label>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="admin-section">
          <p>Current order:</p>
          <ul class="list-group">
            <li class="list-group-item">An item</li>
            <li class="list-group-item">A second item</li>
            <li class="list-group-item">A third item</li>
            <li class="list-group-item">A fourth item</li>
            <li class="list-group-item">And a fifth one</li>
          </ul>
        </div>
      </div>

      <div class="col-12">
        <div class="admin-section">
          <p>Users personalization:</p>

          <ul v-if="users?.length" class="list-group">
            <li
                v-for="(user, i) in users"
                :key="user?.username"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
              {{ user?.username }}
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-warning btn-sm" style="min-width: 100px;" @click="onUserEdit(user)">
                  Edit
                </button>
                <button type="button" class="btn btn-danger btn-sm" style="min-width: 100px;" @click="deleteUser(user?.id)">
                  Delete
                </button>
              </div>
            </li>
          </ul>

          <div v-else class="alert alert-warning" role="alert">
            No users added
          </div>

          <button type="button" class="btn btn-primary mt-3" style="min-width: 200px" @click="onNewUserAdd">
            Add user
          </button>
        </div>
      </div>

      <div class="col-12">
        <button class="btn btn-primary mt-3" type="button" style="min-width: 200px" @click="save" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
          <span v-if="loading" role="status">Loading...</span>
          <span v-else>SAVE</span>
        </button>
      </div>

      <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <AppToast id="liveToast" text="Options has been saved successfully!" />
      </div>

      <AppModal id="addUserModal">
        <form @submit.prevent="submit">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Add user</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body flex flex-column flex-gap-3">
            <div class="mb-3">
              <label for="username" class="form-label">Twitch username</label>
              <input v-model="username" type="text" class="form-control" id="username" placeholder="Enter username" required>
            </div>

            <div class="mb-3">
              <label for="username" class="form-label">Avatar URL</label>
              <input v-model="avatar" type="text" class="form-control" id="avatar" placeholder="Enter avatar URL">
            </div>

            <div class="mb-3">
              <label for="username" class="form-label">Text Color</label>
              <input
                  v-model="color"
                  type="color"
                  class="form-control form-control-color w-100"
                  id="exampleColorInput"
                  title="Choose your color"
              >
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click.stop="closeModal">
              Close
            </button>
            <button type="submit" class="btn btn-primary">
              Save changes
            </button>
          </div>
        </form>
      </AppModal>

    </div>
  </div>
</template>

<style scoped>

</style>