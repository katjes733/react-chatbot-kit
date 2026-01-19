import React from 'react';

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
      <textarea
        className="react-chatbot-kit-chat-input"
        placeholder={placeholderText}
        value={input}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const form = (e.currentTarget as HTMLTextAreaElement).form;
            if (form) {
              // prefer requestSubmit when available to trigger submit handlers
              // and respect form validation; fall back to submit
              (form as HTMLFormElement & { requestSubmit?: () => void }).requestSubmit
                ? (form as HTMLFormElement & { requestSubmit?: () => void }).requestSubmit!()
                : form.submit();
            }
          }
        }}
      />
      <button className="react-chatbot-kit-chat-btn-send" style={customButtonStyle}>
        <ChatIcon className="react-chatbot-kit-chat-btn-send-icon" />
      </button>
    </form>
  );
};

export default TextAreaMessage;
