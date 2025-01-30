import axios from 'axios';
import chatApi from '../chat';

export const sendMessageToChatbot = async (message) => {
    try {
        const response = await chatApi.post('/chat/chat', { message });
        return response.data;
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        throw new Error('No se pudo enviar el mensaje');
    }
};

export const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await chatApi.post('/chat/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al subir el archivo:', error);
        throw new Error('No se pudo subir el archivo');
    }
};