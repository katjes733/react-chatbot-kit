import Chatbot, {
  createChatBotMessage,
  createClientMessage,
  createCustomMessage,
  useChatbot,
} from '../src';

test('library entry exports are available and helper creators work', () => {
  expect(Chatbot).toBeDefined();

  const botMsg = createChatBotMessage('hello', {});
  expect(botMsg).toBeDefined();
  expect(botMsg).toHaveProperty('message', 'hello');

  const clientMsg = createClientMessage('me', {});
  expect(clientMsg).toBeDefined();
  expect(clientMsg).toHaveProperty('message', 'me');

  const custom = createCustomMessage('custom', 'x', {});
  expect(custom).toBeDefined();

  // don't call hook directly; just assert it's exported
  expect(typeof useChatbot).toBe('function');
});
