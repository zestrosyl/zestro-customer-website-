import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
type User = { uid: string; displayName: string | null; email: string | null; photoURL: string | null };
import {
  INITIAL_CATEGORIES,
  INITIAL_CUSTOMISATION_GROUPS,
  INITIAL_PRODUCTS,
  INITIAL_PROMOTIONS,
  INITIAL_SETTINGS,
  INITIAL_TABLES,
} from '../data/initialMenu';
import { Dictionary, TRANSLATIONS } from '../i18n/translations';
import { parseTableQrPayload } from '../utils/tableQrParser';

import type {
  CartItem,
  Category,
  CustomerProfile,
  CustomisationGroup,
  Language,
  LocalOrderHistoryEntry,
  LoyaltySummary,
  LoyaltyTier,
  Order,
  OrderStatus,
  OrderType,
  Product,
  Promotion,
  RestaurantSettings,
  SelectedCustomisation,
} from '../types';

export interface ToastOptions {
  title?: string;
  durationMs?: number;
  actionLabel?: string;
  actionType?: 'open_orders';
}

export interface ToastMessage extends ToastOptions {
  id: number;
  text: string;
  tone: 'success' | 'info' | 'error';
}

interface StoreContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
  isRtl: boolean;

  categories: Category[];
  products: Product[];
  customisationGroups: CustomisationGroup[];
  promotions: Promotion[];
  settings: RestaurantSettings;
  catalogLoading: boolean;

  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (item: Omit<CartItem, 'cartItemId'>) => void;
  updateCartQty: (cartItemId: string, qty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  lastOrderCart: CartItem[];
  saveLastOrderCart: (items: CartItem[]) => void;
  repeatLastOrder: () => void;

  orderHistory: LocalOrderHistoryEntry[];
  addOrderHistoryEntry: (entry: LocalOrderHistoryEntry) => void;
  reorderFromHistory: (entry: LocalOrderHistoryEntry) => boolean;

  customerUser: User | null;
  customerProfile: CustomerProfile | null;
  customerAuthLoading: boolean;
  customerOrders: Order[];
  signUpWithEmail: (input: {
    name: string;
    phone?: string;
    email: string;
    password: string;
    defaultAddress?: string;
  }) => Promise<void>;
  signInWithEmail: (input: { email: string; password: string }) => Promise<void>;
  signInWithGoogleCustomer: () => Promise<void>;
  resetCustomerPassword: (email: string) => Promise<void>;
  saveCustomerProfile: (input: {
    displayName: string;
    phone: string;
    defaultAddress?: string;
    preferredOrderType?: OrderType;
  }) => Promise<void>;
  signOutCustomer: () => Promise<void>;
  reorderFromFirestoreOrder: (order: Order) => boolean;
  loyalty: LoyaltySummary;
  getOrderLoyaltyPoints: (orderTotal: number, status?: OrderStatus) => number;

  detectedTableNumber: string | null;
  detectedTableId: string | null;
  detectedTableName: string | null;
  assignTableFromQr: (rawInput: string) => Promise<{
    ok: boolean;
    tableId?: string;
    tableNumber?: string;
    tableName?: string;
    error?: string;
  }>;
  clearDetectedTable: () => void;
  waiterCalling: boolean;
  waiterCooldownSec: number;
  triggerWaiterCall: () => Promise<void>;

  toast: ToastMessage | null;
  showToast: (text: string, tone?: 'success' | 'info' | 'error', options?: ToastOptions) => void;
  dismissToast: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_STORAGE_KEY = 'zestro_cart_v1';
const LAST_ORDER_KEY = 'zestro_last_order_v1';
const ORDER_HISTORY_KEY = 'zestro_order_history_v1';
const LANG_STORAGE_KEY = 'zestro_lang_v1';
const WAITER_COOLDOWN_KEY = 'zestro_waiter_call_ts';
const SCANNED_TABLE_STORAGE_KEY = 'zestro_scanned_table_v1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'en' || saved === 'bn' || saved === 'ar') return saved;
    return 'en';
  });

  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [customisationGroups, setCustomisationGroups] = useState<CustomisationGroup[]>(
    INITIAL_CUSTOMISATION_GROUPS
  );
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);
  const [settings, setSettings] = useState<RestaurantSettings>(INITIAL_SETTINGS);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(true);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  const [lastOrderCart, setLastOrderCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(LAST_ORDER_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  const [orderHistory, setOrderHistory] = useState<LocalOrderHistoryEntry[]>(() => {
    try {
      const raw = localStorage.getItem(ORDER_HISTORY_KEY);
      return raw ? (JSON.parse(raw) as LocalOrderHistoryEntry[]) : [];
    } catch {
      return [];
    }
  });

  const [detectedTableNumber, setDetectedTableNumber] = useState<string | null>(null);
  const [detectedTableId, setDetectedTableId] = useState<string | null>(null);
  const [detectedTableName, setDetectedTableName] = useState<string | null>(null);
  const [waiterCalling, setWaiterCalling] = useState(false);
  const [waiterCooldownSec, setWaiterCooldownSec] = useState(0);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [customerUser, setCustomerUser] = useState<User | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [customerAuthLoading, setCustomerAuthLoading] = useState(true);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);

  const showToast = useCallback(
    (text: string, tone: 'success' | 'info' | 'error' = 'info', options?: ToastOptions) => {
      const id = Date.now();
      const duration = options?.durationMs ?? 4000;
      setToast({ id, text, tone, ...options });
      setTimeout(() => {
        setToast((prev) => (prev && prev.id === id ? null : prev));
      }, duration);
    },
    []
  );

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const languageRef = useRef<Language>(language);
  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const orderHistoryRef = useRef<LocalOrderHistoryEntry[]>(orderHistory);
  const knownOrderStatusesRef = useRef<Record<string, OrderStatus>>(
    Object.fromEntries(orderHistory.map((o) => [o.orderId, o.status]))
  );

  useEffect(() => {
    orderHistoryRef.current = orderHistory;
  }, [orderHistory]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }, []);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orderHistory));
    } catch {
      // Ignore storage quota errors
    }
  }, [orderHistory]);

  // Authentication and cloud customer accounts are intentionally disabled in this clean-start build.
  useEffect(() => { setCustomerAuthLoading(false); }, []);

  useEffect(() => {
    // Static starter catalogue: data is loaded from src/data/initialMenu.ts.
    setCatalogLoading(false);
  }, []);

  const applyResolvedTable = useCallback(
    (tblId: string, tblNumber: string, tblName?: string | null) => {
      const resolvedName = tblName || `Table ${tblNumber}`;
      setDetectedTableId(tblId);
      setDetectedTableNumber(tblNumber);
      setDetectedTableName(resolvedName);
      try {
        sessionStorage.setItem(
          SCANNED_TABLE_STORAGE_KEY,
          JSON.stringify({ tableId: tblId, tableNumber: tblNumber, tableName: resolvedName })
        );
      } catch {
        // Ignore sessionStorage errors
      }
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('table', tblNumber);
        window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
      } catch {
        // Ignore history API restrictions
      }
    },
    []
  );

  const assignTableFromQr = useCallback(
    async (rawInput: string) => {
      const dict = TRANSLATIONS[languageRef.current];
      const parsed = parseTableQrPayload(rawInput);
      if (!parsed) {
        return { ok: false, error: dict.qrScanner.invalidQr };
      }

      const remoteTable = null; // Cloudflare database integration will be added later.

      const fallbackTable = INITIAL_TABLES.find(
        (t) => t.id === parsed.tableId || t.number === parsed.tableNumber
      );

      const resolved = remoteTable || fallbackTable;
      if (!resolved) {
        return {
          ok: false,
          error: dict.qrScanner.tableNotFound.replace('{id}', parsed.tableId),
        };
      }

      applyResolvedTable(resolved.id, resolved.number, resolved.name);
      showToast(
        dict.qrScanner.verifiedBody.replace('{table}', resolved.name || `Table ${resolved.number}`),
        'success'
      );
      return {
        ok: true,
        tableId: resolved.id,
        tableNumber: resolved.number,
        tableName: resolved.name,
      };
    },
    [applyResolvedTable, showToast]
  );

  const clearDetectedTable = useCallback(() => {
    setDetectedTableId(null);
    setDetectedTableNumber(null);
    setDetectedTableName(null);
    try {
      sessionStorage.removeItem(SCANNED_TABLE_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('table');
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    } catch {
      // Ignore history API errors
    }
  }, []);

  // Detect Table QR (?table=01 or previously scanned session table)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawTable = params.get('table');
    let candidateId: string | null = null;
    let candidateNum: string | null = null;
    let candidateName: string | null = null;

    if (rawTable) {
      const parsed = parseTableQrPayload(rawTable);
      if (parsed) {
        candidateId = parsed.tableId;
        candidateNum = parsed.tableNumber;
      }
    } else {
      try {
        const savedRaw = sessionStorage.getItem(SCANNED_TABLE_STORAGE_KEY);
        if (savedRaw) {
          const saved = JSON.parse(savedRaw) as {
            tableId?: string;
            tableNumber?: string;
            tableName?: string;
          };
          if (saved.tableId && saved.tableNumber) {
            candidateId = saved.tableId;
            candidateNum = saved.tableNumber;
            candidateName = saved.tableName || null;
          }
        }
      } catch {
        // Ignore corrupted sessionStorage
      }
    }

    if (!candidateId || !candidateNum) return;

    const fallbackMatch = INITIAL_TABLES.find((t) => t.id === candidateId);
    setDetectedTableNumber(candidateNum);
    setDetectedTableId(candidateId);
    setDetectedTableName(candidateName || fallbackMatch?.name || `Table ${candidateNum}`);

  }, []);

  // Waiter cooldown ticker
  useEffect(() => {
    if (!detectedTableId) return;
    const updateCooldown = () => {
      const key = `${WAITER_COOLDOWN_KEY}_${detectedTableId}`;
      const ts = Number(localStorage.getItem(key) || '0');
      const remaining = Math.max(0, Math.ceil((60_000 - (Date.now() - ts)) / 1000));
      setWaiterCooldownSec(remaining);
    };
    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);
    return () => clearInterval(interval);
  }, [detectedTableId]);

  const triggerWaiterCall = useCallback(async () => {
    if (!detectedTableId || !detectedTableNumber) return;
    const dict = TRANSLATIONS[language];
    if (waiterCooldownSec > 0) {
      showToast(dict.hero.waiterCooldown, 'info');
      return;
    }
    setWaiterCalling(true);
    try {
      const checkRes = await fetch('/api/waiter-calls/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId: detectedTableId }),
      });
      const checkJson = (await checkRes.json()) as { allowed?: boolean; remainingSeconds?: number };
      if (checkJson.allowed === false) {
        showToast(dict.hero.waiterCooldown, 'info');
        setWaiterCooldownSec(checkJson.remainingSeconds || 45);
        return;
      }

      // Waiter-call delivery will be connected to the Cloudflare backend later.
      localStorage.setItem('zestro_pending_waiter_call', JSON.stringify({ tableId: detectedTableId, tableNumber: detectedTableNumber, createdAt: new Date().toISOString() }));
      localStorage.setItem(`${WAITER_COOLDOWN_KEY}_${detectedTableId}`, String(Date.now()));
      setWaiterCooldownSec(60);
      showToast(`${dict.hero.waiterCalled} ${detectedTableNumber}`, 'success');
    } catch {
      showToast(dict.hero.waiterCooldown, 'error');
    } finally {
      setWaiterCalling(false);
    }
  }, [detectedTableId, detectedTableNumber, language, showToast, waiterCooldownSec]);

  const addToCart = useCallback(
    (item: Omit<CartItem, 'cartItemId'>) => {
      const signature = JSON.stringify({
        p: item.productId,
        v: item.variantId || '',
        c: item.customisations.map((x) => `${x.groupId}:${x.optionId}`).sort(),
        s: (item.selectedSides || []).slice().sort(),
        n: (item.specialInstructions || '').trim(),
      });

      setCart((prev) => {
        const existingIndex = prev.findIndex((ci) => {
          const ciSig = JSON.stringify({
            p: ci.productId,
            v: ci.variantId || '',
            c: ci.customisations.map((x) => `${x.groupId}:${x.optionId}`).sort(),
            s: (ci.selectedSides || []).slice().sort(),
            n: (ci.specialInstructions || '').trim(),
          });
          return ciSig === signature;
        });

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + item.quantity,
          };
          return updated;
        }
        return [
          ...prev,
          {
            ...item,
            cartItemId: `ci_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          },
        ];
      });

      const name = item.productName[language] || item.productName.en;
      showToast(`${name} +${item.quantity}`, 'success');
    },
    [language, showToast]
  );

  const updateCartQty = useCallback((cartItemId: string, qty: number) => {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((item) => item.cartItemId !== cartItemId);
      return prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: qty } : item));
    });
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const saveLastOrderCart = useCallback((items: CartItem[]) => {
    setLastOrderCart(items);
    try {
      localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const repeatLastOrder = useCallback(() => {
    if (lastOrderCart.length === 0) return;
    setCart(
      lastOrderCart.map((item, idx) => ({
        ...item,
        cartItemId: `ci_rep_${Date.now()}_${idx}`,
      }))
    );
    showToast(TRANSLATIONS[language].history.reorderedSuccess, 'success');
  }, [lastOrderCart, language, showToast]);

  const addOrderHistoryEntry = useCallback((entry: LocalOrderHistoryEntry) => {
    knownOrderStatusesRef.current[entry.orderId] = entry.status;
    setOrderHistory((prev) => [entry, ...prev.filter((o) => o.orderId !== entry.orderId)].slice(0, 25));
  }, []);

  const reorderFromHistory = useCallback(
    (entry: LocalOrderHistoryEntry): boolean => {
      const dict = TRANSLATIONS[language];
      const availableItems: CartItem[] = [];
      let skippedCount = 0;

      for (let i = 0; i < entry.items.length; i += 1) {
        const oldItem = entry.items[i];
        const liveProd = products.find((p) => p.id === oldItem.productId);
        if (!liveProd || !liveProd.available || liveProd.soldOut) {
          skippedCount += 1;
          continue;
        }
        const matchedVariant = oldItem.variantId
          ? liveProd.variants?.find((v) => v.id === oldItem.variantId)
          : undefined;
        const unitPrice = matchedVariant ? matchedVariant.price : liveProd.price;

        availableItems.push({
          ...oldItem,
          cartItemId: `ci_hist_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 6)}`,
          productName: liveProd.name,
          image: liveProd.image || oldItem.image,
          variantLabel: matchedVariant ? matchedVariant.label : oldItem.variantLabel,
          unitPrice,
        });
      }

      if (availableItems.length === 0) {
        showToast(dict.history.allUnavailable, 'error');
        return false;
      }

      setCart((prev) => {
        const next = [...prev];
        for (const item of availableItems) {
          const sig = JSON.stringify({
            p: item.productId,
            v: item.variantId || '',
            c: item.customisations.map((x) => `${x.groupId}:${x.optionId}`).sort(),
            s: (item.selectedSides || []).slice().sort(),
            n: (item.specialInstructions || '').trim(),
          });
          const idx = next.findIndex((ci) => {
            const ciSig = JSON.stringify({
              p: ci.productId,
              v: ci.variantId || '',
              c: ci.customisations.map((x) => `${x.groupId}:${x.optionId}`).sort(),
              s: (ci.selectedSides || []).slice().sort(),
              n: (ci.specialInstructions || '').trim(),
            });
            return ciSig === sig;
          });
          if (idx >= 0) {
            next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
          } else {
            next.push(item);
          }
        }
        return next;
      });

      if (skippedCount > 0) {
        showToast(`${dict.history.reorderedSuccess} (${skippedCount} ${dict.history.unavailableSkipped})`, 'info');
      } else {
        showToast(dict.history.reorderedSuccess, 'success');
      }
      return true;
    },
    [language, products, showToast]
  );

  const reorderFromFirestoreOrder = useCallback(
    (order: Order): boolean => {
      const dict = TRANSLATIONS[language];
      const availableItems: CartItem[] = [];
      let skippedCount = 0;

      for (let i = 0; i < order.items.length; i += 1) {
        const oldItem = order.items[i];
        const liveProd = products.find((p) => p.id === oldItem.productId);
        if (!liveProd || !liveProd.available || liveProd.soldOut) {
          skippedCount += 1;
          continue;
        }
        const matchedVariant = oldItem.variantLabel
          ? liveProd.variants?.find((v) => v.label.en === oldItem.variantLabel)
          : undefined;
        const unitPrice = matchedVariant ? matchedVariant.price : liveProd.price;

        const mappedCustomisations: SelectedCustomisation[] = (oldItem.customisations || []).map(
          (c, idx) => {
            const grp = customisationGroups.find((g) => g.name.en === c.groupName);
            const opt = grp?.options.find((o) => o.name.en === c.optionName);
            return {
              groupId: grp?.id || `grp_${idx}`,
              groupName: c.groupName,
              optionId: opt?.id || `opt_${idx}`,
              optionName: c.optionName,
              price: opt ? opt.price : c.price,
            };
          }
        );

        availableItems.push({
          cartItemId: `ci_cloud_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 6)}`,
          productId: liveProd.id,
          productName: liveProd.name,
          image: liveProd.image,
          ...(matchedVariant
            ? { variantId: matchedVariant.id, variantLabel: matchedVariant.label }
            : {}),
          unitPrice,
          quantity: oldItem.quantity,
          customisations: mappedCustomisations,
          ...(oldItem.selectedSides ? { selectedSides: oldItem.selectedSides } : {}),
          ...(oldItem.specialInstructions ? { specialInstructions: oldItem.specialInstructions } : {}),
        });
      }

      if (availableItems.length === 0) {
        showToast(dict.history.allUnavailable, 'error');
        return false;
      }

      setCart((prev) => [...prev, ...availableItems]);
      if (skippedCount > 0) {
        showToast(`${dict.history.reorderedSuccess} (${skippedCount} ${dict.history.unavailableSkipped})`, 'info');
      } else {
        showToast(dict.history.reorderedSuccess, 'success');
      }
      return true;
    },
    [customisationGroups, language, products, showToast]
  );

  const accountUnavailable = async (): Promise<void> => {
    throw new Error('Customer accounts are temporarily unavailable while the website backend is being rebuilt.');
  };
  const signUpWithEmail = useCallback(async (_input: { name: string; phone?: string; email: string; password: string; defaultAddress?: string }) => accountUnavailable(), []);
  const signInWithEmail = useCallback(async (_input: { email: string; password: string }) => accountUnavailable(), []);
  const signInWithGoogleCustomer = useCallback(async () => accountUnavailable(), []);
  const saveCustomerProfile = useCallback(async (_input: { displayName: string; phone: string; defaultAddress?: string; preferredOrderType?: OrderType }) => accountUnavailable(), []);
  const resetCustomerPassword = useCallback(async (_email: string) => accountUnavailable(), []);
  const signOutCustomer = useCallback(async () => {
    setCustomerUser(null);
    setCustomerProfile(null);
    setCustomerOrders([]);
  }, []);

  const getOrderLoyaltyPoints = useCallback(
    (orderTotal: number, status?: OrderStatus): number => {
      if (status === 'cancelled') return 0;
      return Math.floor(Math.max(0, Number(orderTotal) || 0) / 10);
    },
    []
  );

  const loyalty = useMemo<LoyaltySummary>(() => {
    const sourceOrders = orderHistory;
    let completedPoints = 0;
    let pendingPoints = 0;
    let redeemedPoints = 0;
    let eligibleOrdersCount = 0;
    let eligibleTotalSpent = 0;

    for (const ord of sourceOrders) {
      if (ord.status === 'cancelled') continue;
      const total = Number(ord.total) || 0;
      const pts = getOrderLoyaltyPoints(total, ord.status);
      redeemedPoints += Math.max(0, Number(ord.redeemedPoints) || 0);
      if (ord.status === 'completed') {
        completedPoints += pts;
        eligibleOrdersCount += 1;
        eligibleTotalSpent += total;
      } else {
        pendingPoints += pts;
      }
    }

    const welcomePoints = 0;
    const bonusPoints = 0;

    const points = Math.max(0, welcomePoints + bonusPoints + completedPoints - redeemedPoints);
    let tier: LoyaltyTier = 'bronze';
    let nextTier: LoyaltyTier | null = 'silver';
    let pointsToNextTier = Math.max(0, 500 - points);
    let tierProgressPercent = Math.min(100, Math.round((points / 500) * 100));

    if (points >= 1500) {
      tier = 'gold';
      nextTier = null;
      pointsToNextTier = 0;
      tierProgressPercent = 100;
    } else if (points >= 500) {
      tier = 'silver';
      nextTier = 'gold';
      pointsToNextTier = Math.max(0, 1500 - points);
      tierProgressPercent = Math.min(100, Math.round(((points - 500) / 1000) * 100));
    }

    return {
      points,
      welcomePoints,
      bonusPoints,
      completedPoints,
      pendingPoints,
      redeemedPoints,
      eligibleOrdersCount,
      eligibleTotalSpent,
      tier,
      nextTier,
      pointsToNextTier,
      tierProgressPercent,
    };
  }, [getOrderLoyaltyPoints, orderHistory]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const extras = item.customisations.reduce((s, c) => s + c.price, 0);
        return sum + (item.unitPrice + extras) * item.quantity;
      }, 0),
    [cart]
  );

  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRtl,
        categories,
        products,
        customisationGroups,
        promotions,
        settings,
        catalogLoading,
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        lastOrderCart,
        saveLastOrderCart,
        repeatLastOrder,
        orderHistory,
        addOrderHistoryEntry,
        reorderFromHistory,
        customerUser,
        customerProfile,
        customerAuthLoading,
        customerOrders,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogleCustomer,
        resetCustomerPassword,
        saveCustomerProfile,
        signOutCustomer,
        reorderFromFirestoreOrder,
        loyalty,
        getOrderLoyaltyPoints,
        detectedTableNumber,
        detectedTableId,
        detectedTableName,
        assignTableFromQr,
        clearDetectedTable,
        waiterCalling,
        waiterCooldownSec,
        triggerWaiterCall,
        toast,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
