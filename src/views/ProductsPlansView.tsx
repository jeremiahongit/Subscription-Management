import React, { useState } from 'react';
import {
  Package,
  Plus,
  Check,
  Zap,
  Shield,
  Layers,
  Edit2,
  Users,
  HardDrive,
  Cpu,
  Sparkles
} from 'lucide-react';
import { useBrightloop } from '../context/BrightloopContext';
import { Plan } from '../types';

interface ProductsPlansViewProps {
  onOpenCreateSubscription: () => void;
}

export const ProductsPlansView: React.FC<ProductsPlansViewProps> = ({
  onOpenCreateSubscription
}) => {
  const { plans, addPlan, updatePlan, formatCurrency, currency, totalMrr, showToast } = useBrightloop();

  const [cadence, setCadence] = useState<'monthly' | 'annual'>('monthly');
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);

  // New Plan form state
  const [newPlanName, setNewPlanName] = useState('');
  const [newTierCode, setNewTierCode] = useState('');
  const [newMonthlyPrice, setNewMonthlyPrice] = useState(currency === 'INR' ? 4999 : 79);
  const [newAnnualPrice, setNewAnnualPrice] = useState(currency === 'INR' ? 49999 : 750);
  const [newDescription, setNewDescription] = useState('');
  const [newSeats, setNewSeats] = useState(5);
  const [newApiCalls, setNewApiCalls] = useState('100,000 / mo');

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName.trim()) return;

    addPlan({
      name: newPlanName.trim(),
      tierCode: newTierCode.trim().toUpperCase() || 'CX-01',
      priceMonthly: Number(newMonthlyPrice),
      priceAnnual: Number(newAnnualPrice),
      billingCadence: 'monthly',
      description: newDescription.trim() || 'Flexible SaaS subscription tier.',
      features: [
        `Up to ${newSeats} team members`,
        newApiCalls,
        'Full REST API access & webhooks',
        'Standard billing receipts & GST invoice'
      ],
      limits: {
        seats: newSeats,
        apiCalls: newApiCalls,
        storage: '25 GB'
      },
      status: 'active'
    });

    setShowAddPlanModal(false);
    setNewPlanName('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    updatePlan(editingPlan.id, {
      name: editingPlan.name,
      priceMonthly: Number(editingPlan.priceMonthly),
      priceAnnual: Number(editingPlan.priceAnnual),
      description: editingPlan.description
    });
    setEditingPlan(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Cadence Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Products & Subscription Tiers</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure recurring pricing packages, feature entitlements, and quota allocations
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Monthly / Annual Toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setCadence('monthly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                cadence === 'monthly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setCadence('annual')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                cadence === 'annual'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800/40">
                Save 20%
              </span>
            </button>
          </div>

          <button
            onClick={() => setShowAddPlanModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Plan</span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isAnnual = cadence === 'annual';
          const displayPrice = isAnnual ? plan.priceAnnual : plan.priceMonthly;
          const monthlyEquivalent = isAnnual ? Math.round(plan.priceAnnual / 12) : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-slate-900 rounded-xl border flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
                plan.isPopular
                  ? 'border-blue-600 ring-1 ring-blue-600 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                  Most Popular
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-400 dark:text-slate-500">
                    {plan.tierCode}
                  </span>
                  <button
                    onClick={() => setEditingPlan(plan)}
                    className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 rounded cursor-pointer"
                    title="Edit pricing or details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{plan.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px] leading-relaxed">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mt-5 pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                      {formatCurrency(displayPrice)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      /{isAnnual ? 'yr' : 'mo'}
                    </span>
                  </div>
                  {isAnnual && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                      Equivalent to {formatCurrency(monthlyEquivalent)}/mo
                    </div>
                  )}
                </div>

                {/* Quotas */}
                <div className="py-4 border-b border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Users className="w-3.5 h-3.5" /> Team Seats:
                    </span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{plan.limits.seats}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Cpu className="w-3.5 h-3.5" /> API Volume:
                    </span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{plan.limits.apiCalls}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <HardDrive className="w-3.5 h-3.5" /> Storage:
                    </span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{plan.limits.storage}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="pt-4 space-y-2.5">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Entitlements Included:
                  </span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug text-slate-700 dark:text-slate-300">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom stats & action */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 rounded-b-xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">Subscribers:</div>
                  <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    {plan.subscribersCount} accounts
                  </div>
                </div>
                <button
                  onClick={onOpenCreateSubscription}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-white hover:bg-blue-600 border border-blue-600 rounded-lg transition-colors cursor-pointer"
                >
                  Enroll
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature & Quota Comparison Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Feature Entitlement Matrix</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Comprehensive audit of capabilities and SLA limits per subscription tier</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Platform Capability</th>
                {plans.map((p) => (
                  <th key={p.id} className="px-5 py-3 text-center w-36 font-bold text-slate-800 dark:text-slate-200">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="px-5 py-3 font-semibold text-slate-800 dark:text-slate-200">Automated Recurring Dunning</td>
                <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">3 retries</td>
                <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">Smart AI retries</td>
                <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">Smart AI retries</td>
                <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">Custom rules</td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="px-5 py-3 font-semibold text-slate-800 dark:text-slate-200">SAML SSO & Directory Sync</td>
                <td className="px-5 py-3 text-center text-slate-300 dark:text-slate-600">—</td>
                <td className="px-5 py-3 text-center text-slate-300 dark:text-slate-600">—</td>
                <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">Included</td>
                <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">Okta, Azure, Google</td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="px-5 py-3 font-semibold text-slate-800 dark:text-slate-200">Revenue Recognition (ASC 606)</td>
                <td className="px-5 py-3 text-center text-slate-300 dark:text-slate-600">—</td>
                <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">Standard</td>
                <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">Automated waterfall</td>
                <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">Full ERP export</td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="px-5 py-3 font-semibold text-slate-800 dark:text-slate-200">Support SLA Agreement</td>
                <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">48h Community</td>
                <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">24h Email</td>
                <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">4h Priority Hotline</td>
                <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">1h Dedicated Hotline</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit Plan: {editingPlan.name}</h3>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Plan Display Name</label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Monthly Rate ({currency === 'INR' ? '₹' : '$'})
                  </label>
                  <input
                    type="number"
                    value={editingPlan.priceMonthly}
                    onChange={(e) => setEditingPlan({ ...editingPlan, priceMonthly: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Annual Rate ({currency === 'INR' ? '₹' : '$'})
                  </label>
                  <input
                    type="number"
                    value={editingPlan.priceAnnual}
                    onChange={(e) => setEditingPlan({ ...editingPlan, priceAnnual: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-hidden font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-hidden"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Plan Modal */}
      {showAddPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Subscription Tier</h3>
            <form onSubmit={handleCreatePlan} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tier Name *</label>
                <input
                  type="text"
                  required
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  placeholder="e.g. Pro Developer"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Monthly Price ({currency === 'INR' ? '₹' : '$'})
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newMonthlyPrice}
                    onChange={(e) => setNewMonthlyPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-mono focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Annual Price ({currency === 'INR' ? '₹' : '$'})
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newAnnualPrice}
                    onChange={(e) => setNewAnnualPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-mono focus:outline-hidden"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Target audience and primary value proposition"
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-hidden"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPlanModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Publish Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
