import type { WSEvent, WSEventType } from '../store/types'

type EventHandler = (data: unknown) => void

export class WebSocketService {
  private ws: WebSocket | null = null
  private url: string
  private handlers: Map<WSEventType, EventHandler[]> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 2000
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null

  constructor(url: string) {
    this.url = url
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          console.log('[WS] Connected to', this.url)
          this.reconnectAttempts = 0
          this.emit('connection:established', {})
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const wsEvent: WSEvent = JSON.parse(event.data)
            console.log('[WS] Received:', wsEvent.type, wsEvent.data)
            this.emit(wsEvent.type, wsEvent.data)
          } catch (error) {
            console.error('[WS] Failed to parse message:', error)
          }
        }

        this.ws.onerror = (error) => {
          console.error('[WS] Error:', error)
          this.emit('error', { message: 'WebSocket error' })
          reject(error)
        }

        this.ws.onclose = () => {
          console.log('[WS] Connection closed')
          this.ws = null
          this.attemptReconnect()
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WS] Max reconnect attempts reached')
      this.emit('error', { message: 'Failed to reconnect to server' })
      return
    }

    this.reconnectAttempts++
    console.log(`[WS] Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

    this.reconnectTimer = setTimeout(() => {
      this.connect().catch((error) => {
        console.error('[WS] Reconnect failed:', error)
      })
    }, this.reconnectDelay * this.reconnectAttempts)
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.handlers.clear()
  }

  send<T>(type: string, data: T): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const event: WSEvent<T> = { type: type as WSEventType, data }
      this.ws.send(JSON.stringify(event))
      console.log('[WS] Sent:', type, data)
    } else {
      console.error('[WS] Cannot send message, connection not open')
    }
  }

  on(eventType: WSEventType, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, [])
    }
    this.handlers.get(eventType)!.push(handler)
  }

  off(eventType: WSEventType, handler: EventHandler): void {
    const handlers = this.handlers.get(eventType)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index !== -1) {
        handlers.splice(index, 1)
      }
    }
  }

  private emit(eventType: WSEventType, data: unknown): void {
    const handlers = this.handlers.get(eventType)
    if (handlers) {
      handlers.forEach((handler) => handler(data))
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}
