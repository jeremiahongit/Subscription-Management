import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building,
  KeyRound,
  RefreshCw,
  X
} from 'lucide-react';
import { useBrightloop } from '../context/BrightloopContext';
import { UserRole } from '../types';

export const LoginView: React.FC = () => {
  const { login, register, users, showToast } = useBrightloop();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [email, setEmail] = useState('admin@brightloop.io');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regTitle, setRegTitle] = useState('Senior Operations Lead');
  const [regDepartment, setRegDepartment] = useState('Finance & Billing');
  const [regRole, setRegRole] = useState<UserRole>('ADMIN');

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Please enter a valid work email.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    const res = register({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      role: regRole,
      title: regTitle,
      department: regDepartment
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to register account.');
    }
  };

  const handleQuickDemoSelect = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setErrorMessage(null);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      showToast('Validation Error', 'Please enter a valid email address.', 'error');
      return;
    }
    setForgotSuccess(true);
    showToast('Reset Link Dispatched', `Password reset token generated for ${forgotEmail}`, 'info');
  };

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-slate-900 font-sans text-slate-100">
      {/* Left Brand Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A1128] border-r border-[#1C2541] p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle geometric background accents */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 0113.856-5.657l1.414-1.414M20 12a8 8 0 01-13.856 5.657l-1.414 1.414" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-white tracking-tight">Brightloop</span>
              <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 uppercase">
                Enterprise
              </span>
            </div>
            <span className="text-xs text-slate-400">Recurring Billing & Revenue Recognition</span>
          </div>
        </div>

        {/* Center Marketing Narrative */}
        <div className="relative z-10 space-y-6 my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-xs font-semibold text-blue-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Audit-Ready Subscription Infrastructure</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Predictable recurring revenue, governed by enterprise controls.
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed">
            Manage subscriber contracts, calculate GAAP & ASC 606 revenue waterfalls, and download certified PDF audit packages with full role-based governance.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
            <div>
              <div className="text-2xl font-bold font-mono text-white">114.2%</div>
              <div className="text-xs text-slate-400 mt-0.5">Net Revenue Retention</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-emerald-400">ASC 606</div>
              <div className="text-xs text-slate-400 mt-0.5">Audit-Ready Exporting</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-500">
          © 2026 Brightloop Billing Systems Inc. All rights reserved.
        </div>
      </div>

      {/* Right Login / Register Workspace */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 overflow-y-auto bg-slate-900/95">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Header */}
          <div className="flex lg:hidden items-center gap-3 justify-center mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-bold">
              BL
            </div>
            <span className="text-xl font-bold text-white">Brightloop</span>
          </div>

          {/* Form Card */}
          <div className="bg-[#0A1128] border border-[#1C2541] rounded-2xl p-6 sm:p-8 shadow-2xl">
            {/* Tab switch */}
            <div className="flex items-center p-1 bg-slate-800/80 rounded-lg mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  mode === 'login'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  mode === 'register'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 text-xs text-rose-300 bg-rose-950/60 border border-rose-800 rounded-lg">
                {errorMessage}
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@brightloop.io"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] text-blue-400 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2 text-xs bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-slate-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>Remember this session</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-600/20 transition-colors cursor-pointer"
                >
                  <span>{isLoading ? 'Verifying...' : 'Sign In to Workspace'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Jordan Smith"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="jordan.smith@brightloop.io"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Role
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full px-2.5 py-2 text-xs bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    >
                      <option value="ADMIN">Admin (PDF Clearance)</option>
                      <option value="BILLING_MANAGER">Billing Manager</option>
                      <option value="STAFF">Staff</option>
                      <option value="VIEWER">Viewer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-slate-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-600/20 transition-colors cursor-pointer mt-2"
                >
                  <span>Create Account & Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* Quick Demo Impersonation Switcher */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase block mb-2">
                1-Click Demo Profiles (Instant Fill)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('admin@brightloop.io')}
                  className="p-2 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60 text-left transition-colors cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-indigo-300">Alex Vance</div>
                  <div className="text-[10px] text-slate-400">ADMIN · Full PDF Access</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('sarah.jenkins@brightloop.io')}
                  className="p-2 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/60 text-left transition-colors cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-blue-300">Sarah Jenkins</div>
                  <div className="text-[10px] text-slate-400">BILLING MANAGER</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('dev.patel@brightloop.io')}
                  className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 text-left transition-colors cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-emerald-300">Dev Patel</div>
                  <div className="text-[10px] text-slate-400">STAFF Specialist</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('maya.lin@brightloop.io')}
                  className="p-2 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/60 text-left transition-colors cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-purple-300">Maya Lin</div>
                  <div className="text-[10px] text-slate-400">VIEWER (Auditor)</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-[#0A1128] border border-[#1C2541] rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Reset Account Password</h3>
              </div>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSuccess(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-950/50 border border-emerald-800 text-emerald-300 rounded-lg text-xs leading-relaxed">
                  A temporary password reset link was dispatched to <strong>{forgotEmail}</strong>. You may also use the demo password <code>password123</code> to sign in immediately.
                </div>
                <button
                  onClick={() => {
                    setEmail(forgotEmail);
                    setPassword('password123');
                    setShowForgotModal(false);
                    setForgotSuccess(false);
                  }}
                  className="w-full py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <p className="text-xs text-slate-400 leading-snug">
                  Enter your registered work email. We will generate a secure authentication link for your session.
                </p>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="admin@brightloop.io"
                  className="w-full px-3 py-2 text-xs bg-slate-800/60 border border-slate-700 rounded-lg text-white"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
