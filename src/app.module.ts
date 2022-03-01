import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';
import { mysql } from './sequelize.config';
import { Customer } from './customers/models/customer.model';
import { EventPublisherModule } from './event-publisher/event-publisher.module';
import { EventHandlerModule } from './event-handler/event-handler.module';

@Module({
  imports: [
    TerminusModule,
    HealthModule,
    SequelizeModule.forRoot({ ...mysql, models: [Customer] }),
    CustomersModule,
    EventPublisherModule,
    EventHandlerModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
