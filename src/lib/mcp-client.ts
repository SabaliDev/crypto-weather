import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

export class CoinGeckoMCPClient {
  private client: Client;
  private transport: SSEClientTransport;
  private isConnected: boolean = false;

  constructor() {
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

  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      await this.client.connect(this.transport);
      this.isConnected = true;
    } catch (error) {
      console.error('Failed to connect to CoinGecko MCP server:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.transport.close();
      this.isConnected = false;
    }
  }

  async listTools() {
    if (!this.isConnected) {
      await this.connect();
    }
    
    try {
      const response = await this.client.listTools();
      return response.tools;
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
      const response = await this.client.callTool({ name, arguments: args });
      return response;
    } catch (error) {
      console.error(`Failed to call tool ${name}:`, error);
      // Reset connection state on error
      this.isConnected = false;
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

let mcpClient: CoinGeckoMCPClient | null = null;

export function getMCPClient(): CoinGeckoMCPClient {
  if (!mcpClient) {
    mcpClient = new CoinGeckoMCPClient();
  }
  return mcpClient;
}