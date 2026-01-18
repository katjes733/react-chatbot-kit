import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('../../../src/components/ChatbotMessage/ChatbotMessage', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="chatbot-message">{JSON.stringify(props)}</div>,
}));

import ChatbotError from '../../../src/components/ChatbotError/ChatbotError';

test('renders header, docs link, and ChatbotMessage with expected props', () => {
  render(<ChatbotError message="something wrong" />);

  // header
  expect(screen.getByText('Ooops. Something is missing.')).toBeTruthy();

  // docs link
  const linkEl = screen.getByText('View the docs');
  expect(linkEl).toBeTruthy();
  expect(linkEl.getAttribute('href')).toBe('https://fredrikoseberg.github.io/react-chatbot-kit-docs/');

  // ChatbotMessage receives expected props
  const msg = screen.getByTestId('chatbot-message');
  const received = JSON.parse(msg.textContent || '{}');
  expect(received.message).toBe('something wrong');
  expect(received.withAvatar).toBe(true);
  expect(received.loading).toBe(false);
  expect(received.id).toBe(1);
  expect(received.customStyles).toEqual({ backgroundColor: '' });
  expect(Array.isArray(received.messages)).toBe(true);
});
