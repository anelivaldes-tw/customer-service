import { Injectable } from '@nestjs/common';
import { Client, ClientKafka } from '@nestjs/microservices';
import { microserviceConfig } from '../microserviceConfig';

@Injectable()
export class EventPublisherService {
  @Client(microserviceConfig)
  client: ClientKafka;

  publish(event, topic = 'customer') {
    // TODO: There is a bug here, sometime Producer is disconnected, and do not publish. subscribe to observable, to see.
    this.client.emit<string>(topic, event);
    console.log('Published:', event);
    console.log('To:', topic);
  }
}
