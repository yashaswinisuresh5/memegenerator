import axios from 'axios';

// Use VITE_API_URL from environment, or fallback to relative/local dev paths
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const getMemes = () => api.get('/memes').then(res => res.data);
export const getRandomMeme = () => api.get('/random').then(res => res.data);
export const getSavedMemes = () => api.get('/saved').then(res => res.data);
export const saveMeme = (memeData) => api.post('/save', memeData).then(res => res.data);
export const uploadImage = (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
}).then(res => res.data);

export const getAICaption = (templateName) => api.post('/ai-caption', { templateName }).then(res => res.data);

export const getImageUrl = (path) => {
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : (import.meta.env.PROD ? '' : 'http://localhost:5000');
    return `${baseUrl}${path}`;
};
export default api;
