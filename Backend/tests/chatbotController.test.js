const test = require('node:test');
const assert = require('node:assert/strict');

const path = require('path');

const thaliServicePath = require.resolve('../services/thaliService');
const controllerPath = path.resolve(__dirname, '../controllers/chatbotController.js');

const thaliService = require('../services/thaliService');
thaliService.findCheapestThali = async () => {
  throw new Error('db unavailable');
};

delete require.cache[thaliServicePath];
delete require.cache[controllerPath];

const { handleChatMessage } = require('../controllers/chatbotController');

test('handleChatMessage returns a friendly reply instead of a 500 when the thali lookup fails', async () => {
  let statusCode = null;
  let payload = null;

  const req = {
    body: { message: 'order the cheapest thali daily at 2pm and 9pm' },
    user: { id: 'user-123' }
  };

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      payload = data;
      return this;
    }
  };

  await handleChatMessage(req, res);

  assert.equal(statusCode, 200);
  assert.equal(payload.success, false);
  assert.match(payload.reply, /trouble|try again|unable/i);
});
