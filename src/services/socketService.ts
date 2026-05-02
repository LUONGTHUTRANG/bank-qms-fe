import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { appConfig } from '@/config/appConfig';

class SocketService {
  private client: Client | null = null;
  private isConnected = false;

  public connect(onConnect?: () => void, onError?: (err: any) => void) {
    if (this.client && this.isConnected) {
      onConnect?.();
      return;
    }

    const socketUrl = import.meta.env.VITE_WS_URL || appConfig.apiUrl.replace('/api', '/ws');
    
    this.client = new Client({
      // brokerURL: socketUrl, // Không dùng brokerURL nếu dùng SockJS
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: {
        // Authorization headers if needed
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame) => {
      this.isConnected = true;
      console.log('Connected to STOMP WebSocket', frame);
      onConnect?.();
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      onError?.(frame);
    };

    this.client.onWebSocketClose = () => {
      this.isConnected = false;
      console.log('WebSocket connection closed');
    };

    this.client.activate();
  }

  public disconnect() {
    if (this.client && this.isConnected) {
      this.client.deactivate();
      this.isConnected = false;
      this.client = null;
    }
  }

  public subscribe(destination: string, callback: (message: any) => void) {
    if (!this.client || !this.isConnected) {
      console.error('Cannot subscribe, STOMP client is not connected');
      // Thử kết nối lại và subscribe sau
      return null;
    }

    return this.client.subscribe(destination, (message) => {
      try {
        const body = JSON.parse(message.body);
        callback(body);
      } catch (error) {
        callback(message.body);
      }
    });
  }
  
  public isSocketConnected() {
      return this.isConnected;
  }
}

export const socketService = new SocketService();