import React from 'react';
import { render, screen } from '@testing-library/react';

import ChatbotMessageAvatar from '../../../src/components/ChatbotMessage/ChatBotMessageAvatar/ChatbotMessageAvatar';

test('renders avatar structure and letter B', () => {
  const { container } = render(<ChatbotMessageAvatar />);

  const letter = screen.getByText('B');
  expect(letter).toBeTruthy();
  expect(letter.className).toContain('react-chatbot-kit-chat-bot-avatar-letter');

  const outer = container.querySelector('.react-chatbot-kit-chat-bot-avatar');
  expect(outer).toBeTruthy();

  const inner = container.querySelector('.react-chatbot-kit-chat-bot-avatar-container');
  expect(inner).toBeTruthy();
});
