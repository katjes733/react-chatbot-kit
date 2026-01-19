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

  it('pressing Enter (no Shift) triggers form.requestSubmit when available', () => {
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

    const origRequestSubmit = (HTMLFormElement.prototype as any).requestSubmit;
    const requestSubmitMock = jest.fn(function (this: HTMLFormElement) {
      // simulate native requestSubmit behavior by dispatching submit event
      this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    (HTMLFormElement.prototype as any).requestSubmit = requestSubmitMock;

    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: false });

    expect(requestSubmitMock).toHaveBeenCalled();
    expect(handleSubmit).toHaveBeenCalled();

    // restore
    (HTMLFormElement.prototype as any).requestSubmit = origRequestSubmit;
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

    const origRequestSubmit = (HTMLFormElement.prototype as any).requestSubmit;
    const origSubmit = (HTMLFormElement.prototype as any).submit;

    const requestSubmitMock = jest.fn();
    const submitMock = jest.fn();
    (HTMLFormElement.prototype as any).requestSubmit = requestSubmitMock;
    (HTMLFormElement.prototype as any).submit = submitMock;

    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: true });

    expect(requestSubmitMock).not.toHaveBeenCalled();
    expect(submitMock).not.toHaveBeenCalled();
    expect(handleSubmit).not.toHaveBeenCalled();

    // restore
    (HTMLFormElement.prototype as any).requestSubmit = origRequestSubmit;
    (HTMLFormElement.prototype as any).submit = origSubmit;
  });

  it('pressing Enter falls back to form.submit when requestSubmit missing', () => {
    const setInputValue = jest.fn();
    const handleSubmit = jest.fn((e: any) => e && e.preventDefault());

    const { getByPlaceholderText } = render(
      <TextAreaMessage
        input=""
        setInputValue={setInputValue}
        handleSubmit={handleSubmit}
        placeholderText="FallbackTest"
      />,
    );

    const textarea = getByPlaceholderText('FallbackTest') as HTMLTextAreaElement;

    const origRequestSubmit = (HTMLFormElement.prototype as any).requestSubmit;
    const origSubmit = (HTMLFormElement.prototype as any).submit;

    // remove requestSubmit to force fallback
    (HTMLFormElement.prototype as any).requestSubmit = undefined;

    const submitMock = jest.fn(function (this: HTMLFormElement) {
      // calling submit programmatically; don't dispatch submit event here
      // we just want to ensure fallback path executes
    });
    (HTMLFormElement.prototype as any).submit = submitMock;

    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: false });

    expect(submitMock).toHaveBeenCalled();

    // restore
    (HTMLFormElement.prototype as any).requestSubmit = origRequestSubmit;
    (HTMLFormElement.prototype as any).submit = origSubmit;
  });

  it('pressing Enter when textarea has no form does nothing (covers else branch)', () => {
    const setInputValue = jest.fn();
    const handleSubmit = jest.fn((e: any) => e && e.preventDefault());

    const { getByPlaceholderText } = render(
      <TextAreaMessage
        input=""
        setInputValue={setInputValue}
        handleSubmit={handleSubmit}
        placeholderText="NoFormTest"
      />,
    );

    const textarea = getByPlaceholderText('NoFormTest') as HTMLTextAreaElement;

    // temporarily override the form getter to return null to simulate no form
    const origDesc = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'form');
    Object.defineProperty(HTMLTextAreaElement.prototype, 'form', {
      get: () => null,
      configurable: true,
    });

    // ensure no errors are thrown and nothing is submitted
    expect(() =>
      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: false }),
    ).not.toThrow();

    // handler should not have been called because form is null
    expect(handleSubmit).not.toHaveBeenCalled();

    // restore original descriptor
    if (origDesc) {
      Object.defineProperty(HTMLTextAreaElement.prototype, 'form', origDesc);
    }
  });
});
