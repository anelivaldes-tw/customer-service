export enum OrderEventsTypes {
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
}

export enum CustomerEventTypes {
  CUSTOMER_CREATED = 'CUSTOMER_CREATED',
  CREDIT_RESERVED = 'CREDIT_RESERVED',
  CREDIT_RESERVATION_FAILED = 'CREDIT_RESERVATION_FAILED',
  CUSTOMER_VALIDATION_FAILED = 'CUSTOMER_VALIDATION_FAILED',
}

export interface OrderEvent {
  state: OrderEventsTypes;
  orderId: string;
  customerId: string;
  orderTotal: number;
}

export interface CustomerEvent {
  type: CustomerEventTypes;
  orderId: string;
  customerId: string;
  orderTotal: number;
}

export interface CustomerCreatedEvent {
  type: CustomerEventTypes.CUSTOMER_CREATED;
  customerId: string;
  firstName: string;
  lastName: string;
  creditLimit: number;
  orders: [];
}
