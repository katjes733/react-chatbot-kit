import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import ChatIcon from '../../assets/icons/paper-plane.svg';

import { IInputMessageProps } from '../../interfaces/IInputMessage';

const TextAreaMessage = ({
  input,
  setInputValue,
  handleSubmit,
  placeholderText,
  customButtonStyle,
}: IInputMessageProps) => {
  return (
    <form className="react-chatbot-kit-chat-input-form" onSubmit={handleSubmit}>
      <TextareaAutosize
        className="react-chatbot-kit-chat-input"
        placeholder={placeholderText}
        value={input}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // call the submit handler directly with a tiny synthetic event
            handleSubmit({
              preventDefault: () => {},
            } as unknown as React.FormEvent<HTMLFormElement>);
          }
          // Shift+Enter will just add a newline naturally
        }}
      />
      <button className="react-chatbot-kit-chat-btn-send" style={customButtonStyle}>
        <ChatIcon className="react-chatbot-kit-chat-btn-send-icon" />
      </button>
    </form>
  );
};

export default TextAreaMessage;
