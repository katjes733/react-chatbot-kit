import React from 'react';
import { render } from '@testing-library/react';
import Loader from '../../src/components/Loader/Loader';
import ChatbotMessage from '../../src/components/ChatbotMessage/ChatbotMessage';
import UserChatMessage from '../../src/components/UserChatMessage/UserChatMessage';
import ChatbotError from '../../src/components/ChatbotError/ChatbotError';
import Chat from '../../src/components/Chat/Chat';
import Chatbot from '../../src/components/Chatbot/Chatbot';
import ChatbotMessageAvatar from '../../src/components/ChatbotMessage/ChatBotMessageAvatar/ChatbotMessageAvatar';

// Mock useChatbot for Chatbot component
jest.mock('../../src/hooks/useChatbot', () => ({
  __esModule: true,
  default: () => ({
    configurationError: '',
    invalidPropsError: [],
    ActionProvider: function DummyActionProvider(): any { return null; },
    MessageParser: function DummyMessageParser(): any { return null; },
    widgetRegistry: { getWidget: (): any => null },
    messageContainerRef: { current: null },
    actionProv: {},
    messagePars: {},
    state: { messages: [] },
    setState: () => {},
  }),
}));

describe('Snapshots — components', () => {
  test('Loader snapshot', () => {
    const { container } = render(<Loader />);
    expect(container).toMatchSnapshot();
  });

  test('ChatbotMessage snapshot (bot, not loading)', () => {
    const { container } = render(
      <ChatbotMessage
        message="Hello"
        withAvatar
        loading={false}
        messages={[]}
        id={1}
        setState={() => {}}
        customStyles={{ backgroundColor: '' }}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('ChatbotMessageAvatar snapshot', () => {
    const { container } = render(<ChatbotMessageAvatar />);
    expect(container).toMatchSnapshot();
  });

  test('UserChatMessage snapshot', () => {
    const { container } = render(
      <UserChatMessage message="Hi" customComponents={{} as any} />
    );
    expect(container).toMatchSnapshot();
  });

  test('ChatbotError snapshot', () => {
    const { container } = render(<ChatbotError message="Error" />);
    expect(container).toMatchSnapshot();
  });

  test('Chat snapshot (empty messages)', () => {
    const props = {
      state: { messages: [] as any[] } as any,
      setState: () => {},
      widgetRegistry: { getWidget: (): any => null } as any,
      messageParser: { parse: (): any => {} } as any,
      actionProvider: {},
      customComponents: {} as any,
      botName: 'Bot',
      customStyles: { botMessageBox: { backgroundColor: '' }, chatButton: { backgroundColor: '' } } as any,
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
    expect(container).toMatchSnapshot();
  });

  test('Chatbot snapshot (useChatbot mocked)', () => {
    const { container } = render(
      <Chatbot
        actionProvider={() => {}}
        messageParser={() => {}}
        config={{} as any}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
