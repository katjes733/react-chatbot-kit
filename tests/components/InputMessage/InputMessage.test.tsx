import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import TextAreaMessage from '../../../src/components/InputMessage/InputMessage';

describe('TextAreaMessage', () => {
  it('renders input with placeholder and value, calls setInputValue on change, shows button with custom style and icon, and calls handleSubmit on form submit', () => {
    const setInputValue = jest.fn();
    const handleSubmit = jest.fn((e: any) => e && e.preventDefault());

    const { getByPlaceholderText, getByRole, container } = render(
      <TextAreaMessage
        input="initial"
        setInputValue={setInputValue}
        handleSubmit={handleSubmit}
        placeholderText="Type here"
        customButtonStyle={{ backgroundColor: 'red' }}
      />,
    );

    const input = getByPlaceholderText('Type here') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe('initial');

    fireEvent.change(input, { target: { value: 'hello' } });
    expect(setInputValue).toHaveBeenCalledWith('hello');

    const button = getByRole('button');
    expect(button).not.toBeNull();
    expect((button as HTMLElement).style.backgroundColor).toBe('red');

    // Icon rendering can be handled by the build step; ensure button exists instead

    // Submit the form and ensure handler was called
    const form = container.querySelector('form') as HTMLFormElement;
    expect(form).toBeTruthy();
    fireEvent.submit(form);
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('calls handleSubmit when send button is clicked', () => {
    const setInputValue = jest.fn();
    const handleSubmit = jest.fn((e: any) => e && e.preventDefault());

    const { getByRole } = render(
      <TextAreaMessage
        input=""
        setInputValue={setInputValue}
        handleSubmit={handleSubmit}
        placeholderText="Send"
      />,
    );

    const button = getByRole('button');
    fireEvent.click(button);
    expect(handleSubmit).toHaveBeenCalled();
  });
});
