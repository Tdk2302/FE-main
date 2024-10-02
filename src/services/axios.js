import axios from "axios";

export const BASE_URL = 'http://localhost:8081/';
// Create an axios instance with your custom configuration
const instance = axios.create({
  baseURL: BASE_URL,

  headers: {
    'Content-Type': 'application/json',
  },
});

// Create an API object to handle HTTP methods
const api = {
  get: (url, config = {}) => instance.get(url, config),
  post: (url, data, config = {}) => instance.post(url, data, config),
  put: (url, data, config = {}) => instance.put(url, data, config),
  delete: (url, config = {}) => instance.delete(url, config),
  postForm: (url, data, config = {}) => instance.post(url, data, {
    ...config,
    headers: {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export default api; 