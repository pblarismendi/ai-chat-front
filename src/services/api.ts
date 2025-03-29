// Servicio para interactuar con la API de IA
import type { ChatRequest, ChatResponse } from '../types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * Verifica que la configuración de la API esté completa
 */
export function isApiConfigured(): boolean {
  return !!API_BASE_URL
}

/**
 * Envía un mensaje al endpoint de chat completions
 */
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  if (!API_BASE_URL) {
    throw new Error('La URL de la API no está configurada')
  }

  // Obtener el token de autenticación
  const token = authService.getToken()

  const response = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Error en la respuesta (${response.status}): ${errorText}`)
  }

  return response.json()
}

/**
 * Función de ayuda para crear una petición de chat simple
 */
export function createChatRequest(message: string, options = {}): ChatRequest {
  return {
    messages: [{ role: 'user', content: message }],
    max_tokens: 1000,
    temperature: 0.7,
    ...options,
  }
}

// Servicio para manejar peticiones al backend

const API_URL = import.meta.env.VITE_API_BASE_URL

// Interfaces para la autenticación
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  user: {
    id: number
    username: string
    email: string
  }
  token: string
}

// Servicio de autenticación
export const authService = {
  // Registro de usuario
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error en el registro')
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error en el registro: ${error.message}`)
      }
      throw new Error('Error desconocido en el registro')
    }
  },

  // Login de usuario
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error en el inicio de sesión')
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error en el inicio de sesión: ${error.message}`)
      }
      throw new Error('Error desconocido en el inicio de sesión')
    }
  },

  // Guardar datos de autenticación
  saveAuthData(authData: AuthResponse): void {
    localStorage.setItem('token', authData.token)
    localStorage.setItem('user', JSON.stringify(authData.user))
  },

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem('token')
  },

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken()
  },

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

// Crear headers con autorización para peticiones autenticadas
export const getAuthHeaders = (): HeadersInit => {
  const token = authService.getToken()
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  }
}
