import {
  uniqueId,
  botMessage,
  userMessage,
  customMessage,
  createChatMessage,
  createChatBotMessage,
  createCustomMessage,
  createClientMessage,
  callIfExists,
} from '../../src/components/Chat/chatUtils';

describe('chatUtils', () => {
  test('uniqueId uses Date.now and Math.random (deterministic via mocks)', () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1000);
    const randSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const id = uniqueId();
    expect(typeof id).toBe('number');
    // 1000 * 0.5 = 500 -> Math.round -> 500
    expect(id).toBe(Math.round(1000 * 0.5));
    nowSpy.mockRestore();
    randSpy.mockRestore();
  });

  test('botMessage returns true only for type "bot"', () => {
    expect(botMessage({ type: 'bot' } as any)).toBe(true);
    expect(botMessage({ type: 'user' } as any)).toBe(false);
    expect(botMessage({} as any)).toBe(false);
  });

  test('userMessage returns true only for type "user"', () => {
    expect(userMessage({ type: 'user' } as any)).toBe(true);
    expect(userMessage({ type: 'bot' } as any)).toBe(false);
  });

  test('customMessage detects existing custom message type', () => {
    const customMap = { foo: () => 'x' };
    expect(customMessage({ type: 'foo' } as any, customMap)).toBe(true);
    expect(customMessage({ type: 'bar' } as any, customMap)).toBe(false);
  });

  test('createChatMessage returns expected shape', () => {
    const msg = createChatMessage('hello', 'bot');
    expect(msg.message).toBe('hello');
    expect(msg.type).toBe('bot');
    expect(typeof msg.id).toBe('number');
  });

  test('createChatBotMessage merges options and sets loading true', () => {
    const opts = { payload: { a: 1 } } as any;
    const msg = createChatBotMessage('hi', opts as any);
    expect(msg.message).toBe('hi');
    expect(msg.type).toBe('bot');
    expect(msg.payload).toEqual({ a: 1 });
    expect(msg.loading).toBe(true);
  });

  test('createCustomMessage merges with provided type and options', () => {
    const opts = { payload: { b: 2 } } as any;
    const msg = createCustomMessage('c', 'customType', opts as any);
    expect(msg.message).toBe('c');
    expect(msg.type).toBe('customType');
    expect(msg.payload).toEqual({ b: 2 });
  });

  test('createClientMessage creates a user message', () => {
    const opts = { payload: { c: 3 } } as any;
    const msg = createClientMessage('hey', opts as any);
    expect(msg.message).toBe('hey');
    expect(msg.type).toBe('user');
    expect(msg.payload).toEqual({ c: 3 });
  });

  test('callIfExists calls function and returns result when defined', () => {
    const fn = jest.fn((a: any, b: any) => a + b);
    const res = callIfExists(fn, 2, 3);
    expect(fn).toHaveBeenCalledWith(2, 3);
    expect(res).toBe(5);
  });

  test('callIfExists returns undefined when func is falsy', () => {
    expect(callIfExists(undefined as any)).toBeUndefined();
  });
});
