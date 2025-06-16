// src/App.tsx
import { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import ChatMessage, { Message } from './components/ChatMessage/ChatMessage';
import FileUpload from './components/FileUpload/FileUpload';
import { queryRAG, uploadFile } from './services/api';
import styles from './App.module.css'; // Importa CSS Module para App

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref para scroll automático

  // Efeito para rolar para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Executa sempre que messages mudar

  // Adiciona uma nova mensagem à lista
  const addMessage = (sender: 'user' | 'bot' | 'system', text: string) => {
    setMessages(prevMessages => [
      ...prevMessages,
      { id: Date.now() + Math.random(), sender, text } // ID simples
    ]);
  };

  // Lida com a mudança no input de texto
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Lida com o envio da mensagem de texto
  const handleSendMessage = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault(); // Previne recarregamento da página se usar form
    const query = inputValue.trim();
    if (!query || isLoading || isUploading) return; // Não envia vazio ou se ocupado

    addMessage('user', query);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await queryRAG({ query: query });
      const botAnswer = response.answer ? response.answer.trim() : '';
      addMessage('bot', botAnswer);
    } catch (error: any) {
      addMessage('system', `Erro ao buscar resposta: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Lida com o upload de arquivos (recebe uma lista)
  const handleFileUpload = async (acceptedFiles: File[]) => {
    if (isUploading || isLoading) return; // Não faz upload se já estiver ocupado

    // Processa um arquivo por vez (poderia ser em paralelo com Promise.all)
    for (const file of acceptedFiles) {
      setIsUploading(true);
      setUploadProgress(0);
      addMessage('system', `Iniciando upload de: ${file.name}`);

      try {
        const response = await uploadFile(file, (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        });
        addMessage('system', `${response.message || `Arquivo ${file.name} processado.`} (Chunks: ${response.chunks_added ?? 'N/A'})`);
      } catch (error: any) {
        addMessage('system', `Erro no upload de ${file.name}: ${error.message || 'Erro desconhecido'}`);
      } finally {
        setIsUploading(false); // Permite próximo upload da lista ou normal
        setUploadProgress(null);
      }
    }
  };


  return (
    <div className={styles.appContainer}>
      <h1 className={styles.title}>Chatbot RAG</h1>
      <div className={styles.chatWindow}>
        <div className={styles.messageList}>
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {/* Elemento invisível para forçar scroll */}
          <div ref={messagesEndRef} />
        </div>
        {/* Indicador de carregamento para query */}
        {isLoading && <div className={styles.loadingIndicator}>Bot está pensando...</div>}

        {/* Componente de Upload */}
        <FileUpload
          onFileUpload={handleFileUpload}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />

        {/* Formulário de Input */}
        <form onSubmit={handleSendMessage} className={styles.inputForm}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Digite sua pergunta..."
            className={styles.inputField}
            disabled={isLoading || isUploading} // Desabilita durante carregamento/upload
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={isLoading || isUploading || !inputValue.trim()} // Desabilita se ocupado ou input vazio
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;