export enum PaymentMethod {
    CreditCard = 'credit_card',
    PayPal = 'paypal',
    Stripe = 'stripe',
    CashOnDelivery = 'cash_on_delivery',
  }

  export enum PaymentStatus {
    Pending = 'pending',
    Completed = 'completed',
    Failed = 'failed',
    Refunded = 'refunded',
  }
  
  export enum OrderStatus {
    Pending = 'pending',
    Paid = 'paid',
    Shipped = 'shipped',
    Delivered = 'delivered',
    Cancelled = 'cancelled',
  }
