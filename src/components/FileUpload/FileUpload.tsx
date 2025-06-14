// src/components/FileUpload/FileUpload.tsx
import React, { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import styles from './FileUpload.module.css';

interface FileUploadProps {
  onFileUpload: (acceptedFiles: File[]) => void;
  isUploading: boolean;
  uploadProgress: number | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isUploading, uploadProgress }) => {

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      console.warn('Arquivos rejeitados:', fileRejections);
      alert(`Alguns arquivos foram rejeitados. Verifique o console para detalhes.`);
    }
    if (acceptedFiles.length > 0 && !isUploading) {
      onFileUpload(acceptedFiles);
    }
  }, [onFileUpload, isUploading]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    disabled: isUploading,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
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