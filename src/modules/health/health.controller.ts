import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection } from 'mongoose'

interface HealthResponse {
  status: 'ok' | 'error'
  timestamp: string
  uptime: number
  version: string
  database: {
    connected: boolean
    responseTime?: number
  }
  services: {
    auth: boolean
    api: boolean
  }
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 123.456 },
        version: { type: 'string', example: '1.0.0' },
        database: {
          type: 'object',
          properties: {
            connected: { type: 'boolean', example: true },
            responseTime: { type: 'number', example: 5 }
          }
        },
        services: {
          type: 'object',
          properties: {
            auth: { type: 'boolean', example: true },
            api: { type: 'boolean', example: true }
          }
        }
      }
    }
  })
  async getHealth(): Promise<HealthResponse> {
    const startTime = Date.now()
    let dbConnected = false
    let dbResponseTime: number | undefined

    try {
      // Check database connectivity by pinging the database
      await this.mongoConnection.db.admin().ping()
      dbConnected = true
      dbResponseTime = Date.now() - startTime
    } catch (error) {
      console.error('Database health check failed:', error)
      dbConnected = false
    }

    const healthStatus: HealthResponse = {
      status: dbConnected ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      database: {
        connected: dbConnected,
        responseTime: dbResponseTime
      },
      services: {
        auth: true, // API is responding if we reach this point
        api: true   // API is responding if we reach this point
      }
    }

    return healthStatus
  }
}