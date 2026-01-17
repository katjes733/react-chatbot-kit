import {
  getCustomStyles,
  getInitialState,
  getWidgets,
  getCustomComponents,
  getBotName,
  getObject,
  getCustomMessages,
  validateProps,
  isConstructor,
} from '../../../src/components/Chatbot/utils';

describe('Chatbot utils', () => {
  test('getCustomStyles returns customStyles or empty object', () => {
    expect(getCustomStyles({ customStyles: { a: 1 } } as any)).toEqual({ a: 1 });
    expect(getCustomStyles({} as any)).toEqual({});
  });

  test('getInitialState returns state or empty object', () => {
    expect(getInitialState({ state: { foo: 'bar' } } as any)).toEqual({ foo: 'bar' });
    expect(getInitialState({} as any)).toEqual({});
  });

  test('getWidgets returns widgets or empty array', () => {
    expect(getWidgets({ widgets: [1, 2] } as any)).toEqual([1, 2]);
    expect(getWidgets({} as any)).toEqual([]);
  });

  test('getCustomComponents returns customComponents or {}', () => {
    expect(getCustomComponents({ customComponents: { X: true } } as any)).toEqual({ X: true });
    expect(getCustomComponents({} as any)).toEqual({});
  });

  test('getBotName returns configured or default', () => {
    expect(getBotName({ botName: 'Helper' } as any)).toBe('Helper');
    expect(getBotName({} as any)).toBe('Bot');
  });

  test('getObject returns object or {}', () => {
    expect(getObject({ a: 1 } as any)).toEqual({ a: 1 });
    expect(getObject('not-an-object' as any)).toEqual({});
  });

  test('getCustomMessages returns messages or {}', () => {
    expect(getCustomMessages({ customMessages: { hello: () => {} } } as any)).toHaveProperty('hello');
    expect(getCustomMessages({} as any)).toEqual({});
  });

  test('validateProps checks for initialMessages', () => {
    const errors1 = validateProps({} as any, {});
    expect(errors1.length).toBeGreaterThan(0);

    const errors2 = validateProps({ initialMessages: [] } as any, {});
    expect(errors2.length).toBe(0);
  });

  test('isConstructor returns true for constructors, false otherwise', () => {
    class C {}
    function F() {}
    const nonFunction = {};

    expect(isConstructor(C)).toBe(true);
    // plain function is constructible
    expect(isConstructor(F)).toBe(true);
    // non-function values are not constructors
    expect(isConstructor(nonFunction as any)).toBe(false);
  });
});
