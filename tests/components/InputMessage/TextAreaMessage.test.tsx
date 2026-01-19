import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import TextAreaMessage from '../../../src/components/InputMessage/TextAreaMessage';

describe('TextAreaMessage', () => {
  it('renders and handles change and submit with custom style', () => {
    const setInputValue = jest.fn();
    const handleSubmit = jest.fn((e: any) => e && e.preventDefault());

    const { getByPlaceholderText, getByRole, container } = render(
      <TextAreaMessage
        input="hello"
        setInputValue={setInputValue}
        handleSubmit={handleSubmit}
        placeholderText="Type"
        customButtonStyle={{ backgroundColor: 'blue' }}
      />,
    );

    const textarea = getByPlaceholderText('Type') as HTMLTextAreaElement;
    expect(textarea).not.toBeNull();
    expect(textarea.value).toBe('hello');

    fireEvent.change(textarea, { target: { value: 'world' } });
    expect(setInputValue).toHaveBeenCalledWith('world');

    const button = getByRole('button') as HTMLElement;
    expect(button).not.toBeNull();
    expect((button as HTMLElement).style.backgroundColor).toBe('blue');

    const form = container.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('clicking button calls handleSubmit and button has no style when customButtonStyle missing', () => {
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

    const button = getByRole('button') as HTMLElement;
    fireEvent.click(button);
    expect(handleSubmit).toHaveBeenCalled();
    expect(button.style.backgroundColor).toBe('');
  });

  it('pressing Shift+Enter inserts newline (does not submit)', () => {
    const setInputValue = jest.fn();
    const handleSubmit = jest.fn((e: any) => e && e.preventDefault());

    const { getByPlaceholderText } = render(
      <TextAreaMessage
        input=""
        setInputValue={setInputValue}
        handleSubmit={handleSubmit}
        placeholderText="ShiftEnterTest"
      />,
    );

    const textarea = getByPlaceholderText('ShiftEnterTest') as HTMLTextAreaElement;

    // spy on button.click to ensure it is NOT called for Shift+Enter
    const origClick = (HTMLButtonElement.prototype as any).click;
    const clickMock = jest.fn(function (this: HTMLButtonElement) {
      if (origClick) origClick.call(this);
    });
    (HTMLButtonElement.prototype as any).click = clickMock;

    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: true });

    expect(clickMock).not.toHaveBeenCalled();
    expect(handleSubmit).not.toHaveBeenCalled();

    (HTMLButtonElement.prototype as any).click = origClick;
  });

  it('pressing Enter without Shift prevents default and submits', () => {
    const setInputValue = jest.fn();
    const handleSubmit = jest.fn((e: any) => e && e.preventDefault());

    const { getByPlaceholderText } = render(
      <TextAreaMessage
        input=""
        setInputValue={setInputValue}
        handleSubmit={handleSubmit}
        placeholderText="EnterTest"
      />,
    );

    const textarea = getByPlaceholderText('EnterTest') as HTMLTextAreaElement;

    const preventSpy = jest.spyOn(Event.prototype, 'preventDefault');

    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: false });

    expect(handleSubmit).toHaveBeenCalled();
    expect(preventSpy).toHaveBeenCalled();

    preventSpy.mockRestore();
  });
});
