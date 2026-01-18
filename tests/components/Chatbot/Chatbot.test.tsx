import React from 'react';
import { render, screen } from '@testing-library/react';

let capturedProps: any = null;

jest.mock('../../../src/components/Chat/Chat', () => ({
  __esModule: true,
  default: (props: any) => {
    capturedProps = props;
    return <div data-testid="chat">{JSON.stringify(props)}</div>;
  },
}));

jest.mock('../../../src/components/ChatbotError/ChatbotError', () => ({
  __esModule: true,
  default: ({ message }: any) => <div data-testid="chatbot-error">{JSON.stringify(message)}</div>,
}));

jest.mock('../../../src/components/Chatbot/utils', () => ({
  __esModule: true,
  getCustomStyles: jest.fn(() => ({})),
  getCustomComponents: jest.fn(() => ({})),
  getBotName: jest.fn(() => 'Bot'),
  getCustomMessages: jest.fn(() => ({})),
  isConstructor: jest.fn(),
}));

jest.mock('../../../src/hooks/useChatbot', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import Chatbot from '../../../src/components/Chatbot/Chatbot';
import useChatbot from '../../../src/hooks/useChatbot';
import * as utils from '../../../src/components/Chatbot/utils';

afterEach(() => {
  capturedProps = null;
  jest.clearAllMocks();
});

describe('Chatbot `useTextArea` forwarding and defaulting (merged)', () => {
  beforeEach(() => {
    capturedProps = null;
    jest.clearAllMocks();
  });

  it('forwards default `useTextArea` (true) and respects explicit false when isConstructor is true', () => {
    (utils as any).isConstructor.mockReturnValue(true);

    (useChatbot as jest.Mock).mockReturnValue({
      configurationError: null,
      invalidPropsError: [],
      ActionProvider: function Action() {},
      MessageParser: function Parser() {},
      actionProv: 'ACTION_PROV',
      messagePars: 'MESSAGE_PARS',
      widgetRegistry: {},
      messageContainerRef: null,
      state: { messages: [] },
      setState: () => {},
    });

    const baseConfig = { initialMessages: [{ message: 'hi', type: 'bot', id: 1 }] } as any;
    render(<Chatbot actionProvider={() => {}} messageParser={() => {}} config={baseConfig} />);
    expect(capturedProps).not.toBeNull();
    expect(capturedProps.useTextArea).toBe(true);

    render(
      <Chatbot
        actionProvider={() => {}}
        messageParser={() => {}}
        config={baseConfig}
        useTextArea={false}
      />,
    );
    expect(capturedProps).not.toBeNull();
    expect(capturedProps.useTextArea).toBe(false);
  });

  it('forwards default `useTextArea` (true) and respects explicit false when isConstructor is false', () => {
    (utils as any).isConstructor.mockReturnValue(false);

    const ActionProvider = ({ children }: any) => <div data-testid="AP">{children}</div>;
    const MessageParser = ({ children }: any) => <div data-testid="MP">{children}</div>;

    (useChatbot as jest.Mock).mockReturnValue({
      configurationError: null,
      invalidPropsError: [],
      ActionProvider,
      MessageParser,
      widgetRegistry: {},
      messageContainerRef: null,
      state: { messages: [] },
      setState: () => {},
    });

    const baseConfig = { initialMessages: [{ message: 'hi', type: 'bot', id: 1 }] } as any;
    render(<Chatbot actionProvider={() => {}} messageParser={() => {}} config={baseConfig} />);
    expect(capturedProps).not.toBeNull();
    expect(capturedProps.useTextArea).toBe(true);

    render(
      <Chatbot
        actionProvider={() => {}}
        messageParser={() => {}}
        config={baseConfig}
        useTextArea={false}
      />,
    );
    expect(capturedProps).not.toBeNull();
    expect(capturedProps.useTextArea).toBe(false);
  });
});

test('renders configuration error via ChatbotError', () => {
  (useChatbot as jest.Mock).mockReturnValue({
    configurationError: 'bad config',
    invalidPropsError: [],
  });

  render(
    <Chatbot actionProvider={() => {}} messageParser={() => {}} config={{ initialMessages: [] }} />,
  );

  expect(screen.getByTestId('chatbot-error').textContent).toContain('bad config');
});

test('renders invalidPropsError via ChatbotError', () => {
  (useChatbot as jest.Mock).mockReturnValue({
    configurationError: null,
    invalidPropsError: ['missing prop'],
  });

  render(
    <Chatbot actionProvider={() => {}} messageParser={() => {}} config={{ initialMessages: [] }} />,
  );

  expect(screen.getByTestId('chatbot-error').textContent).toContain('missing prop');
});

test('constructor branch: passes actionProv and messagePars into Chat props', () => {
  (utils as any).isConstructor.mockReturnValue(true);
  (useChatbot as jest.Mock).mockReturnValue({
    configurationError: null,
    invalidPropsError: [],
    ActionProvider: function Action() {},
    MessageParser: function Parser() {},
    actionProv: 'ACTION_PROV',
    messagePars: 'MESSAGE_PARS',
    widgetRegistry: {},
    messageContainerRef: null,
    state: { messages: [] },
    setState: () => {},
  });

  render(
    <Chatbot actionProvider={() => {}} messageParser={() => {}} config={{ initialMessages: [] }} />,
  );

  const chat = screen.getByTestId('chat');
  expect(chat.textContent).toContain('"actionProvider":"ACTION_PROV"');
  expect(chat.textContent).toContain('"messageParser":"MESSAGE_PARS"');
});

test('component-wrapper branch: wraps Chat with ActionProvider and MessageParser', () => {
  (utils as any).isConstructor.mockReturnValue(false);

  const ActionProvider = ({ children }: any) => <div data-testid="AP">{children}</div>;
  const MessageParser = ({ children }: any) => <div data-testid="MP">{children}</div>;

  (useChatbot as jest.Mock).mockReturnValue({
    configurationError: null,
    invalidPropsError: [],
    ActionProvider,
    MessageParser,
    widgetRegistry: {},
    messageContainerRef: null,
    state: { messages: [] },
    setState: () => {},
  });

  render(
    <Chatbot actionProvider={() => {}} messageParser={() => {}} config={{ initialMessages: [] }} />,
  );

  // ActionProvider and MessageParser wrappers should be present and Chat rendered inside
  expect(screen.getByTestId('AP')).toBeTruthy();
  expect(screen.getByTestId('MP')).toBeTruthy();
  expect(screen.getByTestId('chat')).toBeTruthy();
});
