import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

jest.useFakeTimers();

jest.mock('../../../src/components/Loader/Loader', () => ({
  __esModule: true,
  default: () => <div data-testid="loader" />,
}));

// callIfExists helper: call function if present, otherwise return value
jest.mock('../../../src/components/Chat/chatUtils', () => ({
  __esModule: true,
  callIfExists: (fn: any, ...args: any[]) => {
    if (!fn) return null;
    if (typeof fn === 'function') return fn(...args);
    return fn;
  },
}));

import ChatbotMessage from '../../../src/components/ChatbotMessage/ChatbotMessage';

afterEach(() => {
  jest.clearAllTimers();
  cleanup();
});

test('renders default avatar, message span and arrow when show=true', () => {
  render(
    <ChatbotMessage
      message="hello"
      id={1}
      messages={[]}
      customStyles={{ backgroundColor: '' }}
    />
  );

  // show is toggled immediately (no delay)
  const span = screen.getByText('hello');
  expect(span).toBeTruthy();

  // avatar letter B exists inside
  expect(screen.getByText('B')).toBeTruthy();

  // arrow element exists by class query
  const arrow = document.querySelector('.react-chatbot-kit-chat-bot-message-arrow');
  expect(arrow).toBeTruthy();
});

test('shows Loader when loading is true', () => {
  render(
    <ChatbotMessage
      message="loading"
      loading
      id={2}
      messages={[]}
      customStyles={{ backgroundColor: '' }}
    />
  );

  expect(screen.getByTestId('loader')).toBeTruthy();
});

test('uses custom botAvatar when provided via customComponents', () => {
  const customAvatar = () => <div data-testid="custom-avatar">X</div>;

  render(
    <ChatbotMessage
      message="m"
      id={3}
      messages={[]}
      customStyles={{ backgroundColor: '' }}
      customComponents={{ botAvatar: customAvatar }}
    />
  );

  expect(screen.getByTestId('custom-avatar')).toBeTruthy();
});

test('uses custom botChatMessage when provided via customComponents', () => {
  const customChat = ({ message }: any) => <div data-testid="custom-chat">{message}</div>;

  render(
    <ChatbotMessage
      message="custom message"
      id={4}
      messages={[]}
      customStyles={{ backgroundColor: '' }}
      customComponents={{ botChatMessage: customChat }}
    />
  );

  expect(screen.getByTestId('custom-chat').textContent).toBe('custom message');
});

test('delay prop defers showing content', () => {
  render(
    <ChatbotMessage
      message="delayed"
      id={5}
      messages={[]}
      delay={200}
      customStyles={{ backgroundColor: '' }}
    />
  );

  // initially not shown
  expect(document.querySelector('.react-chatbot-kit-chat-bot-message')).toBeNull();

  // advance timers by delay wrapped in act to avoid warnings
  act(() => {
    jest.advanceTimersByTime(200);
  });

  expect(screen.getByText('delayed')).toBeTruthy();
});

test('disableLoading effect calls setState after timeout and updater updates messages', () => {
  const messages = [{ id: 10, loading: true }];
  const setState = jest.fn();

  render(
    <ChatbotMessage
      message="x"
      id={10}
      messages={messages}
      setState={setState}
      customStyles={{ backgroundColor: '' }}
    />
  );

  // default timeout is 750ms
  act(() => {
    jest.advanceTimersByTime(750);
  });

  expect(setState).toHaveBeenCalled();

  // call the updater passed to setState and verify it returns new messages array with loading:false
  const updater = setState.mock.calls[0][0];
  const result = updater({});
  expect(Array.isArray(result.messages)).toBe(true);
  expect(result.messages.find((m: any) => m.id === 10).loading).toBe(false);
});

test('disableLoading does not change other messages', () => {
  const messages = [{ id: 11, loading: true }];
  const setState = jest.fn();

  render(
    <ChatbotMessage
      message="x"
      id={10}
      messages={messages}
      setState={setState}
      customStyles={{ backgroundColor: '' }}
    />
  );

  act(() => {
    jest.advanceTimersByTime(750);
  });

  expect(setState).toHaveBeenCalled();
  const updater = setState.mock.calls[0][0];
  const result = updater({});
  expect(result.messages.find((m: any) => m.id === 11).loading).toBe(true);
});

test('when withAvatar is false, avatar and arrow are not rendered', () => {
  render(
    <ChatbotMessage
      message="no avatar"
      id={6}
      messages={[]}
      withAvatar={false}
      customStyles={undefined as any}
    />
  );

  // default avatar letter 'B' should not be present
  expect(screen.queryByText('B')).toBeNull();
  // arrow should not be present
  expect(document.querySelector('.react-chatbot-kit-chat-bot-message-arrow')).toBeNull();
});
