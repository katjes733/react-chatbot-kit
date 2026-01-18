const WidgetRegistry = require('../../../src/components/WidgetRegistry/WidgetRegistry').default;

// Mock getObject for prop expansion
jest.mock('../../../src/components/Chatbot/utils', () => ({
  __esModule: true,
  getObject: jest.fn(() => ({})),
}));

describe('WidgetRegistry combined tests', () => {
  test('getWidget returns null when widget factory returns falsy', () => {
    const setState = jest.fn();
    const actions = { doSomething: () => {} };
    const registry = new WidgetRegistry(setState, actions);

    // add a widget whose factory returns null
    registry.addWidget(
      {
        widgetName: 'w-null',
        widgetFunc: (props) => null,
        mapStateToProps: null,
        props: null,
      },
      { parent: true }
    );

    const result = registry.getWidget('w-null', { scrollIntoView: undefined, actions, payload: {} });

    expect(result).toBeNull();
  });

  test('getWidget returns undefined when widget not found', () => {
    const setState = jest.fn();
    const registry = new WidgetRegistry(setState, {});

    const result = registry.getWidget('missing', {});

    expect(result).toBeUndefined();
  });

  test('getWidget returns widget and assembled props when widget returns something', () => {
    const setState = jest.fn();
    const actionProvider = { name: 'AP' };

    const registry = new WidgetRegistry(setState, actionProvider);

    registry.addWidget(
      {
        widgetName: 'ok',
        widgetFunc: (props) => ({ received: props }),
        mapStateToProps: ['a', 'b'],
        props: { some: true },
      },
      { parentProp: 1 }
    );

    const options = { scrollIntoView: false, actions: { alt: true }, payload: { p: 1 }, a: 'A', b: 'B' };

    const result = registry.getWidget('ok', options);

    expect(result).toBeTruthy();
    const received = result.received;
    expect(received.scrollIntoView).toBe(false);
    expect(received.parentProp).toBe(1);
    expect(received.foo).toBeUndefined();
    expect(received.a).toBe('A');
    expect(received.b).toBe('B');
    expect(received.setState).toBe(setState);
    expect(received.actionProvider).toBe(actionProvider);
    expect(received.actions).toBe(options.actions);
    expect(received.state).toBe(options);
    expect(received.payload).toBe(options.payload);
  });

  test('getWidget uses options.actions when registry has no actionProvider', () => {
    const setState = jest.fn();
    const registry = new WidgetRegistry(setState, undefined);

    registry.addWidget(
      {
        widgetName: 'useOpt',
        widgetFunc: (props) => props,
        mapStateToProps: null,
        props: null,
      },
      {}
    );

    const options = { actions: { alt: 'X' } };

    const result = registry.getWidget('useOpt', options);
    expect(result.actionProvider).toBe(options.actions);
  });

  test('mapStateToProps returns undefined when props falsy', () => {
    const setState = jest.fn();
    const registry = new WidgetRegistry(setState, {});
    expect(registry.mapStateToProps(null, {})).toBeUndefined();
  });
});
