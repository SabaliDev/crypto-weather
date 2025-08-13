import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

export class CoinGeckoMCPClient {
  private client: Client | null = null;
  private transport: SSEClientTransport | null = null;
  private isConnected: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    // Don't initialize transport/client here to avoid conflicts
  }

  private initializeClient() {
    if (!this.transport || !this.client) {
      this.transport = new SSEClientTransport(
        new URL('https://mcp.api.coingecko.com/sse')
      );
      this.client = new Client(
        {
          name: 'crypto-weather-app',
          version: '1.0.0',
        },
        {
          capabilities: {},
        }
      );
    }
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    // If there's already a connection attempt in progress, wait for it
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this._doConnect();
    return this.connectionPromise;
  }

  private async _doConnect(): Promise<void> {
    try {
      this.initializeClient();
      if (!this.client || !this.transport) {
        throw new Error('Failed to initialize client');
      }

      await this.client.connect(this.transport);
      this.isConnected = true;
      this.connectionPromise = null;
    } catch (error) {
      console.error('Failed to connect to CoinGecko MCP server:', error);
      this.isConnected = false;
      this.connectionPromise = null;
      // Reset transport and client on error
      this.transport = null;
      this.client = null;
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected && this.transport) {
      try {
        await this.transport.close();
      } catch (error) {
        console.error('Error during disconnect:', error);
      }
      this.isConnected = false;
      this.transport = null;
      this.client = null;
      this.connectionPromise = null;
    }
  }

  async listTools() {
    if (!this.isConnected) {
      await this.connect();
    }
    
    try {
      const response = await this.client?.listTools();
      return response?.tools || [];
    } catch (error) {
      console.error('Failed to list tools:', error);
      throw error;
    }
  }

  async callTool(name: string, args: any) {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      
      if (!this.client) {
        throw new Error('Client not initialized');
      }
      
      const response = await this.client.callTool({ name, arguments: args });
      return response;
    } catch (error) {
      console.error(`Failed to call tool ${name}:`, error);
      // Reset connection state on error
      this.isConnected = false;
      this.transport = null;
      this.client = null;
      this.connectionPromise = null;
      throw error;
    }
  }

  async getCryptocurrencies(params?: { vs_currency?: string; ids?: string; order?: string; per_page?: number; page?: number }) {
    return this.callTool('get_cryptocurrencies', params || {});
  }

  async getCryptocurrencyById(id: string, params?: { localization?: boolean; tickers?: boolean; market_data?: boolean }) {
    return this.callTool('get_cryptocurrency_by_id', { id, ...params });
  }

  async getCryptocurrencyPrice(ids: string, vs_currencies: string, params?: any) {
    return this.callTool('get_cryptocurrency_price', { ids, vs_currencies, ...params });
  }

  async getCryptocurrencyHistory(id: string, date: string, params?: { localization?: boolean }) {
    return this.callTool('get_cryptocurrency_history', { id, date, ...params });
  }
}

// Global client instances to avoid connection conflicts
const clientInstances = new Map<string, CoinGeckoMCPClient>();

export function getMCPClient(instanceId: string = 'default'): CoinGeckoMCPClient {
  if (!clientInstances.has(instanceId)) {
    clientInstances.set(instanceId, new CoinGeckoMCPClient());
  }
  return clientInstances.get(instanceId)!;
}

export function resetMCPClients() {
  // Clean up all instances
  clientInstances.forEach((client, id) => {
    client.disconnect().catch(console.error);
  });
  clientInstances.clear();
}