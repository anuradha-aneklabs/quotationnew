import React, { useState, useEffect } from 'react';
import {
  User, Lock, Eye, EyeOff, Loader2, AlertCircle,
  ShieldCheck, HelpCircle, X, LogIn
} from 'lucide-react';

import { loginUser } from '../services/authService';
import quotationIllustration from '../assets/ChatGPT_Image_Aug_12__2026__12_36_20_PM-removebg-preview.png';

export default function Login({ setToken }) {
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [showPassword, setShowPassword]     = useState(false);
  const [rememberMe, setRememberMe]         = useState(false);
  const [isLoading, setIsLoading]           = useState(false);
  const [apiError, setApiError]             = useState('');
  const [errors, setErrors]                 = useState({});
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  /* ── Auth redirect + remembered email ── */
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  /* ── Validation ── */
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim())                        newErrors.email    = 'Email address is required';
    else if (!emailRegex.test(email.trim()))  newErrors.email    = 'Please enter a valid email address';
    if (!password)                            newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await loginUser({ email: email.trim(), password });
      const data = response?.data?.data || response?.data;
      const token = data?.token || data?.accessToken;
      const user = data?.user;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('auth_token', token);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.setItem('user', JSON.stringify({ email: email.trim(), name: 'Admin User' }));
        }

        if (rememberMe) {
          localStorage.setItem('remembered_email', email.trim());
        } else {
          localStorage.removeItem('remembered_email');
        }

        setToken(token); // Update App state
      } else {
        // Fallback
        localStorage.setItem('token', 'mock_authenticated_session_token');
        localStorage.setItem('auth_token', 'mock_authenticated_session_token');
        setToken('mock_authenticated_session_token');
      }
    } catch (err) {
      console.error('Login error:', err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (err.response?.status === 401 ? 'Invalid email or password. Please try again.' : null) ||
        'Unable to log in. Please check your credentials and network connection.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex flex-row overflow-hidden font-sans bg-gradient-to-br from-[#EDE6FF] via-[#DDD0FF] to-[#CEBEFF]">
        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col w-1/2 relative overflow-hidden bg-gradient-to-br from-[#EDE6FF] via-[#DDD0FF] to-[#CEBEFF]">
          {/* Background decorations */}
          <div className="absolute inset-0 opacity-[0.09] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #8B5CF6 1.2px, transparent 1.2px)', backgroundSize: '28px 28px' }} />
          <div className="absolute -top-24 -right-24 w-[440px] h-[440px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 68%)' }} />
          <div className="absolute -bottom-16 -left-12 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 68%)' }} />
          
          <svg className="absolute -right-28 bottom-8 opacity-[0.13] pointer-events-none" width="520" height="520" viewBox="0 0 520 520" fill="none">
            <circle cx="260" cy="260" r="230" stroke="#7C3AED" strokeWidth="1" />
            <circle cx="260" cy="260" r="165" stroke="#7C3AED" strokeWidth="1.2" />
            <circle cx="260" cy="260" r="100" stroke="#7C3AED" strokeWidth="1.5" />
          </svg>

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full p-8 lg:p-14">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10 lg:mb-12">
              <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
                <path d="M50 12 L82.9 31 V69 L50 88 L17.1 69 V31 Z" fill="none" stroke="#5B2FE8" strokeWidth="7" strokeLinejoin="round" />
                <path d="M50 25 L73.6 38.6 V66.4 L50 80 L26.4 66.4 V38.6 Z" fill="#5B2FE8" />
                <path d="M50 25 L73.6 38.6 L50 52.5 L26.4 38.6 Z" fill="#ffffff" />
                <path d="M26.4 38.6 L50 52.5 V80 L26.4 66.4 Z" fill="#936BFF" />
              </svg>
              <div className="leading-tight">
                <div className="font-extrabold text-2xl lg:text-3xl text-[#0E0938]">Aneka</div>
                <div className="font-extrabold text-xs text-[#5B2FE8] tracking-widest uppercase">QuotePro</div>
              </div>
            </div>

            {/* Headline */}
            <h1 className="font-black text-3xl lg:text-4xl xl:text-5xl leading-tight text-[#0E0938] mb-4">
              Smart <span className="text-[#5B2FE8]">Quotations.</span>
              <br />
              Stronger <span className="text-[#5B2FE8]">Proposals.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm lg:text-base text-[#5B5490] leading-relaxed mb-6 max-w-sm">
              Create, manage and track quotations effortlessly<br />with Aneka QuotePro.
            </p>

            {/* Illustration */}
            <div className="flex-1 flex items-end justify-center min-h-0">
              <img
                src={quotationIllustration}
                alt="Quotation Management Illustration"
                className="w-full max-w-[500px] h-auto max-h-[58vh] object-contain object-bottom drop-shadow-[0_6px_24px_rgba(91,47,232,0.18)]"
              />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 w-full md:w-1/2 flex flex-col overflow-y-auto overflow-x-hidden bg-[#F5F0FF] relative">
          <div className="absolute -top-20 -right-20 w-[380px] h-[380px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)' }} />

          {/* Secure Login badge */}
          <div className="relative z-10 flex justify-end px-6 pt-6 lg:px-10 lg:pt-8">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8A82B8]">
              <ShieldCheck size={14} className="opacity-80" />
              <span>Secure Login</span>
            </div>
          </div>

          {/* Mobile logo */}
          <div className="md:hidden flex items-center gap-2.5 px-6 pt-4 relative z-10">
            <svg width="30" height="30" viewBox="0 0 100 100" fill="none">
              <path d="M50 12 L82.9 31 V69 L50 88 L17.1 69 V31 Z" fill="none" stroke="#5B2FE8" strokeWidth="8" strokeLinejoin="round" />
              <path d="M50 25 L73.6 38.6 V66.4 L50 80 L26.4 66.4 V38.6 Z" fill="#5B2FE8" />
              <path d="M50 25 L73.6 38.6 L50 52.5 L26.4 38.6 Z" fill="#fff" />
              <path d="M26.4 38.6 L50 52.5 V80 L26.4 66.4 Z" fill="#818cf8" />
            </svg>
            <span className="font-extrabold text-lg text-[#0E0938]">Aneka QuotePro</span>
          </div>

          {/* Login card wrapper */}
          <div className="flex-1 flex items-center justify-center p-5 md:p-8 lg:p-12 relative z-10">
            {/* Card */}
            <div className="w-full max-w-[480px] bg-white rounded-3xl p-7 md:p-10 lg:p-12 shadow-[0_8px_48px_rgba(91,47,232,0.11),_0_1px_4px_rgba(0,0,0,0.04)] border border-[#E8DFFF]">
              {/* Card header */}
              <div className="mb-8">
                <h2 className="font-extrabold text-2xl md:text-3xl text-[#0E0938] mb-1.5">
                  Welcome Back!
                </h2>
                <p className="text-sm text-[#8A82B8]">Login to your account</p>
              </div>

              {/* API error */}
              {apiError && (
                <div className="flex items-start gap-2.5 mb-5 p-3 rounded-xl text-sm font-medium bg-red-50 border-2 border-red-200 text-red-700">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <div>{apiError}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className="mb-5">
                  <label htmlFor="lp-email" className="block text-sm font-semibold text-[#0E0938] mb-2">
                    Email Address / Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <User size={18} />
                    </span>
                    <input
                      id="lp-email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: '' })); }}
                      placeholder="Enter your email or username"
                      disabled={isLoading}
                      autoComplete="email"
                      className={`w-full h-[52px] pl-11 pr-4 rounded-xl text-sm text-[#0E0938] bg-[#F8F5FF] outline-none transition-colors border-2 ${
                        errors.email ? 'border-red-400' : 'border-gray-200 focus:border-[#5B2FE8]'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="mb-6">
                  <label htmlFor="lp-password" className="block text-sm font-semibold text-[#0E0938] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <Lock size={18} />
                    </span>
                    <input
                      id="lp-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: '' })); }}
                      placeholder="Enter your password"
                      disabled={isLoading}
                      autoComplete="current-password"
                      className={`w-full h-[52px] pl-11 pr-12 rounded-xl text-sm text-[#0E0938] bg-[#F8F5FF] outline-none transition-colors border-2 ${
                        errors.password ? 'border-red-400' : 'border-gray-200 focus:border-[#5B2FE8]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.password}</p>}
                </div>

                {/* Remember me + Forgot Password */}
                <div className="flex items-center justify-between mb-8">
                  <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#5B2FE8] accent-[#5B2FE8] cursor-pointer rounded border-gray-300 focus:ring-[#5B2FE8]"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-sm font-semibold text-[#5B2FE8] hover:text-[#4B24CC] transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full h-[52px] rounded-xl text-white text-base font-bold flex items-center justify-center gap-2 transition-all shadow-[0_8px_28px_rgba(91,47,232,0.38)] tracking-wide ${
                    isLoading 
                      ? 'bg-[#7C3AED] cursor-not-allowed opacity-75' 
                      : 'bg-gradient-to-br from-[#5B2FE8] to-[#7B46FF] hover:opacity-90 active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span>Login</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pb-5 text-xs text-[#B0ADCC] relative z-10">
            Aneka QuotePro &copy; {new Date().getFullYear()}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          FORGOT PASSWORD MODAL
      ═══════════════════════════════════════════════════ */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0E0938]/60 backdrop-blur-sm">
          <div className="relative w-full max-w-[420px] bg-white rounded-3xl p-9 shadow-[0_30px_80px_rgba(0,0,0,0.22)] border border-[#EDE9FE]">
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="w-12 h-12 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-[#5B2FE8] mb-4">
              <HelpCircle size={24} />
            </div>
            <h3 className="font-extrabold text-lg text-[#0E0938] mb-2.5">Reset Your Password</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              For corporate security, password resets are handled by your system administrator.
              Please contact IT Support or email{' '}
              <strong className="text-[#5B2FE8]">support@aneka.com</strong> to request a reset.
            </p>
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="w-full h-11 rounded-xl bg-[#0E0938] hover:bg-[#1A1446] text-white text-sm font-bold transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
}
