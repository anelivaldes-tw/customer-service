import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { EventPublisherModule } from './event-publisher/event-publisher.module';
import { EventHandlerModule } from './event-handler/event-handler.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CustomersModule,
    EventPublisherModule,
    EventHandlerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
