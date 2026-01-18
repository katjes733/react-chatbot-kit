import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Chat from '../../../src/components/Chat/Chat';

describe('Chat component', () => {
  test('renders messageHistory string as HTML', () => {
    const props: any = {
      state: { messages: [] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: 'Header',
      customMessages: {} as any,
      placeholderText: 'Write here',
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: '<p data-testid="mh">Hello history</p>' as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    render(<Chat {...props} />);
    expect(screen.getByTestId('mh')).toBeTruthy();
  });

  test('renders bot message with widget when provided', () => {
    const widget = <div data-testid="widget-w1">W1</div>;
    const widgetRegistry = { getWidget: (_: any, __: any): any => widget };

    const msg = { id: 1, type: 'bot', message: 'Bot says hi', widget: 'w1', loading: false };

    const props: any = {
      state: { messages: [msg] },
      setState: () => {},
      widgetRegistry,
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: 'Header',
      customMessages: {} as any,
      placeholderText: 'Write here',
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    render(<Chat {...props} />);
    expect(screen.getByText('Bot says hi')).toBeTruthy();
    expect(screen.getByTestId('widget-w1')).toBeTruthy();
  });

  test('renders user message and attaches widget when available', () => {
    const widget = <div data-testid="widget-user-w">UW</div>;
    const widgetRegistry = { getWidget: (_: any, __: any): any => widget };

    const msg = { id: 2, type: 'user', message: 'User here', widget: 'uw', payload: {} };

    const props: any = {
      state: { messages: [msg] },
      setState: () => {},
      widgetRegistry,
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: 'Header',
      customMessages: {} as any,
      placeholderText: 'Write here',
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    render(<Chat {...props} />);
    expect(screen.getByText('User here')).toBeTruthy();
    expect(screen.getByTestId('widget-user-w')).toBeTruthy();
  });

  test('renders custom message component and widget', () => {
    const widget = <div data-testid="widget-c">WC</div>;
    const widgetRegistry = { getWidget: (_: any, __: any): any => widget };

    const customComp = () => <div data-testid="custom-comp">C</div>;

    const msg = { id: 3, type: 'custom_type', message: 'Custom', widget: 'wc', payload: {} };

    const props: any = {
      state: { messages: [msg] },
      setState: () => {},
      widgetRegistry,
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: 'Header',
      customMessages: { custom_type: customComp } as any,
      placeholderText: 'Write here',
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    render(<Chat {...props} />);
    expect(screen.getByTestId('custom-comp')).toBeTruthy();
    expect(screen.getByTestId('widget-c')).toBeTruthy();
  });

  test('handleSubmit calls parse when provided and parses when not', () => {
    const parseMock = jest.fn();
    const messageParser = { parse: jest.fn() };

    const props: any = {
      state: { messages: [] },
      setState: jest.fn(),
      widgetRegistry: { getWidget: (): any => null },
      messageParser,
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: 'Header',
      customMessages: {} as any,
      placeholderText: 'Write here',
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
      parse: parseMock,
    };

    const first = render(<Chat {...props} />);
    const input = first.container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.submit(first.container.querySelector('form') as HTMLFormElement);

    // when parse prop exists, it should be called
    expect(parseMock).toHaveBeenCalledWith('hello');

    // unmount first render and now render without parse prop to ensure messageParser.parse is used
    first.unmount();

    const props2 = { ...props, parse: undefined };
    const second = render(<Chat {...props2} />);
    const input2 = second.container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input2, { target: { value: 'again' } });
    fireEvent.submit(second.container.querySelector('form') as HTMLFormElement);
    expect(messageParser.parse).toHaveBeenCalledWith('again');
  });

  test('bot message with loading true does not show widget', () => {
    const widget = <div data-testid="widget-w-l">WL</div>;
    const widgetRegistry = { getWidget: (_: any, __: any): any => widget };

    const msg = { id: 10, type: 'bot', message: 'Bot loading', widget: 'wl', loading: true };

    const props: any = {
      state: { messages: [msg] },
      setState: () => {},
      widgetRegistry,
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: 'Header',
      customMessages: {} as any,
      placeholderText: 'Write here',
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    const { queryByTestId } = render(<Chat {...props} />);
    expect(queryByTestId('widget-w-l')).toBeNull();
  });

  test('bot message without widget renders message (else branch)', () => {
    const msg = { id: 11, type: 'bot', message: 'Bot plain', loading: false };

    const props: any = {
      state: { messages: [msg] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: 'Header',
      customMessages: {} as any,
      placeholderText: 'Write here',
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    const { getByText } = render(<Chat {...props} />);
    expect(getByText('Bot plain')).toBeTruthy();
  });

  test('consecutive bot messages without widgets hides avatar for second message', () => {
    const m1 = { id: 21, type: 'bot', message: 'first', loading: false };
    const m2 = { id: 22, type: 'bot', message: 'second', loading: false };

    const props: any = {
      state: { messages: [m1, m2] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: 'Header',
      customMessages: {} as any,
      placeholderText: 'Write here',
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    const { container } = render(<Chat {...props} />);
    const avatars = container.querySelectorAll('.react-chatbot-kit-chat-bot-avatar');
    // first message should render avatar, second should not -> count 1
    expect(avatars.length).toBe(1);
  });

  test('renders custom header when provided', () => {
    const headerComp = () => <div data-testid="custom-header">H</div>;
    const props: any = {
      state: { messages: [] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: { header: headerComp } as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    const { getByTestId } = render(<Chat {...props} />);
    expect(getByTestId('custom-header')).toBeTruthy();
  });

  test('validator false prevents submission', () => {
    const parseMock = jest.fn();
    const messageParser = { parse: jest.fn() };

    const props: any = {
      state: { messages: [] },
      setState: jest.fn(),
      widgetRegistry: { getWidget: (): any => null },
      messageParser,
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => false,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
      parse: parseMock,
    };

    const { container } = render(<Chat {...props} />);
    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'nope' } });
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    expect(parseMock).not.toHaveBeenCalled();
    expect(messageParser.parse).not.toHaveBeenCalled();
  });

  test('uses default placeholder when none provided', () => {
    const props: any = {
      state: { messages: [] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    const { container } = render(<Chat {...props} />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.placeholder).toBe('Write your message here');
  });

  test('message with withAvatar=true forces avatar to show', () => {
    const msg = { id: 31, type: 'bot', message: 'with avatar', withAvatar: true };

    const props: any = {
      state: { messages: [msg] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    const { container } = render(<Chat {...props} />);
    const avatars = container.querySelectorAll('.react-chatbot-kit-chat-bot-avatar');
    expect(avatars.length).toBeGreaterThan(0);
  });

  test('applies customStyles.chatButton backgroundColor', () => {
    const msg = { id: 41, type: 'bot', message: 'btn style' };

    const props: any = {
      state: { messages: [msg] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: 'rgb(1,2,3)' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    const { container } = render(<Chat {...props} />);
    const btn = container.querySelector('button') as HTMLButtonElement;
    // style set via inline style on button element
    expect(btn.style.backgroundColor).toBe('rgb(1, 2, 3)');
  });

  test('unknown message type renders nothing', () => {
    const msg = { id: 51, type: 'unknown', message: 'mystery' };

    const props: any = {
      state: { messages: [msg] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    const { container } = render(<Chat {...props} />);
    expect(container.textContent).not.toContain('mystery');
  });

  test('previous bot had widget so avatar shows for second message', () => {
    const widget = <div data-testid="wprev">W</div>;
    const widgetRegistry = { getWidget: (): any => widget };

    const m1 = { id: 61, type: 'bot', message: 'first', widget: 'w', loading: false };
    const m2 = { id: 62, type: 'bot', message: 'second', loading: false };

    const props: any = {
      state: { messages: [m1, m2] },
      setState: () => {},
      widgetRegistry,
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    const { container } = render(<Chat {...props} />);
    const avatars = container.querySelectorAll('.react-chatbot-kit-chat-bot-avatar');
    expect(avatars.length).toBe(2);
  });

  test('validator undefined uses else branch and calls messageParser.parse', () => {
    const messageParser = { parse: jest.fn() };

    const props: any = {
      state: { messages: [] },
      setState: jest.fn(),
      widgetRegistry: { getWidget: (): any => null },
      messageParser,
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: undefined,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    const { container } = render(<Chat {...props} />);
    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'no-validator' } });
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    expect(messageParser.parse).toHaveBeenCalledWith('no-validator');
  });

  test('falsy messageHistory does not render html', () => {
    const props: any = {
      state: { messages: [] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: '' as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    const { container } = render(<Chat {...props} />);
    expect(container.querySelector('[data-testid]')).toBeNull();
  });

  test('scrollIntoView runs when messageContainerRef.current exists', () => {
    jest.useFakeTimers();
    const ref: any = { current: { scrollTop: 0, scrollHeight: 555 } };

    const props: any = {
      state: { messages: [] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: false,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: ref,
    };

    render(<Chat {...props} />);
    // React will assign the DOM element to the ref; override its scrollHeight getter
    if (ref.current) {
      const assigned = { val: 0 } as any;
      Object.defineProperty(ref.current, 'scrollHeight', {
        get: () => 555,
      });
      Object.defineProperty(ref.current, 'scrollTop', {
        set: (v: number) => {
          assigned.val = v;
        },
        get: () => assigned.val,
      });
    }
    jest.runAllTimers();
    // scrollTop should have been set to the element's scrollHeight (555)
    expect((ref.current && (ref.current as any).scrollTop) || 0).toBe(555);
    jest.useRealTimers();
  });

  test('scrollIntoView assigns undefined when scrollHeight is missing', () => {
    jest.useFakeTimers();
    // current exists but has no scrollHeight property
    const ref: any = { current: { scrollTop: 0 } };

    const props: any = {
      state: { messages: [] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: false,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: ref,
    };

    render(<Chat {...props} />);
    // React will assign a DOM node to the ref; replace it with a plain object lacking scrollHeight
    ref.current = { scrollTop: 0 } as any;
    jest.runAllTimers();
    // assignment should set scrollTop to undefined (no scrollHeight available)
    expect(ref.current && (ref.current as any).scrollTop).toBe(undefined);
    jest.useRealTimers();
  });

  test('scrollIntoView is a no-op when messageContainerRef.current is null', () => {
    jest.useFakeTimers();
    const ref: any = { current: null };

    const props: any = {
      state: { messages: [] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: false,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: ref,
    };

    render(<Chat {...props} />);
    // React will assign a DOM node to the ref during render; simulate missing current
    ref.current = null;
    // run timers - should not throw and ref.current remains null
    jest.runAllTimers();
    expect(ref.current).toBeNull();
    jest.useRealTimers();
  });

  test('does not schedule scroll when disableScrollToBottom is true', () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    const props: any = {
      state: { messages: [] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    render(<Chat {...props} />);
    expect(setTimeoutSpy).not.toHaveBeenCalled();
    setTimeoutSpy.mockRestore();
  });

  test('custom message without widget returns component', () => {
    const customComp = () => <div data-testid="custom-no-widget">C</div>;
    const msg = { id: 71, type: 'ct', message: 'C' };

    const props: any = {
      state: { messages: [msg] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: { ct: customComp } as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    const { getByTestId } = render(<Chat {...props} />);
    expect(getByTestId('custom-no-widget')).toBeTruthy();
  });

  test('validator undefined with parse prop should call parse and not messageParser.parse', () => {
    const parseMock = jest.fn();
    const messageParser = { parse: jest.fn() };

    const props: any = {
      state: { messages: [] },
      setState: jest.fn(),
      widgetRegistry: { getWidget: (): any => null },
      messageParser,
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: undefined,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
      parse: parseMock,
    };

    const { container } = render(<Chat {...props} />);
    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'use-parse' } });
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    expect(parseMock).toHaveBeenCalledWith('use-parse');
    expect(messageParser.parse).not.toHaveBeenCalled();
  });

  test('exhaustive integration covers remaining branches', () => {
    jest.useFakeTimers();
    const div = document.createElement('div');
    // define getters/setters on scrollHeight/scrollTop to allow assignment and reading
    Object.defineProperty(div, 'scrollHeight', { get: () => 800 });
    let top = 0;
    Object.defineProperty(div, 'scrollTop', {
      get: () => top,
      set: (v: number) => {
        top = v;
      },
    });

    const ref: any = { current: div };

    const widget = <span data-testid="ex-w">W</span>;
    const widgetRegistry = { getWidget: (): any => widget };

    const customComp = () => <span data-testid="ex-c">C</span>;

    const msgs = [
      { id: 1, type: 'bot', message: 'b1', loading: false, widget: 'w' },
      { id: 2, type: 'bot', message: 'b2', loading: true, widget: 'w' },
      { id: 3, type: 'user', message: 'u1', widget: 'w', payload: {} },
      { id: 4, type: 'custom', message: 'c1', widget: 'w', payload: {} },
    ];

    const props: any = {
      state: { messages: msgs },
      setState: () => {},
      widgetRegistry,
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: { custom: customComp } as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: false,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: ref,
    };

    const { getAllByTestId } = render(<Chat {...props} />);
    // run timers to trigger scrollIntoView
    jest.runAllTimers();
    expect(getAllByTestId('ex-w').length).toBeGreaterThan(0);
    expect(getAllByTestId('ex-c').length).toBeGreaterThan(0);
    jest.useRealTimers();
  });

  test('custom inputMessage component that returns an element is used', () => {
    const customInput = jest.fn(() => <div data-testid="custom-input">OK</div>);

    const props: any = {
      state: { messages: [] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: { inputMessage: customInput } as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    const { getByTestId, container } = render(<Chat {...props} />);
    expect(getByTestId('custom-input')).toBeTruthy();
    // ensure default inputs are not rendered
    expect(container.querySelector('input')).toBeNull();
    expect(container.querySelector('textarea')).toBeNull();
    expect(customInput).toHaveBeenCalled();
    const callArgs: any = (customInput as any).mock.calls[0]?.[0];
    expect(typeof callArgs?.handleSubmit).toBe('function');
  });

  test('custom inputMessage component that returns null falls back to default input', () => {
    const customInput = jest.fn(() => null);

    const props: any = {
      state: { messages: [] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: { inputMessage: customInput } as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    const { container } = render(<Chat {...props} />);
    // fallback to input (default useTextArea = false)
    expect(container.querySelector('input')).not.toBeNull();
  });

  test('no custom inputMessage and useTextArea false renders InputMessage (input)', () => {
    const props: any = {
      state: { messages: [] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
      useTextArea: false,
    };

    const { container } = render(<Chat {...props} />);
    expect(container.querySelector('input')).not.toBeNull();
    expect(container.querySelector('textarea')).toBeNull();
  });

  test('no custom inputMessage and useTextArea true renders TextAreaMessage (textarea)', () => {
    const props: any = {
      state: { messages: [] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
      useTextArea: true,
    };

    const { container } = render(<Chat {...props} />);
    expect(container.querySelector('textarea')).not.toBeNull();
    expect(container.querySelector('input')).toBeNull();
  });

  test('custom message with widget prop but registry returns null does not render widget', () => {
    const widgetRegistry = { getWidget: (): any => null };

    const customComp = () => <div data-testid="custom-c-null">C</div>;

    const msg = {
      id: 200,
      type: 'custom_null',
      message: 'Custom null',
      widget: 'nowhere',
      payload: {},
    };

    const props: any = {
      state: { messages: [msg] },
      setState: () => {},
      widgetRegistry,
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: { custom_null: customComp } as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    const { getByTestId, queryByTestId } = render(<Chat {...props} />);
    expect(getByTestId('custom-c-null')).toBeTruthy();
    expect(queryByTestId('nowhere')).toBeNull();
  });

  test('no customStyles does not throw and defaults button style', () => {
    const msg = { id: 300, type: 'bot', message: 'btn test' };

    const props: any = {
      state: { messages: [msg] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: { botMessageBox: { backgroundColor: '' } } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    const { container } = render(<Chat {...props} />);
    const btn = container.querySelector('button') as HTMLButtonElement;
    // default empty backgroundColor
    expect(btn.style.backgroundColor).toBe('');
  });

  test('handleValidMessage calls functional setState updater when provided', () => {
    const setStateMock = jest.fn((updater: any) => {
      // if updater is a function, call it with a baseline state to simulate React
      if (typeof updater === 'function') {
        const result = updater({ messages: [] });
        // ensure the updater returns a state with one new user message
        expect(Array.isArray(result.messages)).toBe(true);
        expect(result.messages.length).toBe(1);
      }
      return undefined;
    });

    const messageParser = { parse: jest.fn() };

    const props: any = {
      state: { messages: [] },
      setState: setStateMock,
      widgetRegistry: { getWidget: (): any => null },
      messageParser,
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    const { container } = render(<Chat {...props} />);
    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'hit updater' } });
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    // setState should have been called with a function updater
    expect(setStateMock).toHaveBeenCalled();
  });

  test('bot message with widget prop but registry returns null does not render widget', () => {
    const msg = {
      id: 99,
      type: 'bot',
      message: 'Bot missing widget',
      widget: 'nowhere',
      loading: false,
    };

    const props: any = {
      state: { messages: [msg] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    const { queryByTestId, getByText } = render(<Chat {...props} />);
    expect(getByText('Bot missing widget')).toBeTruthy();
    expect(queryByTestId('nowhere')).toBeNull();
  });

  test('user message with widget prop but registry returns null does not render widget', () => {
    const msg = {
      id: 100,
      type: 'user',
      message: 'User missing widget',
      widget: 'nowhere',
      payload: {},
    };

    const props: any = {
      state: { messages: [msg] },
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null },
      messageParser: { parse: () => {} },
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: {
        botMessageBox: { backgroundColor: '' },
        chatButton: { backgroundColor: '' },
      } as any,
      headerText: undefined,
      customMessages: {} as any,
      placeholderText: undefined,
      validator: () => true,
      disableScrollToBottom: true,
      messageHistory: [] as any,
      actions: {},
      messageContainerRef: React.createRef<HTMLDivElement>(),
    };

    const { queryByTestId, getByText } = render(<Chat {...props} />);
    expect(getByText('User missing widget')).toBeTruthy();
    expect(queryByTestId('nowhere')).toBeNull();
  });
});
