// src/components/ChatMessage/ChatMessage.tsx
import React from 'react';
import styles from './ChatMessage.module.css'; // Importa CSS Module

export interface Message {
  id: number; // Para key do React
  sender: 'user' | 'bot' | 'system'; // system para status/erros
  text: string;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // Define a classe CSS baseada no remetente
  const messageClass = styles[message.sender] || styles.message;

  return (
    <div className={`${styles.messageContainer} ${styles[message.sender + 'Container']}`}>
       <div className={messageClass}>
        <p>{message.text}</p>
       </div>
    </div>

  );
};

export default ChatMessage;