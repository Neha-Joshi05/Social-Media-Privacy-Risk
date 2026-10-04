import axios from 'axios'
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001'
export const getQuestions = () => axios.get(`${BASE}/api/questions`)
export const submitAssess = data => axios.post(`${BASE}/api/assess`, data)
export const getDemo      = () => axios.get(`${BASE}/api/demo`)