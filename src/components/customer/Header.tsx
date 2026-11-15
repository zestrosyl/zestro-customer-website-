import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, Copy, Check, Globe, Menu, QrCode, Receipt, ShoppingBag, Sparkles, User, UserPlus, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { Language } from '../../types';
import { BrandLogo } from '../BrandLogo';

interface HeaderProps {
  activePath?: string;
  onOpenCart: () => void;
  onOpenHistory: () => void;
  onOpenAuth: () => void;
  onOpenAccount: () => void;
  onOpenQrScanner?: () => void;
  onNavigateRoute: (path: string, sectionId: string) => void;
}

const LANG_OPTIONS: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'bn', label: 'বাং' },
];

export const Header: React.FC<HeaderProps> = ({
  activePath = '/',
  onOpenCart,
  onOpenHistory,
  onOpenAuth,
  onOpenAccount,
  onOpenQrScanner,
  onNavigateRoute,
}) => {
  const {
    language,
    setLanguage,
    t,
    cartCount,
    orderHistory,
    settings,
    isRtl,
    customerUser,
    customerProfile,
    customerOrders,
    detectedTableNumber,
    offers,
  } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [offerIdx, setOfferIdx] = useState(0);
  const [offersPaused, setOffersPaused] = useState(false);
  const [offersDismissed, setOffersDismissed] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const validOffers = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return (offers || []).filter((o) => {
      if (!o.title?.trim()) return false;
      const from = (o.validFrom || '').slice(0, 10);
      const until = (o.validUntil || '').slice(0, 10);
      if (from && from > today) return false;
      if (until && until < today) return false;
      return true;
    });
  }, [offers]);

  useEffect(() => {
    if (offerIdx >= validOffers.length) setOfferIdx(0);
  }, [validOffers.length, offerIdx]);

  useEffect(() => {
    if (validOffers.length <= 1 || offersPaused || offersDismissed) return;
    const timer = window.setInterval(() => {
      setOfferIdx((i) => (i + 1) % validOffers.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [validOffers.length, offersPaused, offersDismissed]);

  const activeOffer = validOffers[offerIdx] || null;

  const customerName =
    customerProfile?.displayName || customerUser?.displayName || t.account.myAccountBtn;
  const customerFirstName = customerName.trim().split(/\s+/)[0] || t.account.myAccountBtn;
  const customerInitials =
    customerName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p: string) => p[0]?.toUpperCase() || '')
      .join('') || 'Z';

  const activeCloudOrdersCount = customerOrders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  ).length;

  const totalOrdersBadgeCount = useMemo(() => {
    const ids = new Set<string>(orderHistory.map((o) => o.orderId));
    if (customerUser) {
      for (const ord of customerOrders) {
        ids.add(ord.id);
      }
    }
    return ids.size;
  }, [customerOrders, customerUser, orderHistory]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const navItems = [
    { path: '/', sectionId: 'home', label: t.nav.home },
    { path: '/menu', sectionId: 'menu', label: t.nav.menu },
    { path: '/offers', sectionId: 'offers', label: t.nav.offers },
    { path: '/about', sectionId: 'about', label: t.nav.about },
    { path: '/contact', sectionId: 'contact', label: t.nav.contact },
  ];

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
    sectionId: string
  ) => {
    e.preventDefault();
    setMobileOpen(false);
    onNavigateRoute(path, sectionId);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'bg-[#101B17]/95 backdrop-blur-md border-b border-[#D7A65A]/20 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.6)]'
          : 'bg-gradient-to-b from-[#101210]/85 via-[#101210]/45 to-transparent border-b border-white/5'
      }`}
    >
      {activeOffer && !offersDismissed && (
        <div
          onMouseEnter={() => setOffersPaused(true)}
          onMouseLeave={() => setOffersPaused(false)}
          className="bg-[#101B17]/95 border-b border-[#D7A65A]/25 text-[#F3EBDD]"
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 justify-center">
              {validOffers.length > 1 && (
                <button
                  type="button"
                  aria-label="Previous offer"
                  onClick={() => setOfferIdx((i) => (i - 1 + validOffers.length) % validOffers.length)}
                  className="p-0.5 rounded text-[#F3EBDD]/60 hover:text-[#D7A65A] shrink-0"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              )}
              <Sparkles className="w-3.5 h-3.5 text-[#D7A65A] shrink-0 hidden sm:block" />
              {activeOffer.discountText && (
                <span className="shrink-0 rounded-full bg-[#D7A65A] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#101210]">
                  {activeOffer.discountText}
                </span>
              )}
              <span className="font-semibold text-[#F3EBDD] truncate">
                {activeOffer.title}
              </span>
              {activeOffer.description && (
                <span className="hidden md:inline text-[#F3EBDD]/75 truncate max-w-[360px]">
                  — {activeOffer.description}
                </span>
              )}
              {activeOffer.code && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeOffer.code && navigator.clipboard) {
                      void navigator.clipboard.writeText(activeOffer.code);
                      setCopiedCode(activeOffer.code);
                      window.setTimeout(() => setCopiedCode(null), 1800);
                    }
                  }}
                  title="Copy promo code"
                  className="shrink-0 inline-flex items-center gap-1 rounded border border-[#D7A65A]/45 bg-[#D7A65A]/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#D7A65A] hover:bg-[#D7A65A]/25"
                >
                  <span>{activeOffer.code}</span>
                  {copiedCode === activeOffer.code ? (
                    <Check className="w-2.5 h-2.5 text-emerald-300" />
                  ) : (
                    <Copy className="w-2.5 h-2.5 opacity-80" />
                  )}
                </button>
              )}
              {validOffers.length > 1 && (
                <>
                  <span className="text-[10px] text-[#F3EBDD]/50 shrink-0 hidden sm:inline">
                    {offerIdx + 1}/{validOffers.length}
                  </span>
                  <button
                    type="button"
                    aria-label="Next offer"
                    onClick={() => setOfferIdx((i) => (i + 1) % validOffers.length)}
                    className="p-0.5 rounded text-[#F3EBDD]/60 hover:text-[#D7A65A] shrink-0"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
            <button
              type="button"
              aria-label="Dismiss offers banner"
              onClick={() => setOffersDismissed(true)}
              className="p-1 rounded text-[#F3EBDD]/55 hover:text-[#F3EBDD] shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-[74px] flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
        {/* Zone 1: Brand Identity */}
        <motion.a
          href="/"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => handleLinkClick(e, '/', 'home')}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7A65A] rounded-lg shrink-0"
        >
          <BrandLogo variant="dark" size="sm" logoUrl={settings.logoUrl} />
        </motion.a>

        {/* Zone 2: Refined Public Navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 lg:gap-8 text-[13px] font-medium tracking-[0.04em] text-[#F3EBDD]/80"
        >
          {navItems.map((item) => {
            const isActive = activePath === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => handleLinkClick(e, item.path, item.sectionId)}
                className={`relative whitespace-nowrap shrink-0 py-2 transition-colors ${
                  isActive ? 'text-[#FFFFFF] font-semibold' : 'hover:text-[#D7A65A]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="header-nav-underline"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute bottom-0 start-0 end-0 h-[2px] bg-[#D7A65A]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Language Switcher + Orders + Account + Cart + Mobile Toggle */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <div
            className="hidden sm:flex items-center bg-[#1D2922]/90 rounded-lg p-0.5 border border-white/10"
            role="group"
            aria-label="Language selector"
          >
            {LANG_OPTIONS.map((opt) => {
              const selected = language === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLanguage(opt.code)}
                  className={`relative px-2 py-1 text-[11px] font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 min-h-[30px] cursor-pointer ${
                    selected
                      ? 'text-[#101210]'
                      : 'text-[#A9A79F] hover:text-[#F3EBDD]'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="header-lang-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 bg-[#D7A65A] rounded-md"
                    />
                  )}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              );
            })}
          </div>

          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenHistory}
            title={t.nav.orders}
            aria-label={t.nav.orders}
            className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-medium text-[#F3EBDD]/90 hover:text-white rounded-lg bg-[#1D2922]/75 hover:bg-[#1D2922] border border-white/12 transition-colors whitespace-nowrap shrink-0 min-h-[38px] sm:min-h-[40px] cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-[#D7A65A] shrink-0" />
            <span className="hidden lg:inline">{t.nav.orders}</span>
            {totalOrdersBadgeCount > 0 && (
              <span className="tabular-nums font-mono-tabular bg-white/10 text-[#F3EBDD] text-[10px] sm:text-[11px] font-semibold px-1.5 py-0.5 rounded">
                {totalOrdersBadgeCount}
              </span>
            )}
          </motion.button>

          {customerUser ? (
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenAccount}
              title={t.account.myAccountBtn}
              aria-label={t.account.myAccountBtn}
              className="inline-flex items-center gap-1.5 p-1 sm:ps-1.5 sm:pe-2.5 sm:py-1.5 text-xs font-medium text-[#F3EBDD] bg-[#1D2922]/85 hover:bg-[#1D2922] rounded-lg border border-white/15 transition-colors whitespace-nowrap shrink-0 min-h-[38px] sm:min-h-[40px] cursor-pointer"
            >
              {customerProfile?.photoUrl || customerUser.photoURL ? (
                <img
                  src={customerProfile?.photoUrl || customerUser.photoURL || ''}
                  alt={customerFirstName}
                  className="w-6 h-6 rounded-md object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="w-6 h-6 rounded-md bg-[#D7A65A] text-[#101210] text-[11px] font-bold flex items-center justify-center shrink-0">
                  {customerInitials}
                </span>
              )}
              <span className="hidden md:inline max-w-[88px] truncate">{customerFirstName}</span>
              {activeCloudOrdersCount > 0 && (
                <span className="hidden sm:inline-block tabular-nums font-mono-tabular bg-[#D7A65A] text-[#101210] text-[11px] font-bold px-1.5 py-0.5 rounded">
                  {activeCloudOrdersCount}
                </span>
              )}
            </motion.button>
          ) : (
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenAuth}
              title={t.account.signUpBtn}
              aria-label={t.account.signUpBtn}
              className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-medium text-[#F3EBDD] bg-[#1D2922]/80 hover:bg-[#1D2922] rounded-lg border border-white/15 transition-colors whitespace-nowrap shrink-0 min-h-[38px] sm:min-h-[40px] cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#D7A65A] shrink-0" />
              <span className="hidden sm:inline">{t.account.signUpBtn}</span>
            </motion.button>
          )}

          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenCart}
            aria-label={`${t.nav.cart} (${cartCount})`}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold bg-[#D7A65A] text-[#101210] rounded-lg hover:bg-[#C49245] transition-colors whitespace-nowrap shrink-0 min-h-[38px] sm:min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3EBDD] cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">{t.nav.cart}</span>
            <motion.span
              key={cartCount}
              initial={{ scale: 0.72 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              className="tabular-nums font-mono-tabular bg-[#101B17] text-[#F3EBDD] text-[11px] font-bold px-1.5 py-0.5 rounded min-w-[18px] text-center"
            >
              {cartCount}
            </motion.span>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-[#F3EBDD] bg-[#1D2922]/85 hover:bg-[#1D2922] min-h-[38px] min-w-[38px] border border-white/15 shrink-0 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Animated Slide-Out Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 top-16 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 top-16 bg-black/60 backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: isRtl ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '-100%' : '100%' }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-xs bg-[#101B17] text-[#F3EBDD] h-[calc(100dvh-4rem)] border-s border-[#D7A65A]/20 shadow-2xl p-5 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                <nav className="flex flex-col space-y-1.5" aria-label="Mobile navigation">
                  {navItems.map((item, idx) => (
                    <motion.a
                      key={item.path}
                      href={item.path}
                      initial={{ opacity: 0, x: isRtl ? -12 : 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.04 }}
                      onClick={(e) => handleLinkClick(e, item.path, item.sectionId)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        activePath === item.path
                          ? 'bg-[#1D2922] text-[#D7A65A] border border-[#D7A65A]/30'
                          : 'text-[#F3EBDD] hover:bg-[#1D2922]/60'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ArrowRight
                        className={`w-4 h-4 ${
                          activePath === item.path ? 'text-[#D7A65A]' : 'text-[#A9A79F]'
                        } ${isRtl ? 'rotate-180' : ''}`}
                      />
                    </motion.a>
                  ))}
                </nav>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#A9A79F] uppercase tracking-wider">
                    <Globe className="w-3.5 h-3.5 text-[#D7A65A]" />
                    <span>Language</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 bg-[#1D2922] rounded-xl p-1 border border-white/10">
                    {LANG_OPTIONS.map((opt) => (
                      <button
                        key={opt.code}
                        type="button"
                        onClick={() => setLanguage(opt.code)}
                        className={`py-2 text-xs font-semibold rounded-lg min-h-[38px] transition-colors ${
                          language === opt.code
                            ? 'bg-[#D7A65A] text-[#101210]'
                            : 'text-[#F3EBDD]/80 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2.5">
                {customerUser ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenAccount();
                    }}
                    className="w-full inline-flex items-center justify-between px-4 py-3 text-sm font-semibold text-[#F3EBDD] bg-[#1D2922] rounded-xl border border-white/12 min-h-[46px]"
                  >
                    <span className="inline-flex items-center gap-2.5 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-[#D7A65A] text-[#101210] text-xs font-bold flex items-center justify-center shrink-0">
                        {customerInitials}
                      </span>
                      <span className="truncate">{customerName}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#A9A79F] shrink-0">
                      <User className="w-3.5 h-3.5 text-[#D7A65A]" />
                      <span>{t.account.myAccountBtn}</span>
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-[#F3EBDD] bg-[#1D2922] rounded-xl border border-white/12 min-h-[44px]"
                  >
                    <UserPlus className="w-4 h-4 text-[#D7A65A]" />
                    <span>{t.account.signUpBtn}</span>
                  </button>
                )}

                {onOpenQrScanner && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenQrScanner();
                    }}
                    className="w-full inline-flex items-center justify-between px-4 py-3 text-sm font-semibold text-[#F3EBDD] bg-[#1D2922] rounded-xl border border-white/12 min-h-[44px]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-[#D7A65A]" />
                      <span>
                        {detectedTableNumber
                          ? `${t.history.tableLabel} ${detectedTableNumber} · ${t.qrScanner.switchTableBtn}`
                          : t.qrScanner.scanTableBtn}
                      </span>
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenHistory();
                  }}
                  className="w-full inline-flex items-center justify-between px-4 py-3 text-sm font-semibold text-[#F3EBDD] bg-[#1D2922]/70 rounded-xl border border-white/10 min-h-[44px]"
                >
                  <span className="inline-flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#D7A65A]" />
                    <span>{t.nav.orders}</span>
                  </span>
                  {totalOrdersBadgeCount > 0 && (
                    <span className="font-mono-tabular text-xs font-bold bg-[#D7A65A] text-[#101210] px-2 py-0.5 rounded">
                      {totalOrdersBadgeCount}
                    </span>
                  )}
                </button>

                <a
                  href="#menu"
                  onClick={(e) => handleLinkClick(e, '/menu', 'menu')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#D7A65A] text-[#101210] text-sm font-bold min-h-[46px]"
                >
                  <span>{t.hero.orderNow}</span>
                  <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
