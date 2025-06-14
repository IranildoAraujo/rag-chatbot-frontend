import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatMessage.module.css';

export interface Message {
  id: number;
  sender: 'user' | 'bot' | 'system';
  text: string;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [displayedText, setDisplayedText] = useState('');
  const typingInterval = useRef<number | null>(null);

  useEffect(() => {
    const messageText = message.text || '';

    if (typingInterval.current !== null) {
      clearInterval(typingInterval.current);
    }

    if (message.sender !== 'bot') {
      setDisplayedText(messageText);
      return;
    }

    setDisplayedText('');
    let currentIndex = 0;

    typingInterval.current = window.setInterval(() => {
      if (currentIndex >= messageText.length) {
        clearInterval(typingInterval.current!);
        typingInterval.current = null;
        setDisplayedText(messageText);
      } else {
        // Pega o próximo caractere
        let charToAdd = messageText[currentIndex];

        // Se o caractere for um espaço, use um "non-breaking space"
        if (charToAdd === ' ') {
          charToAdd = '\u00A0'; // Código unicode para &nbsp;
        }

        setDisplayedText(prev => prev + charToAdd);
        currentIndex++;
      }
    }, 20);

    return () => {
      if (typingInterval.current !== null) {
        clearInterval(typingInterval.current);
      }
    };
  }, [message]);

  // O JSX do retorno permanece o mesmo
  return (
    <div className={`${styles.messageContainer} ${styles[message.sender + 'Container']}`}>
      <div className={`${styles.message} ${styles[message.sender]}`}>
        <p>
          {displayedText}
          {message.sender === 'bot' && displayedText.length < message.text.length && (
            <span className={styles.cursor}>|</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;