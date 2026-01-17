import WidgetRegistry from '../../../src/components/WidgetRegistry/WidgetRegistry';

describe('WidgetRegistry', () => {
  test('addWidget and getWidget return widget and merge props correctly', () => {
    const setState = jest.fn();
    const actionProvider = { doSomething: () => {} } as any;

    const registry = new (WidgetRegistry as any)(setState, actionProvider);

    const widgetFunc = jest.fn((props: any) => ({ rendered: true, props }));

    registry.addWidget(
      {
        widgetName: 'testWidget',
        widgetFunc,
        mapStateToProps: ['value'],
        props: { local: 'yes' },
      },
      { parent: 'p' }
    );

    const options = { scrollIntoView: true, value: 42, actions: { a: 1 }, payload: 'p' } as any;
    const widget = registry.getWidget('testWidget', options as any);

    expect(widget).toBeTruthy();
    expect(widget.rendered).toBe(true);
    expect(widget.props.local).toBe('yes');
    expect(widget.props.parent).toBe('p');
    expect(widget.props.value).toBe(42);
    expect(widget.props.scrollIntoView).toBe(true);
    expect(widgetFunc).toHaveBeenCalled();
  });

  test('getWidget returns undefined for unknown widget', () => {
    const registry = new (WidgetRegistry as any)(jest.fn(), null);
    const result = registry.getWidget('nope', {} as any);
    expect(result).toBeUndefined();
  });

  test('mapStateToProps returns mapping or undefined', () => {
    const registry = new (WidgetRegistry as any)(jest.fn(), null);
    const mapped = registry.mapStateToProps(['a', 'b'], { a: 1, b: 2 });
    expect(mapped).toEqual({ a: 1, b: 2 });
    expect(registry.mapStateToProps(undefined as any, {} as any)).toBeUndefined();
  });
});
