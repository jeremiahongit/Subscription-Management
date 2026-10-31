import React, { useState } from 'react';
import { BrightloopProvider, useBrightloop } from './context/BrightloopContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { ToastContainer } from './components/ToastContainer';
import { GlobalSearchModal } from './components/GlobalSearchModal';

// Modals
import { CreateCustomerModal } from './components/modals/CreateCustomerModal';
import { CreateSubscriptionModal } from './components/modals/CreateSubscriptionModal';
import { CreateInvoiceModal } from './components/modals/CreateInvoiceModal';
import { CreateDiscountModal } from './components/modals/CreateDiscountModal';
import { ViewInvoiceModal } from './components/modals/ViewInvoiceModal';
import { CustomerDetailDrawer } from './components/modals/CustomerDetailDrawer';
import { RefundPaymentModal } from './components/modals/RefundPaymentModal';
import { ExportReportModal } from './components/modals/ExportReportModal';
import { AddUserModal } from './components/modals/AddUserModal';

// Views
import { OverviewView } from './views/OverviewView';
import { CustomersView } from './views/CustomersView';
import { ProductsPlansView } from './views/ProductsPlansView';
import { SubscriptionsView } from './views/SubscriptionsView';
import { InvoicesView } from './views/InvoicesView';
import { PaymentsView } from './views/PaymentsView';
import { DiscountsView } from './views/DiscountsView';
import { ReportsView } from './views/ReportsView';
import { UsersView } from './views/UsersView';
import { LoginView } from './views/LoginView';

const BrightloopApp: React.FC = () => {
  const {
    currentTab,
    invoices,
    payments,
    selectedCustomerId,
    setSelectedCustomerId,
    currentUser
  } = useBrightloop();

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [showCreateSubscription, setShowCreateSubscription] = useState(false);
  const [subscriptionPreselectCust, setSubscriptionPreselectCust] = useState<string | undefined>(undefined);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showCreateDiscount, setShowCreateDiscount] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportModalDefaultType, setExportModalDefaultType] = useState<'subscriptions' | 'revenue'>('revenue');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Viewing invoice detail
  const [viewingInvoiceId, setViewingInvoiceId] = useState<string | null>(null);
  const activeInvoice = invoices.find(i => i.id === viewingInvoiceId) || null;

  // Refunding payment
  const [refundingPaymentId, setRefundingPaymentId] = useState<string | null>(null);
  const activeRefundPayment = payments.find(p => p.id === refundingPaymentId) || null;

  const handleOpenCreateSubscriptionWithCustomer = (customerId: string) => {
    setSubscriptionPreselectCust(customerId);
    setShowCreateSubscription(true);
  };

  // If unauthenticated, render the full Login View
  if (!currentUser) {
    return (
      <>
        <LoginView />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#070B14] font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Dark Navy Sidebar */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Clean Top Bar */}
        <TopHeader
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenCreateCustomer={() => setShowCreateCustomer(true)}
          onOpenCreateSubscription={() => {
            setSubscriptionPreselectCust(undefined);
            setShowCreateSubscription(true);
          }}
          onOpenCreateInvoice={() => setShowCreateInvoice(true)}
          onOpenCreateDiscount={() => setShowCreateDiscount(true)}
          onOpenExportReportModal={() => {
            setExportModalDefaultType('revenue');
            setShowExportModal(true);
          }}
        />

        {/* View Content Canvas */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-7xl mx-auto pb-12">
            {currentTab === 'overview' && (
              <OverviewView
                onOpenCreateCustomer={() => setShowCreateCustomer(true)}
                onOpenCreateSubscription={() => {
                  setSubscriptionPreselectCust(undefined);
                  setShowCreateSubscription(true);
                }}
                onOpenCreateInvoice={() => setShowCreateInvoice(true)}
                onViewInvoice={(invId) => setViewingInvoiceId(invId)}
                onRefundPayment={(payId) => setRefundingPaymentId(payId)}
              />
            )}

            {currentTab === 'customers' && (
              <CustomersView
                onOpenCreateCustomer={() => setShowCreateCustomer(true)}
                onOpenCustomerDetail={(cId) => setSelectedCustomerId(cId)}
                onOpenCreateSubscriptionForCustomer={handleOpenCreateSubscriptionWithCustomer}
              />
            )}

            {currentTab === 'products' && (
              <ProductsPlansView
                onOpenCreateSubscription={() => {
                  setSubscriptionPreselectCust(undefined);
                  setShowCreateSubscription(true);
                }}
              />
            )}

            {currentTab === 'subscriptions' && (
              <SubscriptionsView
                onOpenCreateSubscription={() => {
                  setSubscriptionPreselectCust(undefined);
                  setShowCreateSubscription(true);
                }}
                onOpenCustomerDetail={(cId) => setSelectedCustomerId(cId)}
                onOpenExportPDF={() => {
                  setExportModalDefaultType('subscriptions');
                  setShowExportModal(true);
                }}
              />
            )}

            {currentTab === 'invoices' && (
              <InvoicesView
                onOpenCreateInvoice={() => setShowCreateInvoice(true)}
                onViewInvoice={(invId) => setViewingInvoiceId(invId)}
              />
            )}

            {currentTab === 'payments' && (
              <PaymentsView
                onRefundPayment={(payId) => setRefundingPaymentId(payId)}
              />
            )}

            {currentTab === 'discounts' && (
              <DiscountsView
                onOpenCreateDiscount={() => setShowCreateDiscount(true)}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsView
                onOpenExportModal={(type) => {
                  setExportModalDefaultType(type || 'revenue');
                  setShowExportModal(true);
                }}
              />
            )}

            {currentTab === 'users' && (
              <UsersView
                onOpenAddUser={() => setShowAddUserModal(true)}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <GlobalSearchModal />
      <ToastContainer />

      <CreateCustomerModal
        isOpen={showCreateCustomer}
        onClose={() => setShowCreateCustomer(false)}
      />

      <CreateSubscriptionModal
        isOpen={showCreateSubscription}
        onClose={() => setShowCreateSubscription(false)}
        preselectedCustomerId={subscriptionPreselectCust}
      />

      <CreateInvoiceModal
        isOpen={showCreateInvoice}
        onClose={() => setShowCreateInvoice(false)}
      />

      <CreateDiscountModal
        isOpen={showCreateDiscount}
        onClose={() => setShowCreateDiscount(false)}
      />

      <ViewInvoiceModal
        invoice={activeInvoice}
        onClose={() => setViewingInvoiceId(null)}
      />

      <CustomerDetailDrawer
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
        onViewInvoice={(invId) => {
          setSelectedCustomerId(null);
          setViewingInvoiceId(invId);
        }}
      />

      <RefundPaymentModal
        payment={activeRefundPayment}
        onClose={() => setRefundingPaymentId(null)}
      />

      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        defaultType={exportModalDefaultType}
      />

      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <BrightloopProvider>
      <BrightloopApp />
    </BrightloopProvider>
  );
}
