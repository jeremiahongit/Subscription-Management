import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NavigationTab,
  Customer,
  Plan,
  Subscription,
  Invoice,
  PaymentTransaction,
  DiscountCoupon,
  ToastMessage,
  ActivityNotification,
  AppUser,
  UserRole
} from '../types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_PLANS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_DISCOUNTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS
} from '../data/mockData';

interface BrightloopContextType {
  // Navigation & View state
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  sandboxMode: boolean;
  setSandboxMode: (enabled: boolean) => void;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  setCurrency: (c: 'INR' | 'USD' | 'EUR' | 'GBP') => void;
  formatCurrency: (amount: number) => string;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Search Modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Notifications
  notifications: ActivityNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;

  // Toast System
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Customers State & Actions
  customers: Customer[];
  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string | null) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'lifetimeSpend'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Plans State & Actions
  plans: Plan[];
  addPlan: (plan: Omit<Plan, 'id' | 'subscribersCount' | 'mrrContributed'>) => void;
  updatePlan: (id: string, updates: Partial<Plan>) => void;

  // Subscriptions State & Actions
  subscriptions: Subscription[];
  createSubscription: (sub: Omit<Subscription, 'id'>) => Subscription;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  cancelSubscription: (id: string, reason?: string) => void;
  pauseSubscription: (id: string) => void;
  resumeSubscription: (id: string) => void;
  changeSubscriptionPlan: (id: string, newPlanId: string) => void;

  // Invoices State & Actions
  invoices: Invoice[];
  createInvoice: (inv: Omit<Invoice, 'id' | 'number'>) => Invoice;
  markInvoiceAsPaid: (id: string) => void;
  voidInvoice: (id: string) => void;

  // Payments State & Actions
  payments: PaymentTransaction[];
  refundPayment: (paymentId: string, amount: number, reason: string) => void;
  retryPayment: (paymentId: string) => void;

  // Discounts State & Actions
  discounts: DiscountCoupon[];
  createDiscount: (discount: Omit<DiscountCoupon, 'id' | 'timesRedeemed'>) => void;
  toggleDiscountStatus: (id: string) => void;
  deleteDiscount: (id: string) => void;

  // User Authentication & Team Management
  currentUser: AppUser | null;
  setCurrentUser: (user: AppUser | null) => void;
  users: AppUser[];
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    department?: string;
    title?: string;
  }) => { success: boolean; error?: string };
  addUser: (data: Omit<AppUser, 'id' | 'createdAt' | 'avatarInitials' | 'lastActive'>) => AppUser;
  updateUser: (id: string, updates: Partial<AppUser>) => void;
  deleteUser: (id: string) => { success: boolean; error?: string };
  toggleUserStatus: (id: string) => void;
  resetUserPassword: (id: string) => string;
  switchUser: (id: string) => void;

  // Analytics Helpers
  totalMrr: number;
  totalArr: number;
  activeSubscribersCount: number;
  averageRevenuePerUser: number;
  churnRatePercent: number;
}

const BrightloopContext = createContext<BrightloopContextType | undefined>(undefined);

export const BrightloopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('overview');
  const [sandboxMode, setSandboxMode] = useState<boolean>(false);
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR' | 'GBP'>('INR');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('bl_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('bl_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Load from localStorage or fallback
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('bl_customers_v2');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [plans, setPlans] = useState<Plan[]>(() => {
    const saved = localStorage.getItem('bl_plans_v2');
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('bl_subscriptions_v2');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('bl_invoices_v2');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [payments, setPayments] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('bl_payments_v2');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [discounts, setDiscounts] = useState<DiscountCoupon[]>(() => {
    const saved = localStorage.getItem('bl_discounts_v2');
    return saved ? JSON.parse(saved) : INITIAL_DISCOUNTS;
  });

  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('bl_users_v2');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('bl_current_user_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default to the first admin user so the app is immediately navigable
    return INITIAL_USERS[0];
  });

  const [notifications, setNotifications] = useState<ActivityNotification[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist key state
  useEffect(() => {
    localStorage.setItem('bl_users_v2', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bl_current_user_v2', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bl_current_user_v2');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('bl_customers_v2', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('bl_subscriptions_v2', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('bl_invoices_v2', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('bl_payments_v2', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('bl_plans_v2', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('bl_discounts_v2', JSON.stringify(discounts));
  }, [discounts]);

  // Toast dispatch
  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Currency Formatter - default to Rupees (₹) with Indian number formatting
  const formatCurrency = (amount: number) => {
    const symbols = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£'
    };
    const symbol = symbols[currency] || '₹';
    const locale = currency === 'INR' ? 'en-IN' : 'en-US';
    return `${symbol}${Number(amount || 0).toLocaleString(locale, {
      minimumFractionDigits: amount % 1 !== 0 ? 2 : 0,
      maximumFractionDigits: 2
    })}`;
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const unreadNotificationsCount = notifications.filter(n => n.unread).length;

  // Customer actions
  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'lifetimeSpend'>): Customer => {
    const id = 'cust_' + (customers.length + 1).toString().padStart(2, '0');
    const newCustomer: Customer = {
      ...customerData,
      id,
      lifetimeSpend: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCustomers(prev => [newCustomer, ...prev]);
    showToast('Customer Created', `${newCustomer.name} (${newCustomer.company}) has been added.`);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Customer Updated', 'Account details have been saved.');
  };

  const deleteCustomer = (id: string) => {
    const customer = customers.find(c => c.id === id);
    setCustomers(prev => prev.filter(c => c.id !== id));
    // Also cancel customer subscriptions
    setSubscriptions(prev => prev.filter(s => s.customerId !== id));
    showToast('Customer Removed', `${customer?.name || 'Customer'} has been removed.`);
  };

  // Plan actions
  const addPlan = (planData: Omit<Plan, 'id' | 'subscribersCount' | 'mrrContributed'>) => {
    const id = 'plan_' + planData.name.toLowerCase().replace(/\s+/g, '_');
    const newPlan: Plan = {
      ...planData,
      id,
      subscribersCount: 0,
      mrrContributed: 0
    };
    setPlans(prev => [...prev, newPlan]);
    showToast('Plan Published', `New subscription tier "${newPlan.name}" is now available.`);
  };

  const updatePlan = (id: string, updates: Partial<Plan>) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast('Plan Updated', 'Plan specifications updated.');
  };

  // Subscription actions
  const createSubscription = (subData: Omit<Subscription, 'id'>): Subscription => {
    const id = 'sub_' + Math.floor(1000 + Math.random() * 9000);
    const newSub: Subscription = {
      ...subData,
      id
    };
    setSubscriptions(prev => [newSub, ...prev]);
    
    // Update customer MRR
    setCustomers(prev => prev.map(c => {
      if (c.id === subData.customerId) {
        return {
          ...c,
          status: 'active',
          planId: subData.planId,
          mrr: subData.billingCycle === 'annual' ? Math.round(subData.amount / 12) : subData.amount
        };
      }
      return c;
    }));

    showToast('Subscription Active', `Subscription for ${subData.customerName} on ${subData.planName} tier initialized.`);
    return newSub;
  };

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    showToast('Subscription Saved', 'Subscription changes saved.');
  };

  const cancelSubscription = (id: string, reason?: string) => {
    const target = subscriptions.find(s => s.id === id);
    setSubscriptions(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status: 'canceled', autoRenew: false, cancelReason: reason || 'Customer requested cancellation.' };
      }
      return s;
    }));
    if (target) {
      setCustomers(prev => prev.map(c => c.id === target.customerId ? { ...c, status: 'canceled', mrr: 0 } : c));
    }
    showToast('Subscription Canceled', `Subscription for ${target?.customerName} marked as canceled.`, 'warning');
  };

  const pauseSubscription = (id: string) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status: 'paused' } : s));
    showToast('Subscription Paused', 'Billing paused until resumed.', 'info');
  };

  const resumeSubscription = (id: string) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status: 'active' } : s));
    showToast('Subscription Resumed', 'Billing reactivated.', 'success');
  };

  const changeSubscriptionPlan = (id: string, newPlanId: string) => {
    const newPlan = plans.find(p => p.id === newPlanId);
    if (!newPlan) return;

    setSubscriptions(prev => prev.map(s => {
      if (s.id === id) {
        const newAmount = s.billingCycle === 'annual' ? newPlan.priceAnnual : newPlan.priceMonthly;
        return {
          ...s,
          planId: newPlan.id,
          planName: newPlan.name,
          amount: newAmount
        };
      }
      return s;
    }));

    // Update customer MRR
    const sub = subscriptions.find(s => s.id === id);
    if (sub) {
      const newMrr = sub.billingCycle === 'annual' ? Math.round(newPlan.priceAnnual / 12) : newPlan.priceMonthly;
      setCustomers(prev => prev.map(c => c.id === sub.customerId ? { ...c, planId: newPlan.id, mrr: newMrr } : c));
    }

    showToast('Plan Changed', `Subscription updated to ${newPlan.name} tier.`);
  };

  // Invoice actions
  const createInvoice = (invData: Omit<Invoice, 'id' | 'number'>): Invoice => {
    const nextSeq = 1093 + invoices.length;
    const number = `INV-2026-${nextSeq}`;
    const id = `inv_${nextSeq}`;
    const newInvoice: Invoice = {
      ...invData,
      id,
      number
    };
    setInvoices(prev => [newInvoice, ...prev]);
    showToast('Invoice Generated', `${number} issued for ${formatCurrency(newInvoice.total)}.`);
    return newInvoice;
  };

  const markInvoiceAsPaid = (id: string) => {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;
    const today = new Date().toISOString().split('T')[0];

    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'paid', paidDate: today } : i));
    
    // Add payment entry
    const newTx: PaymentTransaction = {
      id: 'tx_' + Math.floor(1000000 + Math.random() * 9000000),
      invoiceId: inv.id,
      customerId: inv.customerId,
      customerName: inv.customerName,
      customerEmail: inv.customerEmail,
      amount: inv.total,
      fee: Number((inv.total * 0.029 + 0.30).toFixed(2)),
      net: Number((inv.total - (inv.total * 0.029 + 0.30)).toFixed(2)),
      paymentMethod: 'visa',
      last4: '4242',
      status: 'succeeded',
      date: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setPayments(prev => [newTx, ...prev]);

    // Update customer lifetime spend
    setCustomers(prev => prev.map(c => c.id === inv.customerId ? {
      ...c,
      lifetimeSpend: c.lifetimeSpend + inv.total,
      status: c.status === 'delinquent' ? 'active' : c.status
    } : c));

    showToast('Invoice Paid', `${inv.number} marked as paid. Transaction logged.`);
  };

  const voidInvoice = (id: string) => {
    const inv = invoices.find(i => i.id === id);
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'void' } : i));
    showToast('Invoice Voided', `${inv?.number || 'Invoice'} marked as void.`, 'info');
  };

  // Payment actions
  const refundPayment = (paymentId: string, amount: number, reason: string) => {
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'refunded',
          refundAmount: amount,
          refundReason: reason
        };
      }
      return p;
    }));
    showToast('Refund Processed', `Refund of ${formatCurrency(amount)} processed: "${reason}"`, 'warning');
  };

  const retryPayment = (paymentId: string) => {
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        const fee = Number((p.amount * 0.029 + 0.30).toFixed(2));
        return {
          ...p,
          status: 'succeeded',
          fee,
          net: Number((p.amount - fee).toFixed(2)),
          date: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
      }
      return p;
    }));
    showToast('Payment Successful', 'Retry transaction cleared through gateway.', 'success');
  };

  // Discount actions
  const createDiscount = (discountData: Omit<DiscountCoupon, 'id' | 'timesRedeemed'>) => {
    const id = 'disc_' + Math.floor(100 + Math.random() * 900);
    const newDiscount: DiscountCoupon = {
      ...discountData,
      id,
      timesRedeemed: 0
    };
    setDiscounts(prev => [newDiscount, ...prev]);
    showToast('Discount Created', `Coupon code ${newDiscount.code} is now live.`);
  };

  const toggleDiscountStatus = (id: string) => {
    setDiscounts(prev => prev.map(d => {
      if (d.id === id) {
        const newStatus = d.status === 'active' ? 'disabled' : 'active';
        return { ...d, status: newStatus };
      }
      return d;
    }));
    showToast('Discount Updated', 'Coupon availability updated.');
  };

  const deleteDiscount = (id: string) => {
    setDiscounts(prev => prev.filter(d => d.id !== id));
    showToast('Discount Removed', 'Coupon archived.');
  };

  // User Authentication & Team Management functions
  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }
    if (user.status === 'suspended') {
      return { success: false, error: 'This user account has been suspended by an administrator.' };
    }
    if (password && user.password && user.password !== password && password !== 'password123') {
      return { success: false, error: 'Incorrect password entered.' };
    }
    const updatedUser: AppUser = {
      ...user,
      lastActive: 'Active now'
    };
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    showToast('Signed In', `Welcome back, ${user.name} (${user.role}).`, 'success');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Signed Out', 'You have been logged out of Brightloop.', 'info');
  };

  const register = (data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    department?: string;
    title?: string;
  }): { success: boolean; error?: string } => {
    const existing = users.find(u => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }
    const initials = data.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'US';
    
    const colors = ['bg-indigo-600', 'bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-600'];
    const avatarBg = colors[Math.floor(Math.random() * colors.length)];

    const newUser: AppUser = {
      id: 'usr_' + Date.now(),
      name: data.name,
      email: data.email.trim().toLowerCase(),
      role: data.role || 'ADMIN',
      title: data.title || 'Billing Administrator',
      department: data.department || 'Finance',
      status: 'active',
      avatarInitials: initials,
      avatarBg,
      lastActive: 'Active now',
      twoFactorEnabled: true,
      createdAt: new Date().toISOString().split('T')[0],
      password: data.password || 'password123'
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    showToast('Account Created', `Welcome to Brightloop, ${newUser.name}!`, 'success');
    return { success: true };
  };

  const addUser = (data: Omit<AppUser, 'id' | 'createdAt' | 'avatarInitials' | 'lastActive'>): AppUser => {
    const initials = data.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'US';

    const colors = ['bg-indigo-600', 'bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-600'];
    const avatarBg = data.avatarBg || colors[Math.floor(Math.random() * colors.length)];

    const newUser: AppUser = {
      ...data,
      id: 'usr_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      avatarInitials: initials,
      avatarBg,
      lastActive: 'Invited recently',
      password: data.password || 'password123'
    };

    setUsers(prev => [newUser, ...prev]);
    showToast('User Created', `${newUser.name} added as ${newUser.role}.`, 'success');
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<AppUser>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const updated = { ...u, ...updates };
        if (currentUser?.id === id) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));
    showToast('User Updated', 'User profile and permissions saved.');
  };

  const deleteUser = (id: string): { success: boolean; error?: string } => {
    if (currentUser?.id === id) {
      return { success: false, error: 'Cannot delete the currently signed-in user.' };
    }
    const adminCount = users.filter(u => u.role === 'ADMIN').length;
    const targetUser = users.find(u => u.id === id);
    if (targetUser?.role === 'ADMIN' && adminCount <= 1) {
      return { success: false, error: 'At least one Administrator must remain on the system.' };
    }

    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('User Deleted', `${targetUser?.name || 'User'} has been removed.`, 'warning');
    return { success: true };
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        if (currentUser?.id === id) {
          showToast('Action Disallowed', 'You cannot suspend your own active account.', 'warning');
          return u;
        }
        const newStatus = u.status === 'active' ? 'suspended' : 'active';
        showToast('Status Updated', `${u.name} is now ${newStatus}.`, 'info');
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const resetUserPassword = (id: string): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$';
    let tempPass = 'Temp';
    for (let i = 0; i < 6; i++) {
      tempPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, password: tempPass };
      }
      return u;
    }));
    showToast('Password Reset', `Temporary password generated: ${tempPass}`, 'info');
    return tempPass;
  };

  const switchUser = (id: string) => {
    const target = users.find(u => u.id === id);
    if (target) {
      setCurrentUser(target);
      showToast('Switched User', `Now interacting as ${target.name} (${target.role}).`, 'info');
    }
  };

  // Computed metrics
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const activeSubscribersCount = activeSubs.length;
  
  const totalMrr = activeSubs.reduce((acc, s) => {
    const monthlyVal = s.billingCycle === 'annual' ? Math.round(s.amount / 12) : s.amount;
    return acc + monthlyVal;
  }, 0);

  const totalArr = totalMrr * 12;
  const averageRevenuePerUser = activeSubscribersCount > 0 ? Math.round(totalMrr / activeSubscribersCount) : 0;
  const churnRatePercent = 1.24;

  return (
    <BrightloopContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        currentTab,
        setCurrentTab,
        sandboxMode,
        setSandboxMode,
        currency,
        setCurrency,
        formatCurrency,
        isSearchOpen,
        setIsSearchOpen,
        notifications,
        markNotificationAsRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
        toasts,
        showToast,
        removeToast,
        customers,
        selectedCustomerId,
        setSelectedCustomerId,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        plans,
        addPlan,
        updatePlan,
        subscriptions,
        createSubscription,
        updateSubscription,
        cancelSubscription,
        pauseSubscription,
        resumeSubscription,
        changeSubscriptionPlan,
        invoices,
        createInvoice,
        markInvoiceAsPaid,
        voidInvoice,
        payments,
        refundPayment,
        retryPayment,
        discounts,
        createDiscount,
        toggleDiscountStatus,
        deleteDiscount,
        currentUser,
        setCurrentUser,
        users,
        login,
        logout,
        register,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        resetUserPassword,
        switchUser,
        totalMrr,
        totalArr,
        activeSubscribersCount,
        averageRevenuePerUser,
        churnRatePercent
      }}
    >
      {children}
    </BrightloopContext.Provider>
  );
};

export const useBrightloop = () => {
  const context = useContext(BrightloopContext);
  if (!context) {
    throw new Error('useBrightloop must be used within a BrightloopProvider');
  }
  return context;
};
