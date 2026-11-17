import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
type User = { uid: string; displayName: string | null; email: string | null; photoURL: string | null };
import { INITIAL_SETTINGS } from '../data/initialMenu';
import { Dictionary, TRANSLATIONS } from '../i18n/translations';
import { parseTableQrPayload } from '../utils/tableQrParser';
import { API_BASE, postJson } from '../services/liveApi';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

import type {
  CartItem,
  Category,
  CustomerProfile,
  CustomisationGroup,
  Language,
  LiveGalleryItem,
  LiveHomepageConfig,
  LocalOrderHistoryEntry,
  LoyaltySummary,
  LoyaltyTier,
  Order,
  OrderStatus,
  OrderType,
  Product,
  Promotion,
  HomepageOffer,
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
  offers: HomepageOffer[];
  settings: RestaurantSettings;
  homepage: LiveHomepageConfig | null;
  gallery: LiveGalleryItem[];
  catalogLoading: boolean;
  catalogError: string | null;
  reloadCatalog: () => void;

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
    if (saved === 'en' || saved === 'bn') return saved;
    return 'en';
  });

  // Never initialize or fall back to fake static products/categories/promotions.
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customisationGroups, setCustomisationGroups] = useState<CustomisationGroup[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [offers, setOffers] = useState<HomepageOffer[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings>(INITIAL_SETTINGS);
  const [homepage, setHomepage] = useState<LiveHomepageConfig | null>(null);
  const [gallery, setGallery] = useState<LiveGalleryItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [catalogReloadNonce, setCatalogReloadNonce] = useState<number>(0);

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

  const reloadCatalog = useCallback(() => {
    setCatalogReloadNonce((n) => n + 1);
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

  const applySupabaseUser = useCallback((user: SupabaseUser | null) => {
    if (!user) {
      setCustomerUser(null);
      setCustomerProfile(null);
      setCustomerOrders([]);
      return;
    }

    // User metadata is only used for editable customer profile display fields.
    // Authorization and restaurant permissions must always be enforced server-side.
    const metadata = (user.user_metadata || {}) as Record<string, unknown>;
    const displayName = String(metadata.full_name || metadata.name || user.email?.split('@')[0] || 'Customer');
    const phone = metadata.phone ? String(metadata.phone) : '';
    const defaultAddress = metadata.default_address ? String(metadata.default_address) : '';
    const preferred = String(metadata.preferred_order_type || '');
    const preferredOrderType = ['dine_in', 'takeaway', 'delivery'].includes(preferred)
      ? (preferred as OrderType)
      : undefined;

    setCustomerUser({
      uid: user.id,
      displayName,
      email: user.email || null,
      photoURL: metadata.avatar_url ? String(metadata.avatar_url) : null,
    });
    setCustomerProfile({
      uid: user.id,
      email: user.email || '',
      displayName,
      phone,
      defaultAddress,
      preferredOrderType,
      photoUrl: metadata.avatar_url ? String(metadata.avatar_url) : undefined,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    });
  }, []);

  useEffect(() => {
    if (!supabase) {
      setCustomerAuthLoading(false);
      return;
    }

    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      applySupabaseUser(session?.user || null);
      setCustomerAuthLoading(false);
    });

    void supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          showToast('Unable to restore your account session. Please sign in again.', 'error');
        }
        applySupabaseUser(data.session?.user || null);
      })
      .catch(() => {
        if (active) showToast('Unable to restore your account session. Please sign in again.', 'error');
      })
      .finally(() => {
        if (active) setCustomerAuthLoading(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [applySupabaseUser, showToast]);

  // Live catalog fetch — surfaces API errors honestly instead of showing stale/fake menu data.
  useEffect(() => {
    let active = true;
    setCatalogLoading(true);
    setCatalogError(null);

    fetch(`${API_BASE}/api/catalog`, {
      headers: { Accept: 'application/json' },
    })
      .then(async (response) => {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
          categories?: Category[];
          products?: Product[];
          customisationGroups?: CustomisationGroup[];
          promotions?: Promotion[];
          offers?: HomepageOffer[];
          settings?: Partial<RestaurantSettings>;
          homepage?: LiveHomepageConfig | null;
          gallery?: LiveGalleryItem[];
        } | null;

        if (!response.ok || !body) {
          throw new Error(
            body?.error || `Unable to load live menu from server (HTTP ${response.status}).`
          );
        }
        return body;
      })
      .then((data) => {
        if (!active) return;
        const liveCategories = Array.isArray(data.categories) ? data.categories : [];
        const liveProducts = Array.isArray(data.products) ? data.products : [];
        const liveGroups = Array.isArray(data.customisationGroups) ? data.customisationGroups : [];
        const livePromotions = Array.isArray(data.promotions) ? data.promotions : [];
        const liveOffers = Array.isArray(data.offers) ? data.offers : [];

        setCategories(liveCategories);
        setProducts(liveProducts);
        setCustomisationGroups(liveGroups);
        setPromotions(livePromotions);
        setOffers(liveOffers);
        setHomepage(data.homepage || null);
        setGallery(Array.isArray(data.gallery) ? data.gallery : []);
        if (data.settings) {
          setSettings((current) => ({ ...current, ...data.settings }));
        }
        setCatalogError(null);

        // Reconcile persisted cart items with live server prices and availability
        setCart((prevCart) => {
          if (prevCart.length === 0) return prevCart;
          const reconciled: CartItem[] = [];
          let droppedCount = 0;

          for (const ci of prevCart) {
            const liveProd = liveProducts.find((p) => p.id === ci.productId);
            if (!liveProd || !liveProd.available || liveProd.soldOut) {
              droppedCount += 1;
              continue;
            }
            const liveVariant = ci.variantId
              ? liveProd.variants?.find((v) => v.id === ci.variantId)
              : undefined;
            if (ci.variantId && !liveVariant) {
              droppedCount += 1;
              continue;
            }
            const liveUnitPrice = liveVariant ? liveVariant.price : liveProd.price;
            const liveCustomisations: SelectedCustomisation[] = ci.customisations
              .map((sel) => {
                const grp = liveGroups.find((g) => g.id === sel.groupId);
                const opt = grp?.options.find((o) => o.id === sel.optionId);
                if (!grp || !opt) return null;
                return {
                  ...sel,
                  price: opt.price,
                };
              })
              .filter((x): x is SelectedCustomisation => Boolean(x));

            reconciled.push({
              ...ci,
              productName: liveProd.name,
              image: liveProd.image || ci.image,
              unitPrice: liveUnitPrice,
              ...(liveVariant ? { variantLabel: liveVariant.label } : {}),
              customisations: liveCustomisations,
            });
          }

          if (droppedCount > 0) {
            window.setTimeout(() => {
              showToast(
                `${droppedCount} unavailable item(s) were removed from your saved cart.`,
                'info'
              );
            }, 0);
          }

          return reconciled;
        });
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error('ZESTRO live catalog load failed:', error);
        setCategories([]);
        setProducts([]);
        setPromotions([]);
        setCatalogError(
          error instanceof Error
            ? error.message
            : 'Unable to connect to the live menu service. Please check your connection and retry.'
        );
      })
      .finally(() => {
        if (active) setCatalogLoading(false);
      });

    return () => {
      active = false;
    };
  }, [catalogReloadNonce, showToast]);

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

      try {
        const resolved = await postJson<{
          tableId: string;
          tableNumber: string;
          tableName: string;
        }>('/api/tables/verify', {
          tableId: parsed.tableId,
          tableNumber: parsed.tableNumber,
        });
        applyResolvedTable(resolved.tableId, resolved.tableNumber, resolved.tableName);
        showToast(dict.qrScanner.verifiedBody.replace('{table}', resolved.tableName), 'success');
        return {
          ok: true,
          tableId: resolved.tableId,
          tableNumber: resolved.tableNumber,
          tableName: resolved.tableName,
        };
      } catch (error) {
        return {
          ok: false,
          error:
            error instanceof Error
              ? error.message
              : dict.qrScanner.tableNotFound.replace('{id}', parsed.tableNumber),
        };
      }
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

  // Verify ?table=... URL parameter or sessionStorage table against the live D1 database on mount
  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const rawTable = params.get('table');
    let candidateId: string | null = null;
    let candidateNum: string | null = null;

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
          };
          if (saved.tableId && saved.tableNumber) {
            candidateId = saved.tableId;
            candidateNum = saved.tableNumber;
          }
        }
      } catch {
        // Ignore corrupted sessionStorage
      }
    }

    if (!candidateId || !candidateNum) return;

    postJson<{ tableId: string; tableNumber: string; tableName: string }>('/api/tables/verify', {
      tableId: candidateId,
      tableNumber: candidateNum,
    })
      .then((resolved) => {
        if (!active) return;
        applyResolvedTable(resolved.tableId, resolved.tableNumber, resolved.tableName);
      })
      .catch(() => {
        if (!active) return;
        clearDetectedTable();
        if (rawTable) {
          const dict = TRANSLATIONS[languageRef.current];
          showToast(
            dict.qrScanner.tableNotFound.replace('{id}', candidateNum || rawTable),
            'error'
          );
        }
      });

    return () => {
      active = false;
    };
  }, [applyResolvedTable, clearDetectedTable, showToast]);

  // Poll live order status updates for active orders in orderHistory
  useEffect(() => {
    const syncActiveOrderStatuses = async () => {
      const activeEntries = orderHistoryRef.current.filter(
        (entry) => entry.status !== 'completed' && entry.status !== 'cancelled'
      );
      if (activeEntries.length === 0) return;

      const orderRefs = activeEntries.map((e) => e.orderRef).filter(Boolean);
      const orderIds = activeEntries.map((e) => e.orderId).filter(Boolean);

      try {
        const result = await postJson<{
          orders?: Array<{ id?: string; orderId?: string; orderRef: string; status: OrderStatus }>;
        }>('/api/orders/status', {
          orderRefs,
          orderIds,
        });
        const liveOrders = Array.isArray(result.orders) ? result.orders : [];
        if (liveOrders.length === 0) return;

        const statusByRef = new Map<string, OrderStatus>();
        const statusById = new Map<string, OrderStatus>();
        for (const row of liveOrders) {
          if (row.orderRef) statusByRef.set(row.orderRef.toUpperCase(), row.status);
          const resolvedId = row.orderId || row.id;
          if (resolvedId) statusById.set(resolvedId, row.status);
        }

        setOrderHistory((prev) => {
          let changed = false;
          const next = prev.map((entry) => {
            const liveStatus =
              statusById.get(entry.orderId) ||
              (entry.orderRef ? statusByRef.get(entry.orderRef.toUpperCase()) : undefined);
            if (!liveStatus || liveStatus === entry.status) return entry;

            changed = true;
            const prevKnown = knownOrderStatusesRef.current[entry.orderId];
            knownOrderStatusesRef.current[entry.orderId] = liveStatus;
            if (prevKnown && prevKnown !== liveStatus) {
              const dict = TRANSLATIONS[languageRef.current];
              const statusLabel = dict.history.statuses[liveStatus] || liveStatus;
              window.setTimeout(() => {
                showToast(`${entry.orderRef}: ${statusLabel}`, 'info', {
                  title: dict.history.title,
                  actionLabel: dict.history.title,
                  actionType: 'open_orders',
                });
              }, 0);
            }
            return { ...entry, status: liveStatus };
          });
          return changed ? next : prev;
        });
      } catch {
        // Silent background poll retry on next interval
      }
    };

    const initialTimer = window.setTimeout(syncActiveOrderStatuses, 3000);
    const interval = window.setInterval(syncActiveOrderStatuses, 20000);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, [showToast]);

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
    if (!detectedTableId && !detectedTableNumber) return;
    const dict = TRANSLATIONS[language];
    if (waiterCooldownSec > 0) {
      showToast(dict.hero.waiterCooldown, 'info');
      return;
    }
    setWaiterCalling(true);
    try {
      const response = await fetch(`${API_BASE}/api/waiter-calls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: detectedTableId || undefined,
          tableNumber: detectedTableNumber || undefined,
          requestType: 'Table Assistance',
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        tableNumber?: string;
      };
      if (!response.ok || !result.ok) {
        showToast(
          result.error || 'Unable to send waiter call right now. Please try again.',
          response.status === 429 ? 'info' : 'error'
        );
        if (response.status === 429) setWaiterCooldownSec(60);
        return;
      }
      if (detectedTableId) {
        localStorage.setItem(`${WAITER_COOLDOWN_KEY}_${detectedTableId}`, String(Date.now()));
      }
      setWaiterCooldownSec(60);
      showToast(
        `${dict.hero.waiterCalled} ${result.tableNumber || detectedTableNumber || ''}`.trim(),
        'success'
      );
    } catch {
      showToast('Network error sending waiter call. Please check your connection.', 'error');
    } finally {
      setWaiterCalling(false);
    }
  }, [detectedTableId, detectedTableNumber, language, showToast, waiterCooldownSec]);

  const addToCart = useCallback(
    (item: Omit<CartItem, 'cartItemId'>) => {
      const liveProd = products.find((p) => p.id === item.productId);
      if (!liveProd || !liveProd.available || liveProd.soldOut) {
        showToast('This item is currently unavailable.', 'error');
        return;
      }

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
    [language, products, showToast]
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
    const dict = TRANSLATIONS[language];
    const availableItems: CartItem[] = [];
    let skipped = 0;

    lastOrderCart.forEach((oldItem, idx) => {
      const liveProd = products.find((p) => p.id === oldItem.productId);
      if (!liveProd || !liveProd.available || liveProd.soldOut) {
        skipped += 1;
        return;
      }
      const matchedVariant = oldItem.variantId
        ? liveProd.variants?.find((v) => v.id === oldItem.variantId)
        : undefined;
      if (oldItem.variantId && !matchedVariant) {
        skipped += 1;
        return;
      }
      availableItems.push({
        ...oldItem,
        cartItemId: `ci_rep_${Date.now()}_${idx}`,
        productName: liveProd.name,
        image: liveProd.image || oldItem.image,
        unitPrice: matchedVariant ? matchedVariant.price : liveProd.price,
      });
    });

    if (availableItems.length === 0) {
      showToast(dict.history.allUnavailable, 'error');
      return;
    }

    setCart(availableItems);
    if (skipped > 0) {
      showToast(`${dict.history.reorderedSuccess} (${skipped} ${dict.history.unavailableSkipped})`, 'info');
    } else {
      showToast(dict.history.reorderedSuccess, 'success');
    }
  }, [lastOrderCart, language, products, showToast]);

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
        if (oldItem.variantId && !matchedVariant) {
          skippedCount += 1;
          continue;
        }
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

  const requireSupabase = () => {
    if (!supabase) {
      throw new Error('Customer authentication is not configured on this deployment. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
    }
    return supabase;
  };

  const signUpWithEmail = useCallback(
    async (input: {
      name: string;
      phone?: string;
      email: string;
      password: string;
      defaultAddress?: string;
    }) => {
      const client = requireSupabase();
      const { data, error } = await client.auth.signUp({
        email: input.email.trim().toLowerCase(),
        password: input.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: input.name.trim(),
            phone: input.phone?.trim() || '',
            default_address: input.defaultAddress?.trim() || '',
          },
        },
      });
      if (error) throw error;
      if (!data.session) {
        throw new Error('Your account has been created. Please check your email and confirm your address before signing in.');
      }
      applySupabaseUser(data.user);
    },
    [applySupabaseUser]
  );

  const signInWithEmail = useCallback(
    async (input: { email: string; password: string }) => {
      const client = requireSupabase();
      const { data, error } = await client.auth.signInWithPassword({
        email: input.email.trim().toLowerCase(),
        password: input.password,
      });
      if (error) throw error;
      applySupabaseUser(data.user);
    },
    [applySupabaseUser]
  );

  const signInWithGoogleCustomer = useCallback(async () => {
    const client = requireSupabase();
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  }, []);

  const saveCustomerProfile = useCallback(
    async (input: {
      displayName: string;
      phone: string;
      defaultAddress?: string;
      preferredOrderType?: OrderType;
    }) => {
      const client = requireSupabase();
      const { data, error } = await client.auth.updateUser({
        data: {
          full_name: input.displayName.trim(),
          phone: input.phone.trim(),
          default_address: input.defaultAddress?.trim() || '',
          preferred_order_type: input.preferredOrderType || '',
        },
      });
      if (error) throw error;
      applySupabaseUser(data.user);
    },
    [applySupabaseUser]
  );

  const resetCustomerPassword = useCallback(async (email: string) => {
    const client = requireSupabase();
    const { error } = await client.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: window.location.origin,
    });
    if (error) throw error;
  }, []);

  const signOutCustomer = useCallback(async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    applySupabaseUser(null);
  }, [applySupabaseUser]);

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
      Number(
        cart
          .reduce((sum, item) => {
            const extras = item.customisations.reduce((s, c) => s + c.price, 0);
            return sum + (item.unitPrice + extras) * item.quantity;
          }, 0)
          .toFixed(2)
      ),
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
      offers,
        settings,
        homepage,
        gallery,
        catalogLoading,
        catalogError,
        reloadCatalog,
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
