export enum OrderEventsTypes {
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  ORDER_APPROVED = 'ORDER_APPROVED',
  ORDER_REJECTED = 'ORDER_REJECTED',
}
export interface OrderEvent {
  type: OrderEventsTypes;
  orderId: string;
  customerId: string;
  orderTotal: number;
}

export interface OrderEvent {
  type: OrderEventsTypes;
  orderId: string;
  customerId: string;
  orderTotal: number;
}
