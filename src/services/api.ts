// src/services/api.ts
import axios from 'axios';

// Certifique-se que esta URL base aponta para o seu backend Django em execução
// Se o frontend e backend rodarem em portas diferentes, você precisará configurar CORS no Django.
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces para tipagem (ajuste conforme a resposta exata da sua API)
export interface QueryPayload {
  query: string;
  top_k?: number;
}

export interface RagQueryResponse {
  query: string;
  retrieved_context: string[];
  answer: string;
  model_used: string;
}

export interface UploadResponse {
  message: string;
  chunks_added?: number; // Opcional, dependendo da resposta da API
  filename?: string;     // Opcional
  collection?: string;   // Opcional
}

export interface ApiErrorResponse {
  error: string;
}

/**
 * Envia uma query para o endpoint RAG.
 */
export const queryRAG = async (payload: QueryPayload): Promise<RagQueryResponse> => {
  try {
    const response = await apiClient.post<RagQueryResponse>('/query/', payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao fazer query RAG:", error);
    if (axios.isAxiosError(error) && error.response?.data) {
        // Tenta retornar a mensagem de erro específica da API
        throw new Error((error.response.data as ApiErrorResponse).error || 'Erro desconhecido na API de query.');
    }
    throw new Error('Não foi possível conectar ao serviço de query.');
  }
};

/**
 * Faz upload de um arquivo para o endpoint de ingestão.
 */
export const uploadFile = async (file: File, onUploadProgress?: (progressEvent: any) => void): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file); // 'file' deve corresponder ao nome esperado pelo backend

  try {
    const response = await apiClient.post<UploadResponse>('/upload/', formData, {
      headers: {
        // Importante: Deixe o Axios definir o Content-Type para multipart/form-data
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onUploadProgress, // Callback para progresso
    });
    return response.data;
  } catch (error) {
     console.error("Erro ao fazer upload do arquivo:", error);
    if (axios.isAxiosError(error) && error.response?.data) {
        // Tenta retornar a mensagem de erro específica da API
        throw new Error((error.response.data as ApiErrorResponse).error || 'Erro desconhecido na API de upload.');
    }
    throw new Error('Não foi possível conectar ao serviço de upload.');
  }
};