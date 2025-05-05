// src/components/FileUpload/FileUpload.tsx
import React, { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import styles from './FileUpload.module.css';

interface FileUploadProps {
  onFileUpload: (acceptedFiles: File[]) => void; // Aceita múltiplos arquivos
  isUploading: boolean;
  uploadProgress: number | null; // Progresso de 0 a 100
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isUploading, uploadProgress }) => {

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      console.warn('Arquivos rejeitados:', fileRejections);
      // Você pode adicionar uma notificação ao usuário aqui sobre os arquivos rejeitados
      alert(`Alguns arquivos foram rejeitados. Verifique o console para detalhes.`);
    }
    if (acceptedFiles.length > 0 && !isUploading) {
      onFileUpload(acceptedFiles);
    }
  }, [onFileUpload, isUploading]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true, // Desabilita abertura da janela ao clicar na dropzone (usaremos o botão)
    noKeyboard: true,
    disabled: isUploading, // Desabilita dropzone durante upload
    // Aceita os tipos de arquivo que o backend suporta
    accept: {
        'text/plain': ['.txt'],
        'application/pdf': ['.pdf'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        // Adicione outros tipos se o backend suportar (ex: ODT)
        // 'application/vnd.oasis.opendocument.text': ['.odt'],
    }
  });

  return (
    <div {...getRootProps()} className={`${styles.dropzone} ${isDragActive ? styles.dragActive : ''}`}>
      <input {...getInputProps()} />

      {isUploading ? (
        <div className={styles.uploadStatus}>
          <p>Enviando arquivo...</p>
          {uploadProgress !== null && (
            <progress value={uploadProgress} max="100" className={styles.progressBar}></progress>
          )}
          <span>{uploadProgress !== null ? `${uploadProgress}%` : ''}</span>
        </div>
      ) : (
        <>
          <p className={styles.dropText}>
            Arraste e solte arquivos aqui, ou clique no botão abaixo.
          </p>
          <button type="button" onClick={open} className={styles.uploadButton} disabled={isUploading}>
            Selecionar Arquivos
          </button>
        </>
      )}
       {isDragActive && <div className={styles.overlay}>Solte aqui!</div>}
    </div>
  );
};

export default FileUpload;