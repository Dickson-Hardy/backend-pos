import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { WebsocketGateway } from './websocket.gateway'
import { WebsocketController } from './websocket.controller'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [WebsocketController],
  providers: [WebsocketGateway],
  exports: [WebsocketGateway],
})
export class WebsocketModule {}
