import { NextRequest, NextResponse } from 'next/server'
import { getMCPClient } from '../../../../lib/mcp-client'

export async function GET() {
  try {
    const mcpClient = getMCPClient()
    const tools = await mcpClient.listTools()
    
    return NextResponse.json({
      success: true,
      data: tools
    })
  } catch (error) {
    console.error('Error listing MCP tools:', error)
    return NextResponse.json(
      { error: 'Failed to list MCP tools' },
      { status: 500 }
    )
  }
}