import React, { useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'motion/react';
import {
  ArrowRight,
  BellRing,
  Check,
  ChevronDown,
  QrCode,
  Utensils,
} from 'lucide-react';
import heroLuxuryImg from '../../assets/images/zestro_luxury_hero_1794604643314.jpg';
import { useStore } from '../../context/StoreContext';
import { SafeImage } from '../SafeImage';

interface HeroSectionProps {
  onOrderNow: () => void;
  onExploreMenu: () => void;
  onOpenQrScanner?: () => void;
}

const heroSlideUpVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.56,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const heroHeadlineVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.08,
    },
  },
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOrderNow,
  onExploreMenu,
  onOpenQrScanner,
}) => {
  const {
    language,
    t,
    isRtl,
    homepage,
    detectedTableNumber,
    detectedTableName,
    clearDetectedTable,
    waiterCalling,
    waiterCooldownSec,
    triggerWaiterCall,
  } = useStore();

  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.03, 1.12]);

  const effectiveHeadline =
    language === 'en' && homepage?.heroHeadline?.trim()
      ? homepage.heroHeadline.trim()
      : t.hero.headline;
  const effectiveSubheadline =
    language === 'en' && homepage?.heroSubheadline?.trim()
      ? homepage.heroSubheadline.trim()
      : t.hero.subheadline;
  const effectivePrimaryCta =
    language === 'en' && homepage?.heroCtaText?.trim()
      ? homepage.heroCtaText.trim()
      : t.hero.exploreMenu;
  const effectiveHeroImg = homepage?.heroImageUrl?.trim() || heroLuxuryImg;

  const headlineSegments = effectiveHeadline
    .split(/(?<=[.।])\s+/)
    .filter(Boolean);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative overflow-hidden bg-[#101210] text-[#F3EBDD] min-h-[82vh] sm:min-h-[88vh] flex items-center border-b border-[#D7A65A]/20"
    >
      {/* Full-bleed atmospheric culinary backdrop */}
      <motion.div
        style={{ y: photoY, scale: photoScale }}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none will-change-transform"
      >
        <SafeImage
          src={effectiveHeroImg}
          alt=""
          priority
          darkFallback
          className="w-full h-full object-cover object-center opacity-70 sm:opacity-75"
        />
      </motion.div>

      {/* Measured dark cinematic gradient scrim for >7:1 text contrast */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#101210]/85 via-[#101B17]/68 to-[#101210]/92 sm:bg-gradient-to-r sm:from-[#101210]/94 sm:via-[#101B17]/78 sm:to-[#101210]/38"
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-14 sm:pt-32 sm:pb-20">
        {/* Live Admin Promo Banner */}
        {homepage?.promoBannerEnabled && homepage.promoBannerText && (
          <div className="mb-5 inline-flex flex-wrap items-center gap-2.5 bg-[#D7A65A]/15 border border-[#D7A65A]/45 text-[#F3EBDD] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium backdrop-blur-xs">
            <span>{homepage.promoBannerText}</span>
            {homepage.promoBannerCode && (
              <span className="px-2 py-0.5 rounded bg-[#D7A65A] text-[#101210] font-mono-tabular font-bold text-xs">
                {homepage.promoBannerCode}
              </span>
            )}
          </div>
        )}

        {/* Table QR Assignment & Waiter Call Strip */}
        {detectedTableNumber && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 flex flex-wrap items-center justify-between gap-4 bg-[#1D2922]/90 backdrop-blur-md border border-[#D7A65A]/35 text-[#F3EBDD] px-5 py-3.5 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Utensils className="w-4 h-4 text-[#D7A65A] shrink-0" />
              <span className="text-sm font-semibold truncate">
                {t.hero.tableWelcome} {detectedTableNumber}
                {detectedTableName && (
                  <span className="hidden sm:inline ms-2 text-xs font-mono-tabular text-[#A9A79F]">
                    · {detectedTableName}
                  </span>
                )}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {onOpenQrScanner && (
                <button
                  type="button"
                  onClick={onOpenQrScanner}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/8 hover:bg-white/14 text-[#F3EBDD] text-xs font-medium transition-colors min-h-[40px] whitespace-nowrap cursor-pointer border border-white/10"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#D7A65A]" />
                  <span>{t.qrScanner.switchTableBtn}</span>
                </button>
              )}

              <button
                type="button"
                onClick={clearDetectedTable}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-white/15 text-[#A9A79F] hover:text-white hover:bg-white/8 text-xs font-medium transition-colors min-h-[40px] whitespace-nowrap cursor-pointer"
              >
                <span>{t.qrScanner.clearTableBtn}</span>
              </button>

              <motion.button
                type="button"
                whileHover={waiterCooldownSec > 0 ? undefined : { scale: 1.02 }}
                whileTap={waiterCooldownSec > 0 ? undefined : { scale: 0.97 }}
                disabled={waiterCalling || waiterCooldownSec > 0}
                onClick={triggerWaiterCall}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors min-h-[40px] whitespace-nowrap shrink-0 ${
                  waiterCooldownSec > 0
                    ? 'bg-white/10 text-[#A9A79F] cursor-default'
                    : 'bg-[#D7A65A] text-[#101210] hover:bg-[#C49245] cursor-pointer'
                }`}
              >
                {waiterCooldownSec > 0 ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {t.hero.waiterCooldown} ({waiterCooldownSec}s)
                    </span>
                  </>
                ) : (
                  <>
                    <BellRing className="w-3.5 h-3.5" />
                    <span>{t.hero.callWaiter}</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Single-Anchor Editorial Typography Composition */}
        <div className="max-w-3xl space-y-6 sm:space-y-7">
          <motion.div
            variants={heroSlideUpVariants}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex items-center gap-3 text-xs sm:text-sm font-semibold tracking-[0.22em] text-[#D7A65A] uppercase"
          >
            <span aria-hidden="true" className="w-8 h-px bg-[#D7A65A]" />
            <span>{t.hero.eyebrow}</span>
          </motion.div>

          <motion.h1
            variants={heroHeadlineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="font-display font-bold text-[#FFFFFF] leading-[1.06] tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 5.2vw, 4.45rem)', textWrap: 'balance' }}
          >
            {headlineSegments.map((segment, idx) => (
              <motion.span
                key={idx}
                variants={heroSlideUpVariants}
                className={`inline-block me-2.5 will-change-transform ${
                  idx === headlineSegments.length - 1 ? 'text-[#D7A65A]' : ''
                }`}
              >
                {segment}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            variants={heroSlideUpVariants}
            custom={0.22}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-base sm:text-lg text-[#F3EBDD]/85 max-w-xl leading-relaxed font-normal"
          >
            {effectiveSubheadline}
          </motion.p>

          {/* Primary + Secondary CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <motion.button
              type="button"
              variants={heroSlideUpVariants}
              custom={0.3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onExploreMenu}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#D7A65A] text-[#101210] font-bold text-sm rounded-xl hover:bg-[#C49245] transition-colors min-h-[48px] whitespace-nowrap shrink-0 shadow-lg shadow-black/30 cursor-pointer"
            >
              <span>{effectivePrimaryCta}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </motion.button>

            <motion.button
              type="button"
              variants={heroSlideUpVariants}
              custom={0.38}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOrderNow}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1D2922]/80 backdrop-blur-xs text-[#F3EBDD] font-semibold text-sm rounded-xl border border-[#F3EBDD]/25 hover:border-[#D7A65A] hover:text-white transition-colors min-h-[48px] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{t.hero.orderNow}</span>
            </motion.button>

            {onOpenQrScanner && !detectedTableNumber && (
              <motion.button
                type="button"
                variants={heroSlideUpVariants}
                custom={0.44}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenQrScanner}
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-transparent text-[#F3EBDD]/90 font-medium text-sm rounded-xl border border-white/15 hover:border-[#D7A65A]/60 hover:text-[#D7A65A] transition-colors min-h-[48px] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-[#D7A65A]" />
                <span>{t.qrScanner.scanTableBtn}</span>
              </motion.button>
            )}
          </div>

          {/* Unboxed Editorial Craft Strip */}
          <motion.div
            variants={heroSlideUpVariants}
            custom={0.5}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-[#A9A79F]"
          >
            <span>Signature Burgers</span>
            <span aria-hidden="true" className="text-[#D7A65A]">·</span>
            <span>Wood-Fired Pizza</span>
            <span aria-hidden="true" className="text-[#D7A65A]">·</span>
            <span>Specialty Coffee &amp; Frappes</span>
            <span aria-hidden="true" className="text-[#D7A65A]">·</span>
            <span>Dine-In, Takeaway &amp; Delivery</span>
          </motion.div>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="hidden sm:flex justify-center absolute bottom-5 inset-x-0 z-10 pointer-events-none">
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onExploreMenu}
          aria-label="Scroll to signature dishes"
          className="pointer-events-auto inline-flex items-center justify-center p-2 text-[#F3EBDD]/70 hover:text-[#D7A65A] transition-colors cursor-pointer"
        >
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.span>
        </motion.button>
      </div>
    </section>
  );
};
