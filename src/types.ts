export type NavigationTab =
  | 'overview'
  | 'customers'
  | 'products'
  | 'subscriptions'
  | 'invoices'
  | 'payments'
  | 'discounts'
  | 'reports'
  | 'users';

export type UserRole = 'ADMIN' | 'BILLING_MANAGER' | 'STAFF' | 'VIEWER';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  department: string;
  status: 'active' | 'invited' | 'suspended';
  avatarInitials: string;
  avatarBg?: string;
  lastActive: string;
  twoFactorEnabled: boolean;
  createdAt: string;
  password?: string;
}

export type TimeRange = '7d' | '30d' | '90d' | '12m';
export type AppTheme = 'light' | 'dark';
export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface ReportExportConfig {
  reportType: 'subscriptions' | 'revenue' | 'executive';
  period: 'month' | 'quarter' | 'ytd' | 'all';
  statusFilter?: 'all' | 'active' | 'in_trial' | 'past_due' | 'canceled';
  planFilter?: string;
  includeSummary: boolean;
  includeLedger: boolean;
  includeMetrics: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  planId: string;
  status: 'active' | 'trialing' | 'delinquent' | 'canceled';
  mrr: number;
  lifetimeSpend: number;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: {
    brand: 'visa' | 'mastercard' | 'amex' | 'discover';
    last4: string;
    expMonth: number;
    expYear: number;
  };
  phone?: string;
  taxId?: string;
  createdAt: string;
  notes?: string;
}

export interface Plan {
  id: string;
  name: string;
  tierCode: string;
  priceMonthly: number;
  priceAnnual: number;
  billingCadence: 'monthly' | 'annual';
  description: string;
  features: string[];
  limits: {
    seats: number | string;
    apiCalls: string;
    storage: string;
  };
  subscribersCount: number;
  mrrContributed: number;
  isPopular?: boolean;
  status: 'active' | 'archived';
}

export interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  company: string;
  planId: string;
  planName: string;
  status: 'active' | 'past_due' | 'in_trial' | 'paused' | 'canceled';
  billingCycle: 'monthly' | 'annual';
  amount: number;
  startDate: string;
  renewalDate: string;
  autoRenew: boolean;
  discountCode?: string;
  seats: number;
  cancelReason?: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  company: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  discountAmount: number;
  total: number;
  status: 'paid' | 'open' | 'overdue' | 'void';
  notes?: string;
  paymentMethod?: string;
}

export interface PaymentTransaction {
  id: string;
  invoiceId?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  fee: number;
  net: number;
  paymentMethod: 'visa' | 'mastercard' | 'amex' | 'ach' | 'wire' | 'paypal' | 'apple_pay';
  last4?: string;
  status: 'succeeded' | 'refunded' | 'failed' | 'disputed';
  date: string;
  refundReason?: string;
  refundAmount?: number;
}

export interface DiscountCoupon {
  id: string;
  code: string;
  description: string;
  type: 'percent' | 'fixed_amount';
  value: number; // e.g. 20 for 20%, or 50 for $50
  duration: 'once' | 'repeating' | 'forever';
  durationInMonths?: number;
  maxRedemptions: number;
  timesRedeemed: number;
  expiryDate: string;
  status: 'active' | 'expired' | 'disabled';
  applicablePlanIds?: string[];
}

export interface RevenueMetricPoint {
  date: string;
  label: string;
  mrr: number;
  arr: number;
  newMrr: number;
  expansionMrr: number;
  churnMrr: number;
  netMrr: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface ActivityNotification {
  id: string;
  type: 'payment' | 'subscription' | 'customer' | 'invoice';
  title: string;
  description: string;
  timeAgo: string;
  unread: boolean;
  linkTab?: NavigationTab;
}
