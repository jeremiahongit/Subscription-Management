import {
  Customer,
  Plan,
  Subscription,
  Invoice,
  PaymentTransaction,
  DiscountCoupon,
  RevenueMetricPoint,
  ActivityNotification,
  AppUser
} from '../types';

export const INITIAL_PLANS: Plan[] = [
  {
    id: 'plan_starter',
    name: 'Starter',
    tierCode: 'ST-01',
    priceMonthly: 2499,
    priceAnnual: 23990,
    billingCadence: 'monthly',
    description: 'Essential billing and subscription core for early-stage SaaS ventures.',
    features: [
      'Up to 3 team seats',
      '5,000 monthly active users',
      'Standard payment processing & UPI',
      'Email dunning sequences',
      'Community support'
    ],
    limits: {
      seats: 3,
      apiCalls: '50,000 / mo',
      storage: '10 GB'
    },
    subscribersCount: 842,
    mrrContributed: 2104158,
    status: 'active'
  },
  {
    id: 'plan_growth',
    name: 'Growth',
    tierCode: 'GW-02',
    priceMonthly: 7999,
    priceAnnual: 76790,
    billingCadence: 'monthly',
    description: 'Advanced metrics, automated retention tools, and multi-currency billing.',
    features: [
      'Up to 10 team seats',
      '25,000 monthly active users',
      'Smart retry & churn prevention',
      'Custom webhook triggers',
      'Standard SLA & live chat'
    ],
    limits: {
      seats: 10,
      apiCalls: '250,000 / mo',
      storage: '50 GB'
    },
    subscribersCount: 520,
    mrrContributed: 4159480,
    isPopular: true,
    status: 'active'
  },
  {
    id: 'plan_scale',
    name: 'Scale',
    tierCode: 'SC-03',
    priceMonthly: 19999,
    priceAnnual: 191990,
    billingCadence: 'monthly',
    description: 'High-volume throughput, custom GST integrations, and revenue recognition.',
    features: [
      'Up to 30 team seats',
      '100,000 monthly active users',
      'Automated GST 18% & ASC 606 revenue waterfall',
      'Dedicated IP & high-throughput API',
      'Priority 24/7 technical hotline'
    ],
    limits: {
      seats: 30,
      apiCalls: '1,500,000 / mo',
      storage: '250 GB'
    },
    subscribersCount: 168,
    mrrContributed: 3359832,
    status: 'active'
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    tierCode: 'EN-04',
    priceMonthly: 49999,
    priceAnnual: 479990,
    billingCadence: 'monthly',
    description: 'Custom security guardrails, SOC2 audit bundles, SSO/SAML, and bespoke contracts.',
    features: [
      'Unlimited team seats',
      'Custom monthly active volume',
      'SAML SSO & SCIM directory sync',
      'Custom contract terms & invoicing',
      'Dedicated Account Director'
    ],
    limits: {
      seats: 'Unlimited',
      apiCalls: 'Custom / Dedicated',
      storage: '1 TB+'
    },
    subscribersCount: 42,
    mrrContributed: 2099958,
    status: 'active'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_01',
    name: 'Sarah Chen',
    email: 'sarah.chen@nexustech.io',
    company: 'Nexus Technologies',
    planId: 'plan_scale',
    status: 'active',
    mrr: 19999,
    lifetimeSpend: 239988,
    billingAddress: {
      street: '452 Mission Street, Suite 1400',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'United States'
    },
    paymentMethod: {
      brand: 'visa',
      last4: '4242',
      expMonth: 8,
      expYear: 2028
    },
    phone: '+1 (415) 890-2134',
    taxId: 'US-942817264',
    createdAt: '2025-02-14',
    notes: 'Key scale customer. Migrated smoothly. Potential Enterprise expansion in Q4.'
  },
  {
    id: 'cust_02',
    name: 'Marcus Vance',
    email: 'm.vance@hyperionsolutions.com',
    company: 'Hyperion Solutions',
    planId: 'plan_enterprise',
    status: 'active',
    mrr: 49999,
    lifetimeSpend: 599988,
    billingAddress: {
      street: '1201 3rd Ave, 22nd Floor',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'United States'
    },
    paymentMethod: {
      brand: 'amex',
      last4: '1004',
      expMonth: 11,
      expYear: 2027
    },
    phone: '+1 (206) 555-0199',
    taxId: 'US-918237461',
    createdAt: '2024-09-10',
    notes: 'Enterprise contract paid annually. Dedicated 99.99% SLA.'
  },
  {
    id: 'cust_03',
    name: 'Elena Rostova',
    email: 'elena@nordicflow.se',
    company: 'NordicFlow AB',
    planId: 'plan_growth',
    status: 'active',
    mrr: 7999,
    lifetimeSpend: 95988,
    billingAddress: {
      street: 'Kungsgatan 44',
      city: 'Stockholm',
      state: 'Stockholm',
      postalCode: '111 35',
      country: 'Sweden'
    },
    paymentMethod: {
      brand: 'mastercard',
      last4: '8831',
      expMonth: 4,
      expYear: 2029
    },
    phone: '+46 8 123 4567',
    taxId: 'SE556123456701',
    createdAt: '2025-06-20',
    notes: 'Uses EU reverse charge handling. Active user of webhooks.'
  },
  {
    id: 'cust_04',
    name: 'David O\'Connor',
    email: 'david@meridiananalytics.co',
    company: 'Meridian Analytics',
    planId: 'plan_growth',
    status: 'delinquent',
    mrr: 7999,
    lifetimeSpend: 47994,
    billingAddress: {
      street: '77 St Georges Terrace',
      city: 'Perth',
      state: 'WA',
      postalCode: '6000',
      country: 'Australia'
    },
    paymentMethod: {
      brand: 'visa',
      last4: '9012',
      expMonth: 3,
      expYear: 2026
    },
    phone: '+61 8 9200 1100',
    taxId: 'AU89123456789',
    createdAt: '2025-11-03',
    notes: 'Card charge failed on renewal. Dunning email #2 sent automatically.'
  },
  {
    id: 'cust_05',
    name: 'Amina Mansour',
    email: 'amina@cairofin.tech',
    company: 'CairoFin Labs',
    planId: 'plan_scale',
    status: 'active',
    mrr: 19999,
    lifetimeSpend: 119994,
    billingAddress: {
      street: 'Tahrir Square Hub 9',
      city: 'Cairo',
      state: 'Cairo',
      postalCode: '11511',
      country: 'Egypt'
    },
    paymentMethod: {
      brand: 'mastercard',
      last4: '5543',
      expMonth: 12,
      expYear: 2027
    },
    phone: '+20 2 2795 0000',
    taxId: 'EG-304-921-118',
    createdAt: '2025-08-15',
    notes: 'Fast-growing fintech team. Requested additional webhook capacity.'
  },
  {
    id: 'cust_06',
    name: 'Rohan Sharma',
    email: 'rohan@indiasaas.in',
    company: 'IndiaSaaS Tech Pvt Ltd',
    planId: 'plan_growth',
    status: 'active',
    mrr: 7999,
    lifetimeSpend: 63992,
    billingAddress: {
      street: '14 MG Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India'
    },
    paymentMethod: {
      brand: 'visa',
      last4: '3142',
      expMonth: 7,
      expYear: 2028
    },
    phone: '+91 80 4123 4567',
    taxId: '29ABCDE1234F1Z5',
    createdAt: '2025-10-01',
    notes: 'GST registered customer in Bengaluru. Pays on UPI and Corporate Card.'
  },
  {
    id: 'cust_07',
    name: 'Hannah Brooks',
    email: 'hannah@loomcraft.design',
    company: 'Loomcraft Studio',
    planId: 'plan_starter',
    status: 'trialing',
    mrr: 2499,
    lifetimeSpend: 0,
    billingAddress: {
      street: '24 Austin Friars',
      city: 'London',
      state: 'Greater London',
      postalCode: 'EC2N 2EY',
      country: 'United Kingdom'
    },
    paymentMethod: {
      brand: 'visa',
      last4: '7721',
      expMonth: 9,
      expYear: 2029
    },
    phone: '+44 20 7946 0912',
    createdAt: '2026-03-24',
    notes: 'Day 10 of 14-day free trial. High engagement in reporting panel.'
  },
  {
    id: 'cust_08',
    name: 'Liam Zhang',
    email: 'liam@vertexbio.com',
    company: 'Vertex Biosciences',
    planId: 'plan_enterprise',
    status: 'active',
    mrr: 49999,
    lifetimeSpend: 449991,
    billingAddress: {
      street: '100 Binney Street',
      city: 'Cambridge',
      state: 'MA',
      postalCode: '02142',
      country: 'United States'
    },
    paymentMethod: {
      brand: 'amex',
      last4: '9901',
      expMonth: 5,
      expYear: 2028
    },
    phone: '+1 (617) 555-0182',
    taxId: 'US-042847291',
    createdAt: '2025-05-12',
    notes: 'Bio-informatics SaaS pipeline. Required HIPAA-compliant data routing.'
  }
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_8421',
    customerId: 'cust_01',
    customerName: 'Sarah Chen',
    customerEmail: 'sarah.chen@nexustech.io',
    company: 'Nexus Technologies',
    planId: 'plan_scale',
    planName: 'Scale',
    status: 'active',
    billingCycle: 'monthly',
    amount: 19999,
    startDate: '2025-02-14',
    renewalDate: '2026-11-14',
    autoRenew: true,
    seats: 24
  },
  {
    id: 'sub_8422',
    customerId: 'cust_02',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@hyperionsolutions.com',
    company: 'Hyperion Solutions',
    planId: 'plan_enterprise',
    planName: 'Enterprise',
    status: 'active',
    billingCycle: 'annual',
    amount: 479990,
    startDate: '2024-09-10',
    renewalDate: '2027-09-10',
    autoRenew: true,
    seats: 65
  },
  {
    id: 'sub_8423',
    customerId: 'cust_03',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@nordicflow.se',
    company: 'NordicFlow AB',
    planId: 'plan_growth',
    planName: 'Growth',
    status: 'active',
    billingCycle: 'monthly',
    amount: 7999,
    startDate: '2025-06-20',
    renewalDate: '2026-11-20',
    autoRenew: true,
    seats: 8
  },
  {
    id: 'sub_8424',
    customerId: 'cust_04',
    customerName: 'David O\'Connor',
    customerEmail: 'david@meridiananalytics.co',
    company: 'Meridian Analytics',
    planId: 'plan_growth',
    planName: 'Growth',
    status: 'past_due',
    billingCycle: 'monthly',
    amount: 7999,
    startDate: '2025-11-03',
    renewalDate: '2026-10-03',
    autoRenew: true,
    seats: 7
  },
  {
    id: 'sub_8425',
    customerId: 'cust_05',
    customerName: 'Amina Mansour',
    customerEmail: 'amina@cairofin.tech',
    company: 'CairoFin Labs',
    planId: 'plan_scale',
    planName: 'Scale',
    status: 'active',
    billingCycle: 'monthly',
    amount: 19999,
    startDate: '2025-08-15',
    renewalDate: '2026-11-15',
    autoRenew: true,
    seats: 18
  },
  {
    id: 'sub_8426',
    customerId: 'cust_06',
    customerName: 'Rohan Sharma',
    customerEmail: 'rohan@indiasaas.in',
    company: 'IndiaSaaS Tech Pvt Ltd',
    planId: 'plan_growth',
    planName: 'Growth',
    status: 'active',
    billingCycle: 'monthly',
    amount: 7999,
    startDate: '2025-10-01',
    renewalDate: '2026-11-01',
    autoRenew: true,
    seats: 10
  },
  {
    id: 'sub_8427',
    customerId: 'cust_07',
    customerName: 'Hannah Brooks',
    customerEmail: 'hannah@loomcraft.design',
    company: 'Loomcraft Studio',
    planId: 'plan_starter',
    planName: 'Starter',
    status: 'in_trial',
    billingCycle: 'monthly',
    amount: 2499,
    startDate: '2026-03-24',
    renewalDate: '2026-11-07',
    autoRenew: true,
    seats: 2
  },
  {
    id: 'sub_8428',
    customerId: 'cust_08',
    customerName: 'Liam Zhang',
    customerEmail: 'liam@vertexbio.com',
    company: 'Vertex Biosciences',
    planId: 'plan_enterprise',
    planName: 'Enterprise',
    status: 'active',
    billingCycle: 'monthly',
    amount: 49999,
    startDate: '2025-05-12',
    renewalDate: '2026-11-12',
    autoRenew: true,
    seats: 45
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv_1092',
    number: 'INV-2026-1092',
    customerId: 'cust_01',
    customerName: 'Sarah Chen',
    customerEmail: 'sarah.chen@nexustech.io',
    company: 'Nexus Technologies',
    issueDate: '2026-10-14',
    dueDate: '2026-10-28',
    paidDate: '2026-10-14',
    subtotal: 19999.00,
    tax: 3599.82,
    discountAmount: 0,
    total: 23598.82,
    status: 'paid',
    paymentMethod: 'Visa •••• 4242',
    items: [
      {
        id: 'item_1',
        description: 'Scale Subscription - 1 Month Recurring Plan',
        quantity: 1,
        unitPrice: 19999.00,
        amount: 19999.00
      }
    ],
    notes: 'Thank you for your business. Subscription automatically renews next month.'
  },
  {
    id: 'inv_1091',
    number: 'INV-2026-1091',
    customerId: 'cust_08',
    customerName: 'Liam Zhang',
    customerEmail: 'liam@vertexbio.com',
    company: 'Vertex Biosciences',
    issueDate: '2026-10-12',
    dueDate: '2026-10-26',
    paidDate: '2026-10-12',
    subtotal: 49999.00,
    tax: 0,
    discountAmount: 0,
    total: 49999.00,
    status: 'paid',
    paymentMethod: 'Amex •••• 9901',
    items: [
      {
        id: 'item_2',
        description: 'Enterprise Plan - Monthly Billing (45 Seats included)',
        quantity: 1,
        unitPrice: 49999.00,
        amount: 49999.00
      }
    ],
    notes: 'Tax exemption certificate US-042847291 applied.'
  },
  {
    id: 'inv_1090',
    number: 'INV-2026-1090',
    customerId: 'cust_06',
    customerName: 'Rohan Sharma',
    customerEmail: 'rohan@indiasaas.in',
    company: 'IndiaSaaS Tech Pvt Ltd',
    issueDate: '2026-10-01',
    dueDate: '2026-10-15',
    paidDate: '2026-10-02',
    subtotal: 7999.00,
    tax: 1439.82,
    discountAmount: 0,
    total: 9438.82,
    status: 'paid',
    paymentMethod: 'UPI / Corporate Card',
    items: [
      {
        id: 'item_3',
        description: 'Growth Subscription - Monthly recurring (GST 18%)',
        quantity: 1,
        unitPrice: 7999.00,
        amount: 7999.00
      }
    ]
  },
  {
    id: 'inv_1089',
    number: 'INV-2026-1089',
    customerId: 'cust_04',
    customerName: 'David O\'Connor',
    customerEmail: 'david@meridiananalytics.co',
    company: 'Meridian Analytics',
    issueDate: '2026-10-03',
    dueDate: '2026-10-17',
    subtotal: 7999.00,
    tax: 799.90,
    discountAmount: 0,
    total: 8798.90,
    status: 'overdue',
    items: [
      {
        id: 'item_4',
        description: 'Growth Subscription - Monthly recurring (Overdue)',
        quantity: 1,
        unitPrice: 7999.00,
        amount: 7999.00
      }
    ],
    notes: 'Automated dunning in progress. Grace period expires in 4 days.'
  },
  {
    id: 'inv_1087',
    number: 'INV-2026-1087',
    customerId: 'cust_05',
    customerName: 'Amina Mansour',
    customerEmail: 'amina@cairofin.tech',
    company: 'CairoFin Labs',
    issueDate: '2026-10-25',
    dueDate: '2026-11-08',
    subtotal: 19999.00,
    tax: 0,
    discountAmount: 2500.00,
    total: 17499.00,
    status: 'open',
    items: [
      {
        id: 'item_6',
        description: 'Scale Subscription - Special Renewal Coupon Applied',
        quantity: 1,
        unitPrice: 19999.00,
        amount: 19999.00
      }
    ],
    notes: 'Promo code GROWTH20 adjusted applied.'
  }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'tx_9841284',
    invoiceId: 'inv_1092',
    customerId: 'cust_01',
    customerName: 'Sarah Chen',
    customerEmail: 'sarah.chen@nexustech.io',
    amount: 23598.82,
    fee: 471.97,
    net: 23126.85,
    paymentMethod: 'visa',
    last4: '4242',
    status: 'succeeded',
    date: '2026-10-14 09:21:18'
  },
  {
    id: 'tx_9841283',
    invoiceId: 'inv_1091',
    customerId: 'cust_08',
    customerName: 'Liam Zhang',
    customerEmail: 'liam@vertexbio.com',
    amount: 49999.00,
    fee: 999.98,
    net: 48999.02,
    paymentMethod: 'amex',
    last4: '9901',
    status: 'succeeded',
    date: '2026-10-12 14:05:44'
  },
  {
    id: 'tx_9841282',
    customerId: 'cust_04',
    customerName: 'David O\'Connor',
    customerEmail: 'david@meridiananalytics.co',
    amount: 8798.90,
    fee: 0,
    net: 0,
    paymentMethod: 'visa',
    last4: '9012',
    status: 'failed',
    date: '2026-10-03 04:12:02'
  },
  {
    id: 'tx_9841281',
    invoiceId: 'inv_1090',
    customerId: 'cust_06',
    customerName: 'Rohan Sharma',
    customerEmail: 'rohan@indiasaas.in',
    amount: 9438.82,
    fee: 188.77,
    net: 9250.05,
    paymentMethod: 'visa',
    last4: '3142',
    status: 'succeeded',
    date: '2026-10-02 11:32:50'
  },
  {
    id: 'tx_9841279',
    customerId: 'cust_03',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@nordicflow.se',
    amount: 7999.00,
    fee: 159.98,
    net: 7839.02,
    paymentMethod: 'mastercard',
    last4: '8831',
    status: 'succeeded',
    date: '2026-09-20 08:14:22'
  },
  {
    id: 'tx_9841278',
    customerId: 'cust_02',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@hyperionsolutions.com',
    amount: 479990.00,
    fee: 2500.00,
    net: 477490.00,
    paymentMethod: 'ach',
    status: 'succeeded',
    date: '2026-09-10 10:00:00'
  }
];

export const INITIAL_DISCOUNTS: DiscountCoupon[] = [
  {
    id: 'disc_01',
    code: 'FOUNDER50',
    description: '50% off for the first 3 months on Growth & Scale plans.',
    type: 'percent',
    value: 50,
    duration: 'repeating',
    durationInMonths: 3,
    maxRedemptions: 100,
    timesRedeemed: 64,
    expiryDate: '2026-12-31',
    status: 'active',
    applicablePlanIds: ['plan_growth', 'plan_scale']
  },
  {
    id: 'disc_02',
    code: 'ANNUALSAVE20',
    description: 'Flat 20% discount on any annual upfront commitment.',
    type: 'percent',
    value: 20,
    duration: 'forever',
    maxRedemptions: 500,
    timesRedeemed: 218,
    expiryDate: '2027-01-01',
    status: 'active'
  },
  {
    id: 'disc_03',
    code: 'STARTUPCREDIT5000',
    description: '₹5,000 off invoice credit for early stage DPIIT-recognized startups.',
    type: 'fixed_amount',
    value: 5000,
    duration: 'once',
    maxRedemptions: 50,
    timesRedeemed: 42,
    expiryDate: '2026-11-30',
    status: 'active',
    applicablePlanIds: ['plan_scale', 'plan_enterprise']
  }
];

export const REVENUE_TIMELINE_DATA: RevenueMetricPoint[] = [
  { date: '2025-11', label: 'Nov 25', mrr: 840000, arr: 10080000, newMrr: 95000, expansionMrr: 32000, churnMrr: 12000, netMrr: 115000 },
  { date: '2025-12', label: 'Dec 25', mrr: 890000, arr: 10680000, newMrr: 88000, expansionMrr: 39000, churnMrr: 15000, netMrr: 112000 },
  { date: '2026-01', label: 'Jan 26', mrr: 950000, arr: 11400000, newMrr: 102000, expansionMrr: 44000, churnMrr: 14000, netMrr: 132000 },
  { date: '2026-02', label: 'Feb 26', mrr: 995000, arr: 11940000, newMrr: 82000, expansionMrr: 36000, churnMrr: 11000, netMrr: 107000 },
  { date: '2026-03', label: 'Mar 26', mrr: 1045000, arr: 12540000, newMrr: 96000, expansionMrr: 42000, churnMrr: 16000, netMrr: 122000 },
  { date: '2026-04', label: 'Apr 26', mrr: 1090000, arr: 13080000, newMrr: 89000, expansionMrr: 39000, churnMrr: 13000, netMrr: 115000 },
  { date: '2026-05', label: 'May 26', mrr: 1145000, arr: 13740000, newMrr: 108000, expansionMrr: 48000, churnMrr: 14000, netMrr: 142000 },
  { date: '2026-06', label: 'Jun 26', mrr: 1195000, arr: 14340000, newMrr: 101000, expansionMrr: 46000, churnMrr: 17000, netMrr: 130000 },
  { date: '2026-07', label: 'Jul 26', mrr: 1240000, arr: 14880000, newMrr: 98000, expansionMrr: 49000, churnMrr: 15000, netMrr: 132000 },
  { date: '2026-08', label: 'Aug 26', mrr: 1290000, arr: 15480000, newMrr: 104000, expansionMrr: 54000, churnMrr: 16000, netMrr: 142000 },
  { date: '2026-09', label: 'Sep 26', mrr: 1350000, arr: 16200000, newMrr: 118000, expansionMrr: 61000, churnMrr: 14000, netMrr: 165000 },
  { date: '2026-10', label: 'Oct 26', mrr: 1425000, arr: 17100000, newMrr: 125000, expansionMrr: 65000, churnMrr: 13500, netMrr: 176500 }
];

export const INITIAL_NOTIFICATIONS: ActivityNotification[] = [
  {
    id: 'notif_1',
    type: 'payment',
    title: 'Payment Received',
    description: 'Nexus Technologies paid $432.91 via Visa •••• 4242',
    timeAgo: '12m ago',
    unread: true,
    linkTab: 'payments'
  },
  {
    id: 'notif_2',
    type: 'subscription',
    title: 'New Enterprise Plan',
    description: 'Vertex Biosciences upgraded to Enterprise tier ($999/mo)',
    timeAgo: '1h ago',
    unread: true,
    linkTab: 'subscriptions'
  },
  {
    id: 'notif_3',
    type: 'payment',
    title: 'Dunning Alert',
    description: 'Card renewal failed for Meridian Analytics ($163.90). Automated retry scheduled.',
    timeAgo: '3h ago',
    unread: true,
    linkTab: 'customers'
  },
  {
    id: 'notif_4',
    type: 'invoice',
    title: 'Invoice Due Soon',
    description: 'Invoice INV-2026-1087 for CairoFin Labs is due in 3 days',
    timeAgo: '1d ago',
    unread: false,
    linkTab: 'invoices'
  }
];

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr_01',
    name: 'Alex Vance',
    email: 'admin@brightloop.io',
    role: 'ADMIN',
    title: 'VP of Finance & Operations',
    department: 'Executive',
    status: 'active',
    avatarInitials: 'AV',
    avatarBg: 'bg-indigo-600',
    lastActive: 'Active now',
    twoFactorEnabled: true,
    createdAt: '2025-01-15',
    password: 'password123'
  },
  {
    id: 'usr_02',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@brightloop.io',
    role: 'BILLING_MANAGER',
    title: 'Lead Revenue Operations',
    department: 'Finance',
    status: 'active',
    avatarInitials: 'SJ',
    avatarBg: 'bg-blue-600',
    lastActive: '25m ago',
    twoFactorEnabled: true,
    createdAt: '2025-03-20',
    password: 'password123'
  },
  {
    id: 'usr_03',
    name: 'Dev Patel',
    email: 'dev.patel@brightloop.io',
    role: 'STAFF',
    title: 'Customer Billing Specialist',
    department: 'Customer Support',
    status: 'active',
    avatarInitials: 'DP',
    avatarBg: 'bg-emerald-600',
    lastActive: '2h ago',
    twoFactorEnabled: false,
    createdAt: '2025-06-11',
    password: 'password123'
  },
  {
    id: 'usr_04',
    name: 'Maya Lin',
    email: 'maya.lin@brightloop.io',
    role: 'VIEWER',
    title: 'External Financial Auditor',
    department: 'Compliance',
    status: 'active',
    avatarInitials: 'ML',
    avatarBg: 'bg-purple-600',
    lastActive: '1d ago',
    twoFactorEnabled: true,
    createdAt: '2025-09-04',
    password: 'password123'
  },
  {
    id: 'usr_05',
    name: 'Jordan Hayes',
    email: 'jordan.hayes@brightloop.io',
    role: 'STAFF',
    title: 'Accounts Receivable Associate',
    department: 'Finance',
    status: 'invited',
    avatarInitials: 'JH',
    avatarBg: 'bg-amber-600',
    lastActive: 'Invite pending',
    twoFactorEnabled: false,
    createdAt: '2026-10-28',
    password: 'password123'
  }
];

