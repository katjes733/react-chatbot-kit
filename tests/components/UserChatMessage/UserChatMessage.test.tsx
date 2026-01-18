import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock callIfExists helper to execute functions or return values
jest.mock('../../../src/components/Chat/chatUtils', () => ({
  __esModule: true,
  callIfExists: (fn: any, ...args: any[]) => {
    if (!fn) return null;
    return typeof fn === 'function' ? fn(...args) : fn;
  },
}));

// Mock the svg import used as UserIcon
jest.mock('../../../src/assets/icons/user-alt.svg', () => ({
  __esModule: true,
  default: (props: any) => <svg data-testid="user-icon" className={props.className} />,
}));

import UserChatMessage from '../../../src/components/UserChatMessage/UserChatMessage';

test('renders default user chat message and avatar', () => {
  const { container } = render(
    <UserChatMessage message="hi there" customComponents={{} as any} />
  );

  // message text
  expect(screen.getByText('hi there')).toBeTruthy();

  // arrow element
  expect(container.querySelector('.react-chatbot-kit-user-chat-message-arrow')).toBeTruthy();

  // default avatar icon present (mocked svg)
  expect(screen.getByTestId('user-icon')).toBeTruthy();
  expect(screen.getByTestId('user-icon').getAttribute('class')).toContain('react-chatbot-kit-user-avatar-icon');
});

test('renders custom userChatMessage when provided', () => {
  const Custom = ({ message }: any) => <div data-testid="custom-user-chat">{message}</div>;

  render(<UserChatMessage message="custom" customComponents={{ userChatMessage: Custom } as any} />);

  expect(screen.getByTestId('custom-user-chat').textContent).toBe('custom');
});

test('renders custom userAvatar when provided', () => {
  const Avatar = () => <div data-testid="custom-avatar" />;

  const { container } = render(
    <UserChatMessage message="x" customComponents={{ userAvatar: Avatar } as any} />
  );

  expect(screen.getByTestId('custom-avatar')).toBeTruthy();

  // default user chat message container still present
  expect(container.querySelector('.react-chatbot-kit-user-chat-message')).toBeTruthy();
});
