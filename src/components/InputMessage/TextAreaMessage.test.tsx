import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TextAreaMessage from './TextAreaMessage';

jest.mock('react-textarea-autosize', () => (props: any) => <textarea {...props} />);
jest.mock('../../assets/icons/paper-plane.svg', () => (props: any) => (
  <svg data-testid="chat-icon" {...props} />
));

test('calls handleSubmit and prevents default when Enter pressed without Shift', () => {
  const handleSubmit = jest.fn();
  const setInputValue = jest.fn();

  const { getByPlaceholderText } = render(
    <TextAreaMessage
      input=""
      setInputValue={setInputValue}
      handleSubmit={handleSubmit}
      placeholderText="Type a message"
      customButtonStyle={{}}
    />,
  );

  const textarea = getByPlaceholderText('Type a message') as HTMLTextAreaElement;

  fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

  expect(handleSubmit).toHaveBeenCalledTimes(1);
});

test('does not call handleSubmit when Shift+Enter is pressed', () => {
  const handleSubmit = jest.fn();
  const setInputValue = jest.fn();

  const { getByPlaceholderText } = render(
    <TextAreaMessage
      input=""
      setInputValue={setInputValue}
      handleSubmit={handleSubmit}
      placeholderText="Type a message"
      customButtonStyle={{}}
    />,
  );

  const textarea = getByPlaceholderText('Type a message') as HTMLTextAreaElement;

  fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

  expect(handleSubmit).not.toHaveBeenCalled();
});
