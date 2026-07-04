import axios, { type AxiosInstance } from 'axios'

/**
 * Pre-configured Axios instance. The app currently runs on mock data, but this
 * client is wired up so switching to a real backend only requires setting
 * VITE_API_BASE_URL and replacing the mock service calls.
 */
const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('pms.token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)
