import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  Award,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  User as UserIcon,
  UserPlus,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../BrandLogo';

interface CustomerAuthModalProps {
  open: boolean;
  initialMode?: 'signup' | 'signin';
  onClose: () => void;
  onAuthenticated?: (isNewOrIncomplete?: boolean) => void;
}

function isValidFlexiblePhone(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed) return true;
  if (!/^\+?[\d\s\-()]+$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 16;
}

function extractFirebaseCode(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    return String((err as { code?: unknown }).code || '');
  }
  if (err instanceof Error) {
    return err.message;
  }
  return '';
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  open,
  initialMode = 'signup',
  onClose,
  onAuthenticated,
}) => {
  const {
    t,
    isRtl,
    settings,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogleCustomer,
    resetCustomerPassword,
  } = useStore();

  const [mode, setMode] = useState<'signup' | 'signin' | 'forgot'>(initialMode);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [defaultAddress, setDefaultAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [suggestSignIn, setSuggestSignIn] = useState(false);
  const [resetSentEmail, setResetSentEmail] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setErrorMsg(null);
      setSuggestSignIn(false);
      setResetSentEmail(null);
    }
  }, [open, initialMode]);

  const handleClose = () => {
    setErrorMsg(null);
    setSuggestSignIn(false);
    setResetSentEmail(null);
    setPassword('');
    onClose();
  };

  const mapAuthError = (err: unknown): string => {
    const code = extractFirebaseCode(err);
    setSuggestSignIn(false);

    if (
      code.includes('operation-not-allowed') ||
      code.includes('PASSWORD_LOGIN_DISABLED')
    ) {
      return t.account.emailDisabledNotice;
    }
    if (code.includes('unauthorized-domain')) {
      const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
      return `Google Sign-In is not yet authorized for "${host}". Please use Email & Password below or add this domain in Firebase Console → Authentication → Settings → Authorized domains.`;
    }
    if (
      code.includes('popup-closed-by-user') ||
      code.includes('popup-blocked') ||
      code.includes('cancelled-popup-request')
    ) {
      return t.account.errors.popupBlocked;
    }
    if (code.includes('email-already-in-use')) {
      setSuggestSignIn(true);
      return 'An account with this email already exists. Try signing in instead.';
    }
    if (
      code.includes('invalid-credential') ||
      code.includes('wrong-password') ||
      code.includes('user-not-found')
    ) {
      return 'Incorrect email or password. Please check your credentials and try again.';
    }
    if (code.includes('weak-password')) {
      return t.account.errors.passwordMin;
    }
    if (code.includes('invalid-email')) {
      return t.account.errors.emailInvalid;
    }
    if (code.includes('network-request-failed')) {
      return 'Network error contacting authentication service. Please check your connection and try again.';
    }
    if (code.includes('too-many-requests')) {
      return 'Too many attempts. Please wait a minute and try again.';
    }
    if (code) {
      return `${t.account.errors.genericAuth} (${code})`;
    }
    return t.account.errors.genericAuth;
  };

  const handleGoogleContinue = async () => {
    if (googleLoading || submitting) return;
    setErrorMsg(null);
    setSuggestSignIn(false);
    setGoogleLoading(true);
    try {
      await signInWithGoogleCustomer();
      setPassword('');
      onClose();
      onAuthenticated?.(true);
    } catch (err) {
      setErrorMsg(mapAuthError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || googleLoading) return;
    setErrorMsg(null);
    setSuggestSignIn(false);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg(t.account.errors.emailInvalid);
      return;
    }

    if (mode === 'forgot') {
      setSubmitting(true);
      try {
        await resetCustomerPassword(trimmedEmail);
        setResetSentEmail(trimmedEmail);
      } catch (err) {
        setErrorMsg(mapAuthError(err));
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (password.length < 6) {
      setErrorMsg(t.account.errors.passwordMin);
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMsg(t.account.errors.nameRequired);
        return;
      }
      if (phone.trim() && !isValidFlexiblePhone(phone)) {
        setErrorMsg(t.account.errors.phoneInvalid);
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await signUpWithEmail({
          name: name.trim(),
          phone: phone.trim() || undefined,
          email: trimmedEmail,
          password,
          defaultAddress: defaultAddress.trim() || undefined,
        });
      } else {
        await signInWithEmail({
          email: trimmedEmail,
          password,
        });
      }
      setPassword('');
      onClose();
      onAuthenticated?.(false);
    } catch (err) {
      setErrorMsg(mapAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const headerTitle =
    mode === 'signup'
      ? t.account.signUpTitle
      : mode === 'forgot'
      ? t.account.resetTitle
      : t.account.signInTitle;

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="customer-auth-title"
        >
          <div className="fixed inset-0" onClick={handleClose} />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full sm:max-w-md bg-[#F3EBDD] rounded-t-2xl sm:rounded-2xl shadow-2xl border border-[#101B17]/15 max-h-[92vh] flex flex-col overflow-hidden"
          >
            {/* Dark Luxury Header */}
            <div className="px-6 py-4 bg-[#101B17] text-[#F3EBDD] border-b border-[#D7A65A]/20 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <BrandLogo variant="dark" size="sm" logoUrl={settings.logoUrl} />
                <div className="min-w-0 border-s border-[#D7A65A]/25 ps-3">
                  <h2
                    id="customer-auth-title"
                    className="font-display text-lg font-bold text-white truncate"
                  >
                    {headerTitle}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#F3EBDD] hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-[#5B564E] leading-relaxed">
                  {mode === 'signup'
                    ? t.account.signUpSubtitle
                    : mode === 'forgot'
                    ? t.account.resetSubtitle
                    : t.account.signInSubtitle}
                </p>
                {mode === 'signup' && (
                  <p className="text-xs font-semibold text-[#101B17] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#D7A65A] shrink-0" />
                    <span>{t.account.loyalty.welcomeSignupBanner}</span>
                  </p>
                )}
              </div>

              {/* Mode Switcher Tabs (Sign Up / Sign In) */}
              {mode !== 'forgot' && (
                <div className="grid grid-cols-2 gap-1 p-1 bg-[#E7DFD0] rounded-xl border border-[#101B17]/12">
                  {(['signup', 'signin'] as const).map((tabId) => {
                    const active = mode === tabId;
                    return (
                      <button
                        key={tabId}
                        type="button"
                        onClick={() => {
                          setMode(tabId);
                          setErrorMsg(null);
                          setSuggestSignIn(false);
                          setResetSentEmail(null);
                        }}
                        className={`relative py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors min-h-[38px] cursor-pointer ${
                          active ? 'text-[#F3EBDD]' : 'text-[#101210]/75 hover:text-[#101B17]'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="customer-auth-tab-pill"
                            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                            className="absolute inset-0 bg-[#101B17] rounded-lg shadow-xs"
                          />
                        )}
                        <span className="relative z-10">
                          {tabId === 'signup' ? t.account.signUpTab : t.account.signInTab}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm space-y-2">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                  {suggestSignIn && mode === 'signup' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrorMsg(null);
                        setSuggestSignIn(false);
                      }}
                      className="ms-6 inline-flex items-center px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      {t.account.signInTab} →
                    </button>
                  )}
                </div>
              )}

              {mode === 'forgot' ? (
                <div className="space-y-4">
                  {resetSentEmail ? (
                    <div className="bg-white rounded-2xl border border-[#101B17]/15 p-5 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#101B17] text-[#D7A65A] flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-display text-base font-bold text-[#101210]">
                            {t.account.resetSentTitle}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#5B564E] leading-relaxed">
                            {t.account.resetSentBody.replace('{email}', resetSentEmail)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setMode('signin');
                          setResetSentEmail(null);
                          setErrorMsg(null);
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-[#101B17] text-[#F3EBDD] font-semibold text-sm hover:bg-[#1D2922] transition-colors flex items-center justify-center gap-2 min-h-[46px] cursor-pointer"
                      >
                        <ArrowLeft className={`w-4 h-4 text-[#D7A65A] ${isRtl ? 'rotate-180' : ''}`} />
                        <span>{t.account.backToSignIn}</span>
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="cust-reset-email"
                          className="block text-xs font-semibold text-[#101210]"
                        >
                          {t.account.email} *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-[#5B564E] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            id="cust-reset-email"
                            type="email"
                            required
                            autoComplete="email"
                            maxLength={200}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t.account.emailPlaceholder}
                            className="w-full ps-10 pe-3.5 py-2.5 rounded-xl border border-[#101B17]/18 bg-white text-sm text-[#101210] focus:outline-none focus:ring-2 focus:ring-[#101B17] min-h-[46px]"
                          />
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        whileTap={{ scale: 0.985 }}
                        disabled={submitting}
                        className="w-full py-3.5 px-5 rounded-xl bg-[#101B17] text-[#F3EBDD] font-semibold text-sm hover:bg-[#1D2922] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 min-h-[48px] shadow-sm cursor-pointer"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#D7A65A]" />
                            <span>{t.account.sendingReset}</span>
                          </>
                        ) : (
                          <>
                            <KeyRound className="w-4 h-4 text-[#D7A65A]" />
                            <span>{t.account.sendResetBtn}</span>
                          </>
                        )}
                      </motion.button>

                      <button
                        type="button"
                        onClick={() => {
                          setMode('signin');
                          setErrorMsg(null);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl border border-[#101B17]/18 bg-white/70 text-xs font-semibold text-[#101210] hover:bg-white transition-colors inline-flex items-center justify-center gap-1.5 min-h-[42px] cursor-pointer"
                      >
                        <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                        <span>{t.account.backToSignIn}</span>
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <>
                  {/* Email & Password Form */}
                  <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
                    {mode === 'signup' && (
                      <>
                        <div className="space-y-1">
                          <label
                            htmlFor="cust-auth-name"
                            className="block text-xs font-semibold text-[#101210]"
                          >
                            {t.account.fullName} *
                          </label>
                          <div className="relative">
                            <UserIcon className="w-4 h-4 text-[#5B564E] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              id="cust-auth-name"
                              type="text"
                              required
                              autoComplete="name"
                              maxLength={120}
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder={t.account.fullNamePlaceholder}
                              className="w-full ps-10 pe-3.5 py-2.5 rounded-xl border border-[#101B17]/18 bg-white text-sm text-[#101210] focus:outline-none focus:ring-2 focus:ring-[#101B17] min-h-[44px]"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label
                            htmlFor="cust-auth-phone"
                            className="block text-xs font-semibold text-[#101210]"
                          >
                            {t.account.phone}
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-[#5B564E] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              id="cust-auth-phone"
                              type="tel"
                              autoComplete="tel"
                              maxLength={24}
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder={t.account.phonePlaceholder}
                              className="w-full ps-10 pe-3.5 py-2.5 rounded-xl border border-[#101B17]/18 bg-white text-sm text-[#101210] font-mono-tabular focus:outline-none focus:ring-2 focus:ring-[#101B17] min-h-[44px]"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="space-y-1">
                      <label
                        htmlFor="cust-auth-email"
                        className="block text-xs font-semibold text-[#101210]"
                      >
                        {t.account.email} *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#5B564E] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="cust-auth-email"
                          type="email"
                          required
                          autoComplete="email"
                          maxLength={200}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t.account.emailPlaceholder}
                          className="w-full ps-10 pe-3.5 py-2.5 rounded-xl border border-[#101B17]/18 bg-white text-sm text-[#101210] focus:outline-none focus:ring-2 focus:ring-[#101B17] min-h-[44px]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <label
                          htmlFor="cust-auth-password"
                          className="block text-xs font-semibold text-[#101210]"
                        >
                          {t.account.password} *
                        </label>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#5B564E] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="cust-auth-password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                          minLength={6}
                          maxLength={128}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={t.account.passwordPlaceholder}
                          className="w-full ps-10 pe-10 py-2.5 rounded-xl border border-[#101B17]/18 bg-white text-sm text-[#101210] focus:outline-none focus:ring-2 focus:ring-[#101B17] min-h-[44px]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="absolute end-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#5B564E] hover:text-[#101210] cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {mode === 'signup' && (
                      <div className="space-y-1">
                        <label
                          htmlFor="cust-auth-address"
                          className="block text-xs font-semibold text-[#101210]"
                        >
                          {t.account.defaultAddress}
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-[#5B564E] absolute start-3.5 top-3 pointer-events-none" />
                          <textarea
                            id="cust-auth-address"
                            rows={2}
                            maxLength={400}
                            value={defaultAddress}
                            onChange={(e) => setDefaultAddress(e.target.value)}
                            placeholder={t.account.defaultAddressPlaceholder}
                            className="w-full ps-10 pe-3.5 py-2.5 rounded-xl border border-[#101B17]/18 bg-white text-sm text-[#101210] focus:outline-none focus:ring-2 focus:ring-[#101B17]"
                          />
                        </div>
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      whileTap={{ scale: 0.985 }}
                      disabled={submitting || googleLoading}
                      className="w-full mt-2 py-3.5 px-5 rounded-xl bg-[#101B17] text-[#F3EBDD] font-semibold text-sm hover:bg-[#1D2922] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 min-h-[48px] shadow-sm cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#D7A65A]" />
                          <span>
                            {mode === 'signup'
                              ? t.account.creatingAccount
                              : t.account.signingIn}
                          </span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 text-[#D7A65A]" />
                          <span>
                            {mode === 'signup'
                              ? t.account.createAccountBtn
                              : t.account.signInSubmitBtn}
                          </span>
                        </>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
