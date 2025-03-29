// Interfaces para las peticiones y respuestas de la API

// Mensaje para enviar a la API
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// Petición a la API
export interface ChatRequest {
  messages: ChatMessage[]
  max_tokens?: number
  temperature?: number
  top_p?: number
  n?: number
  stream?: boolean
  stop?: string | string[]
  presence_penalty?: number
  frequency_penalty?: number
}

// Respuesta de la API
export interface ChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: ChatMessage
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}
