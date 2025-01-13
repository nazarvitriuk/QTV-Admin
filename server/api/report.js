export default defineEventHandler(async (event) => {
  setHeader(event, 'Access-Control-Allow-Origin', '*');
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type');

  if (event._method === 'POST') {
    const reqBody = await readBody(event);

    return reqBody;
  }

  return 'REPORT ROUTE'

});
