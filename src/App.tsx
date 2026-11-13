/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import { BellRing, X } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { BeverageSection } from './components/customer/BeverageSection';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { CustomerAccountModal } from './components/customer/CustomerAccountModal';
import { CustomerAuthModal } from './components/customer/CustomerAuthModal';
import { Header } from './components/customer/Header';
import { HeroSection } from './components/customer/HeroSection';
import {
  AboutReviewsContactFooter,
  FeaturedCategoriesStrip,
  PopularAndOffersSection,
} from './components/customer/LandingSections';
import { MenuSection } from './components/customer/MenuSection';
import { OrderHistoryModal } from './components/customer/OrderHistoryModal';
import { ProductCustomiseModal } from './components/customer/ProductCustomiseModal';
import { SignatureShowcase } from './components/customer/SignatureShowcase';
import { TableQrScannerModal } from './components/customer/TableQrScannerModal';
import { StoreProvider, useStore } from './context/StoreContext';
import type { Product } from './types';

function sectionIdFromCustomerPathname(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '').toLowerCase();
  if (clean === '/menu') return 'menu';
  if (clean === '/offers') return 'offers';
  if (clean === '/about') return 'about';
  if (clean === '/contact') return 'contact';
  return 'home';
}

const ZestroContent: React.FC = () => {
  const { toast, dismissToast, customerUser } = useStore();
  const [activePath, setActivePath] = useState<string>(() => {
    const clean = window.location.pathname.replace(/\/+$/, '').toLowerCase();
    return clean === '/menu' || clean === '/offers' || clean === '/about' || clean === '/contact'
      ? clean
      : '/';
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [accountInitialTab, setAccountInitialTab] = useState<'orders' | 'profile'>('orders');
  const [qrScannerOpen, setQrScannerOpen] = useState(false);

  const scrollToCustomerSection = useCallback((sectionId: string) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = 76;
      const targetTop = Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerOffset);
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const initialSection = sectionIdFromCustomerPathname(window.location.pathname);
    if (initialSection !== 'home') {
      const timer = window.setTimeout(() => scrollToCustomerSection(initialSection), 120);
      return () => window.clearTimeout(timer);
    }
  }, [scrollToCustomerSection]);

  useEffect(() => {
    const onPop = () => {
      const clean = window.location.pathname.replace(/\/+$/, '').toLowerCase();
      setActivePath(
        clean === '/menu' || clean === '/offers' || clean === '/about' || clean === '/contact'
          ? clean
          : '/'
      );
      const sectionId = sectionIdFromCustomerPathname(window.location.pathname);
      window.setTimeout(() => scrollToCustomerSection(sectionId), 60);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [scrollToCustomerSection]);

  const handleNavigateCustomerRoute = useCallback(
    (path: string, sectionId: string) => {
      const search = window.location.search || '';
      window.history.pushState({}, '', `${path}${search}`);
      setActivePath(path);
      scrollToCustomerSection(sectionId);
    },
    [scrollToCustomerSection]
  );


  const handleSelectCategoryAndScroll = useCallback(
    (categoryId: string) => {
      setSelectedCategoryId(categoryId);
      const search = window.location.search || '';
      window.history.pushState({}, '', `/menu${search}`);
      setActivePath('/menu');
      scrollToCustomerSection('menu');
    },
    [scrollToCustomerSection]
  );


  return (
    <div className="min-h-screen flex flex-col bg-[#F3EBDD] text-[#101210]">
      <Header
        activePath={activePath}
        onOpenCart={() => setCartOpen(true)}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenAccount={() => {
          setAccountInitialTab('orders');
          setAccountModalOpen(true);
        }}
        onOpenQrScanner={() => setQrScannerOpen(true)}
        onNavigateRoute={handleNavigateCustomerRoute}
      />

      <main className="flex-1">
        <HeroSection
          onOrderNow={() => handleNavigateCustomerRoute('/menu', 'menu')}
          onExploreMenu={() => scrollToCustomerSection('signature')}
          onOpenQrScanner={() => setQrScannerOpen(true)}
        />
        <SignatureShowcase
          onOpenProduct={(prod) => setActiveProduct(prod)}
          onSelectCategoryAndScroll={handleSelectCategoryAndScroll}
        />
        <FeaturedCategoriesStrip
          onSelectCategoryAndScroll={handleSelectCategoryAndScroll}
        />
        <MenuSection
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          onOpenProduct={(prod) => setActiveProduct(prod)}
        />
        <BeverageSection
          onSelectCategoryAndScroll={handleSelectCategoryAndScroll}
          onOpenProduct={(prod) => setActiveProduct(prod)}
        />
        <PopularAndOffersSection
          onSelectCategoryAndScroll={handleSelectCategoryAndScroll}
          onOpenProduct={(prod) => setActiveProduct(prod)}
        />
        <AboutReviewsContactFooter onNavigateRoute={handleNavigateCustomerRoute} />
      </main>

      <ProductCustomiseModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onOrderNowRedirect={() => setCheckoutOpen(true)}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onProceedCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
        onOpenHistory={() => setHistoryOpen(true)}
      />

      <OrderHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onReorderSuccess={() => {
          setHistoryOpen(false);
          setCartOpen(true);
        }}
        onOpenAuth={() => {
          setHistoryOpen(false);
          setAuthModalOpen(true);
        }}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onOpenAuth={() => {
          setCheckoutOpen(false);
          setAuthModalOpen(true);
        }}
        onOpenQrScanner={() => setQrScannerOpen(true)}
      />

      <TableQrScannerModal
        open={qrScannerOpen}
        onClose={() => setQrScannerOpen(false)}
      />

      <CustomerAuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthenticated={(maybeIncomplete) => {
          setAccountInitialTab(maybeIncomplete ? 'profile' : 'orders');
          setAccountModalOpen(true);
        }}
      />

      <CustomerAccountModal
        open={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        initialTab={accountInitialTab}
        onReorderSuccess={() => {
          setAccountModalOpen(false);
          setCartOpen(true);
        }}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            role="status"
            aria-live="polite"
            className={`fixed bottom-5 end-5 z-50 max-w-sm rounded-xl shadow-2xl border p-3.5 flex items-start gap-3 ${
              toast.tone === 'error'
                ? 'bg-[#7F1D1D] text-white border-red-400/30'
                : 'bg-[#101B17] text-[#F3EBDD] border-[#D7A65A]/45'
            }`}
          >
            {toast.actionType === 'open_orders' && (
              <div className="w-8 h-8 rounded-lg bg-[#D7A65A] text-[#101210] flex items-center justify-center shrink-0 mt-0.5">
                <BellRing className="w-4 h-4" />
              </div>
            )}

            <div className="flex-1 min-w-0 space-y-1">
              {toast.title && (
                <p className="text-xs font-bold text-[#D7A65A] tracking-wide">
                  {toast.title}
                </p>
              )}
              <p className="text-xs font-medium leading-snug">{toast.text}</p>
              {toast.actionType === 'open_orders' && toast.actionLabel && (
                <button
                  type="button"
                  onClick={() => {
                    dismissToast();
                    if (customerUser) {
                      setAccountInitialTab('orders');
                      setAccountModalOpen(true);
                    } else {
                      setHistoryOpen(true);
                    }
                  }}
                  className="inline-flex items-center mt-1 px-2.5 py-1 rounded-md bg-[#D7A65A] text-[#101210] text-[11px] font-bold hover:bg-[#C49245] transition-colors"
                >
                  {toast.actionLabel}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={dismissToast}
              aria-label="Dismiss notification"
              className="p-1 rounded-md text-[#F3EBDD]/70 hover:text-white hover:bg-white/10 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <StoreProvider>
        <ZestroContent />
      </StoreProvider>
    </MotionConfig>
  );
}
