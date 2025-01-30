import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Chatbot from './ChatbotApp.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Chatbot />
  </StrictMode>,
)
