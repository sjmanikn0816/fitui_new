import axios from 'axios';
import { Config } from '@/constants/config';
import { token } from './base';

const aiApi = axios.create({
  baseURL: Config.AI_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


aiApi.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default aiApi;