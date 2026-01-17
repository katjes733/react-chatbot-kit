import React, { useEffect } from 'react';
import { render, cleanup } from '@testing-library/react';
import useChatbot from '../../src/hooks/useChatbot';

afterEach(() => {
  cleanup();
  (global as any).__hookResult = undefined;
});

const makeWrapper = (props: any, onResult: (res: any) => void) => {
  return function Wrapper(): JSX.Element {
    const res = useChatbot(props);
    React.useEffect(() => {
      onResult(res);
    }, [res]);
    return null as any;
  };
};

test('returns configurationError when required props are missing', () => {
  function MissingProps() {
    // pass nulls to trigger configurationError
    // @ts-ignore
    const result = useChatbot({ config: null, actionProvider: null, messageParser: null, messageHistory: null, saveMessages: null });
    return <div data-testid="out">{result.configurationError}</div>;
  }

  const { getByTestId } = render(<MissingProps />);
  expect(getByTestId('out').textContent).toMatch(/I think you forgot to feed me some props/);
});

test('returns invalidPropsError when config lacks initialMessages', () => {
  function DummyAction() {}
  function DummyParser() {}

  function InvalidProps() {
    // config without initialMessages should trigger validateProps error
    // @ts-ignore
    const result = useChatbot({ config: {} , actionProvider: DummyAction, messageParser: DummyParser, messageHistory: null, saveMessages: null });
    return <div data-testid="out">{result.invalidPropsError}</div>;
  }

  const { getByTestId } = render(<InvalidProps />);
  expect(getByTestId('out').textContent).toMatch(/Config must contain property 'initialMessages'/);
});

test('constructor branch and saveMessages on unmount are called', () => {
  const saveMock = jest.fn();

  function ActionProvider() {}
  function MessageParser() {
    // minimal parse implementation
    // @ts-ignore
    this.parse = () => {};
  }

  function Wrapper() {
    const config: any = { initialMessages: [{ text: 'hello' }] };
    // @ts-ignore
    const result: any = useChatbot({ config, actionProvider: ActionProvider, messageParser: MessageParser, messageHistory: null, saveMessages: saveMock });

    // assign the hook's messageContainerRef synchronously via ref callback
    return (
      <div
        data-testid="ok"
        ref={(el) => {
          if (el && result && result.messageContainerRef) {
            result.messageContainerRef.current = el as any;
            result.messageContainerRef.current.innerHTML = '<span>saved</span>';
          }
        }}
      >
        ok
      </div>
    );
  }

  const { unmount } = render(<Wrapper />);
  // unmount triggers the cleanup effect which should call saveMessages
  unmount();

  expect(saveMock).toHaveBeenCalled();
  const [messagesArg, htmlArg] = saveMock.mock.calls[0];
  expect(Array.isArray(messagesArg)).toBe(true);
  expect(htmlArg).toContain('saved');
});

test('non-constructor branch does not throw', () => {
  const config: any = { initialMessages: [], widgets: [{ widgetName: 'w', widgetFunc: (): any => null, mapStateToProps: [], props: {} }] };
  const actionObj = { send: () => {} };
  const parserObj = { parse: (s: string) => {} };

  function Wrapper() {
    // @ts-ignore
    const result = useChatbot({ config, actionProvider: actionObj, messageParser: parserObj, messageHistory: null, saveMessages: null });
    useEffect(() => {
      // expose to global for manual inspection if needed
      (global as any).__hookResult = result;
    }, [result]);
    return <div>ok</div>;
  }

    const { getByText } = render(<Wrapper />);
  expect(getByText('ok')).toBeTruthy();
});

describe('useChatbot additional checks', () => {
  test('returns state with initialMessages when provided', (done) => {
    const initialMessages: any[] = [{ message: 'hi', type: 'bot', id: 1 }];
    const config: any = { initialMessages };
    const onResult = (res: any) => {
      expect(res.state).toBeDefined();
      expect(res.state.messages).toEqual(initialMessages);
      done();
    };

    const Wrapper = makeWrapper({ config, actionProvider: {}, messageParser: {} } as any, onResult);
    render(<Wrapper />);
  });

  test('messageHistory array overrides config.initialMessages and sets state', (done) => {
    const config: any = { initialMessages: [{ message: 'fromConfig' }] };
    const messageHistory = [{ message: 'fromHistory' }, { message: 'second' }];
    let called = false;
    const onResult = (res: any) => {
      if (called) return;
      if (!res || !res.state) return;
      if (!Array.isArray(res.state.messages)) return;
      if (res.state.messages.length !== messageHistory.length) return;
      called = true;
      expect(res.state).toBeDefined();
      expect(res.state.messages).toEqual(messageHistory);
      done();
    };

    const Wrapper = makeWrapper({ config, actionProvider: {}, messageParser: {}, messageHistory } as any, onResult);
    render(<Wrapper />);
  });

  test('messageHistory string clears initialMessages when runInitialMessagesWithHistory is false', (done) => {
    const config: any = { initialMessages: [{ message: 'keep' }] };
    const messageHistory = 'some-history';
    const onResult = (res: any) => {
      expect(res.state).toBeDefined();
      // should be cleared
      expect(res.state.messages).toEqual([]);
      done();
    };

    const Wrapper = makeWrapper({ config, actionProvider: {}, messageParser: {}, messageHistory, runInitialMessagesWithHistory: false } as any, onResult);
    render(<Wrapper />);
  });

  test('messageHistory string preserves initialMessages when runInitialMessagesWithHistory is true', (done) => {
    const config: any = { initialMessages: [{ message: 'keep' }] };
    const messageHistory = 'some-history';
    const onResult = (res: any) => {
      expect(res.state).toBeDefined();
      // should preserve config.initialMessages
      expect(res.state.messages).toEqual([{ message: 'keep' }]);
      done();
    };

    const Wrapper = makeWrapper({ config, actionProvider: {}, messageParser: {}, messageHistory, runInitialMessagesWithHistory: true } as any, onResult);
    render(<Wrapper />);
  });

  test('exposes returned API fields for constructor path', (done) => {
    function ActionProvider() {}
    function MessageParser() {
      // @ts-ignore
      this.parse = () => {};
    }
    const config: any = { initialMessages: [], widgets: [{ widgetName: 'w', widgetFunc: (): any => null, mapStateToProps: [], props: {} }] };

    const onResult = (res: any) => {
      expect(res).toBeDefined();
      expect(res.widgetRegistry).toBeDefined();
      expect(typeof res.setState).toBe('function');
      expect(res.actionProv).toBeDefined();
      expect(res.messagePars).toBeDefined();
      expect(res.ActionProvider).toBe(ActionProvider);
      expect(res.MessageParser).toBe(MessageParser);
      done();
    };

    const Wrapper = makeWrapper({ config, actionProvider: ActionProvider, messageParser: MessageParser } as any, onResult);
    render(<Wrapper />);
  });

  test('calls WidgetRegistry.addWidget for each widget', (done) => {
    const config: any = {
      initialMessages: [],
      widgets: [
        { widgetName: 'w1', widgetFunc: (): any => null, mapStateToProps: [], props: {} },
        { widgetName: 'w2', widgetFunc: (): any => null, mapStateToProps: [], props: {} },
      ],
    };

    const onResult = (res: any) => {
      if (!res || !res.widgetRegistry) return;
      // widgetRegistry should have keys for registered widgets
      expect(res.widgetRegistry['w1']).toBeDefined();
      expect(res.widgetRegistry['w2']).toBeDefined();
      done();
    };

    const Wrapper = makeWrapper({ config, actionProvider: {}, messageParser: {} } as any, onResult);
    render(<Wrapper />);
  });
});
