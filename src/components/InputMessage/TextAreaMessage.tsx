import React from 'react';

import ChatIcon from '../../assets/icons/paper-plane.svg';

import './UserChatMessage.css';
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
      />
      <button className="react-chatbot-kit-chat-btn-send" style={customButtonStyle}>
        <ChatIcon className="react-chatbot-kit-chat-btn-send-icon" />
      </button>
    </form>
  );
};

export default TextAreaMessage;
