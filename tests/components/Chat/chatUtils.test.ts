import {
  createChatBotMessage,
  createClientMessage,
  createCustomMessage,
  botMessage,
  userMessage,
  customMessage,
  callIfExists,
} from '../../../src/components/Chat/chatUtils';

describe('chatUtils', () => {
  test('createChatBotMessage produces bot message with loading true', () => {
    const msg = createChatBotMessage('hello', { foo: 'bar' } as any);
    expect(msg.type).toBe('bot');
    expect(msg.message).toBe('hello');
    expect(msg.loading).toBe(true);
    // additional options are preserved; access via index signature or cast to any
    expect((msg as any).foo).toBe('bar');
  });

  test('createClientMessage produces user message', () => {
    const msg = createClientMessage('hi', {} as any);
    expect(msg.type).toBe('user');
    expect(msg.message).toBe('hi');
  });

  test('createCustomMessage keeps custom type', () => {
    const msg = createCustomMessage('x', 'custom-type', {} as any);
    expect(msg.type).toBe('custom-type');
    expect(msg.message).toBe('x');
  });

  test('botMessage/userMessage/customMessage helpers', () => {
    const bot = { type: 'bot' } as any;
    const user = { type: 'user' } as any;
    const custom = { type: 'special' } as any;
    expect(botMessage(bot)).toBe(true);
    expect(userMessage(user)).toBe(true);
    expect(customMessage(custom, { special: () => {} })).toBe(true);
    expect(customMessage(custom, {})).toBe(false);
  });

  test('callIfExists calls function when provided', () => {
    const fn = jest.fn((a: number, b: number) => a + b);
    const res = callIfExists(fn, 2, 3);
    expect(fn).toHaveBeenCalledWith(2, 3);
    expect(res).toBe(5);
    expect(callIfExists(undefined)).toBeUndefined();
  });
});
