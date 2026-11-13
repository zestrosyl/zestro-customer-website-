import { Language } from '../types';

export interface Dictionary {
  nav: {
    home: string;
    menu: string;
    offers: string;
    about: string;
    contact: string;
    admin: string;
    cart: string;
    orders: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    orderNow: string;
    exploreMenu: string;
    tableWelcome: string;
    callWaiter: string;
    waiterCalled: string;
    waiterCooldown: string;
  };
  sections: {
    featuredCategories: string;
    featuredCategoriesSub: string;
    signatureEyebrow: string;
    signatureTitle: string;
    signatureSub: string;
    beverageEyebrow: string;
    beverageTitle: string;
    beverageSub: string;
    exploreBeverages: string;
    popularItems: string;
    popularItemsSub: string;
    specialOffers: string;
    specialOffersSub: string;
    specialOffersEmpty: string;
    activeOfferBadge: string;
    orderOfferCta: string;
    copyPromo: string;
    promoCopied: string;
    whyChooseTitle: string;
    whyChoosePoints: { title: string; body: string }[];
    aboutEyebrow: string;
    storyTitle: string;
    storyBody: string;
    reviewsTitle: string;
    locationTitle: string;
    addressLabel: string;
    hoursLabel: string;
    phoneLabel: string;
    socialLabel: string;
    callNow: string;
    chatWhatsapp: string;
  };
  menu: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    clearSearch: string;
    all: string;
    food: string;
    beverages: string;
    popularFilter: string;
    quickAdd: string;
    viewDetails: string;
    soldOut: string;
    unavailable: string;
    customisable: string;
    noResults: string;
    popularEmpty: string;
    resetFilters: string;
    fromPrice: string;
    showingLabel: string;
    ofLabel: string;
    itemsLabel: string;
    loadMoreBtn: string;
    loadingMore: string;
    allLoaded: string;
    resultsFor: string;
    sortLabel: string;
    sortFeatured: string;
    sortPriceLow: string;
    sortPriceHigh: string;
  };
  customiser: {
    selectVariant: string;
    selectMealSides: string;
    mealSidesHint: string;
    sidesSelectedCount: string;
    specialInstructions: string;
    instructionsPlaceholder: string;
    quantity: string;
    addToCart: string;
    orderNow: string;
    optional: string;
    required: string;
    free: string;
  };
  cart: {
    title: string;
    emptyTitle: string;
    emptyBody: string;
    browseMenu: string;
    repeatLastOrder: string;
    subtotal: string;
    proceedCheckout: string;
    clearCart: string;
    itemCount: string;
    sidesLabel: string;
    noteLabel: string;
  };
  checkout: {
    title: string;
    orderTypeLabel: string;
    dineIn: string;
    dineInDesc: string;
    takeaway: string;
    takeawayDesc: string;
    delivery: string;
    deliveryDesc: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    addressLabel: string;
    addressPlaceholder: string;
    tableLabel: string;
    tableOptional: string;
    tableDetected: string;
    promoLabel: string;
    promoPlaceholder: string;
    applyPromo: string;
    notesLabel: string;
    notesPlaceholder: string;
    summaryTitle: string;
    subtotal: string;
    deliveryCharge: string;
    serviceCharge: string;
    tax: string;
    discount: string;
    total: string;
    placeOrderBtn: string;
    submitting: string;
    notAccepting: string;
    whatsappReadyTitle: string;
    whatsappReadyBody: string;
    orderRefLabel: string;
    openWhatsappAgain: string;
    doneBtn: string;
    redeem: {
      title: string;
      rateHint: string;
      availableLabel: string;
      maxCapLabel: string;
      inputLabel: string;
      inputPlaceholder: string;
      maxBtn: string;
      clearBtn: string;
      minOrderHint: string;
      signInHint: string;
      noPointsHint: string;
      discountLine: string;
      savingsPreview: string;
      exceededError: string;
      minOrderError: string;
      invalidNumberError: string;
      billLimitError: string;
    };
    errors: {
      nameRequired: string;
      phoneInvalid: string;
      addressRequired: string;
      minOrderNotMet: string;
      saveFailed: string;
    };
  };
  footer: {
    tagline: string;
    rights: string;
    whatsappOrderLine: string;
  };
  history: {
    title: string;
    subtitle: string;
    liveStatusHint: string;
    emptyTitle: string;
    emptyBody: string;
    browseMenu: string;
    reorderBtn: string;
    reopenWhatsapp: string;
    allOrdersTab: string;
    activeOrdersTab: string;
    searchPlaceholder: string;
    noActiveTitle: string;
    noActiveBody: string;
    viewAllOrdersBtn: string;
    noSearchResults: string;
    clearSearchBtn: string;
    itemsLabel: string;
    tableLabel: string;
    unavailableSkipped: string;
    allUnavailable: string;
    reorderedSuccess: string;
    orderReadyTitle: string;
    orderReadyBody: string;
    viewOrder: string;
    statuses: {
      awaiting_whatsapp_confirmation: string;
      confirmed: string;
      preparing: string;
      ready: string;
      completed: string;
      cancelled: string;
    };
  };
  account: {
    signUpBtn: string;
    myAccountBtn: string;
    signUpTab: string;
    signInTab: string;
    signUpTitle: string;
    signUpSubtitle: string;
    signInTitle: string;
    signInSubtitle: string;
    continueGoogle: string;
    orWithEmail: string;
    fullName: string;
    fullNamePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    defaultAddress: string;
    defaultAddressPlaceholder: string;
    preferredOrderType: string;
    createAccountBtn: string;
    signInSubmitBtn: string;
    creatingAccount: string;
    signingIn: string;
    signOutBtn: string;
    welcomeBack: string;
    accountCreated: string;
    signedOutToast: string;
    profileSaved: string;
    profileTab: string;
    ordersTab: string;
    memberBadge: string;
    totalOrdersStat: string;
    totalSpentStat: string;
    completeProfileBanner: string;
    saveProfileBtn: string;
    savingProfile: string;
    viewDetailsBtn: string;
    hideDetailsBtn: string;
    orderDetailsTitle: string;
    deliveryDetailsLabel: string;
    kitchenNoteLabel: string;
    customerNoteLabel: string;
    promoAppliedLabel: string;
    signedInCheckoutHint: string;
    guestCheckoutAccountHint: string;
    signInForProfileBtn: string;
    emailDisabledNotice: string;
    forgotPassword: string;
    resetTitle: string;
    resetSubtitle: string;
    sendResetBtn: string;
    sendingReset: string;
    resetSentTitle: string;
    resetSentBody: string;
    backToSignIn: string;
    errors: {
      nameRequired: string;
      phoneInvalid: string;
      emailInvalid: string;
      passwordMin: string;
      popupBlocked: string;
      genericAuth: string;
    };
    loyalty: {
      balanceLabel: string;
      pointsUnit: string;
      earnRateHint: string;
      pointsToNextTier: string;
      maxTierReached: string;
      completedLabel: string;
      inProgressLabel: string;
      welcomeBonusLabel: string;
      adminBonusLabel: string;
      redeemedLabel: string;
      redeemedOnOrder: string;
      pendingNote: string;
      earnedFromOrder: string;
      pendingFromOrder: string;
      cancelledFromOrder: string;
      welcomeSignupBanner: string;
      tiers: {
        bronze: string;
        silver: string;
        gold: string;
      };
    };
  };
  qrScanner: {
    scanTableBtn: string;
    switchTableBtn: string;
    clearTableBtn: string;
    title: string;
    subtitle: string;
    startingCamera: string;
    cameraLiveHint: string;
    cameraDenied: string;
    cameraUnavailable: string;
    retryCameraBtn: string;
    uploadQrBtn: string;
    manualLabel: string;
    manualPlaceholder: string;
    applyCodeBtn: string;
    verifying: string;
    verifiedTitle: string;
    verifiedBody: string;
    tableIdLabel: string;
    invalidQr: string;
    tableNotFound: string;
    doneBtn: string;
    autoAssignedBadge: string;
  };
}

export const TRANSLATIONS: Record<Language, Dictionary> = {
  en: {
    nav: {
      home: 'Home',
      menu: 'Menu',
      offers: 'Offers',
      about: 'About Us',
      contact: 'Contact',
      admin: 'Admin',
      cart: 'Cart',
      orders: 'Orders',
    },
    hero: {
      eyebrow: 'Modern Café & Restaurant',
      headline: 'Good Food. Great Moments. Unforgettable Zestro.',
      subheadline: 'From wood-fired pizzas and signature burgers to artisanal frappes and specialty lattes — prepared fresh for your table or doorstep.',
      orderNow: 'Order Now',
      exploreMenu: 'Explore Menu',
      tableWelcome: 'Welcome to Zestro — Table',
      callWaiter: 'Call Waiter',
      waiterCalled: 'Waiter notified for Table',
      waiterCooldown: 'Request already sent. Staff is on the way.',
    },
    sections: {
      featuredCategories: 'Curated Kitchen & Bar',
      featuredCategoriesSub: 'Jump directly into Zestro’s signature food and handcrafted beverage categories.',
      signatureEyebrow: 'Signature Selections',
      signatureTitle: 'Crafted Favorites from the Kitchen',
      signatureSub: 'Handpicked burgers, wood-fired pizzas, crisp chicken, bowls, sandwiches, and baked pasta.',
      beverageEyebrow: 'Specialty Coffee & Refreshers',
      beverageTitle: 'The Zestro Beverage Bar',
      beverageSub: 'Velvety espresso blends, chilled frappes, tropical mojitos, smoothies, and bubble drinks crafted to order.',
      exploreBeverages: 'Browse All Beverages',
      popularItems: 'Guest Favorites',
      popularItemsSub: 'Most requested dishes and signature beverages from our kitchen.',
      specialOffers: 'Special Offers',
      specialOffersSub: 'Current restaurant promotions and value deals curated by our kitchen team.',
      specialOffersEmpty: 'Check back soon for seasonal offers from Zestro.',
      activeOfferBadge: 'Active Offer',
      orderOfferCta: 'Order Now',
      copyPromo: 'Copy Code',
      promoCopied: 'Copied',
      whyChooseTitle: 'Why Guests Choose Zestro',
      whyChoosePoints: [
        {
          title: 'Cooked to Order',
          body: 'Every burger patty, pasta pan, and espresso shot is prepared fresh upon confirmation.',
        },
        {
          title: 'Honest Ingredients',
          body: 'Balanced house sauces, crisp hand-cut sides, and carefully roasted coffee beans.',
        },
        {
          title: 'Table-Side Simplicity',
          body: 'Scan your table QR, customise every detail, and send your order directly to our team.',
        },
      ],
      aboutEyebrow: 'Our Philosophy',
      storyTitle: 'The Zestro Experience',
      storyBody: 'Zestro brings together warm hospitality, an unhurried café atmosphere, and a versatile kitchen serving hearty platters alongside specialty coffee and mocktails.',
      reviewsTitle: 'Voices from Our Tables',
      locationTitle: 'Visit & Hours',
      addressLabel: 'Address',
      hoursLabel: 'Opening Hours',
      phoneLabel: 'Order & Inquiry Line',
      socialLabel: 'Social Channels',
      callNow: 'Call Us',
      chatWhatsapp: 'WhatsApp Us',
    },
    menu: {
      title: 'Digital Menu',
      subtitle: 'Browse every dish and beverage with live customisation options in BDT (৳).',
      searchPlaceholder: 'Search burgers, pizza, coffee, shakes...',
      clearSearch: 'Clear search',
      all: 'All Items',
      food: 'Food',
      beverages: 'Beverages',
      popularFilter: 'Popular',
      quickAdd: 'Quick Add',
      viewDetails: 'View Details',
      soldOut: 'Sold Out',
      unavailable: 'Unavailable',
      customisable: 'Customisable',
      noResults: 'No menu items match your search or selected category.',
      popularEmpty: 'No dishes are currently highlighted as Popular.',
      resetFilters: 'Show All Menu Items',
      fromPrice: 'From',
      showingLabel: 'Showing',
      ofLabel: 'of',
      itemsLabel: 'items',
      loadMoreBtn: 'Load More Products',
      loadingMore: 'Loading more items...',
      allLoaded: 'All items in this view are displayed',
      resultsFor: 'Results for',
      sortLabel: 'Sort',
      sortFeatured: 'Featured',
      sortPriceLow: 'Price: Low to High',
      sortPriceHigh: 'Price: High to Low',
    },
    customiser: {
      selectVariant: 'Select Size / Option',
      selectMealSides: 'Choose Any 2 Sides',
      mealSidesHint: 'Included with your meal. Select exactly 2 sides.',
      sidesSelectedCount: 'selected of 2',
      specialInstructions: 'Special Instructions',
      instructionsPlaceholder: 'Allergies, sauce on side, well done...',
      quantity: 'Quantity',
      addToCart: 'Add to Cart',
      orderNow: 'Order Now',
      optional: 'Optional',
      required: 'Required',
      free: 'Included',
    },
    cart: {
      title: 'Your Order Bag',
      emptyTitle: 'Your bag is empty',
      emptyBody: 'Add dishes or beverages from the Zestro menu to begin your order.',
      browseMenu: 'Browse Menu',
      repeatLastOrder: 'Repeat Last Order',
      subtotal: 'Subtotal',
      proceedCheckout: 'Proceed to Checkout',
      clearCart: 'Clear',
      itemCount: 'items',
      sidesLabel: 'Sides',
      noteLabel: 'Note',
    },
    checkout: {
      title: 'Complete Your Order',
      orderTypeLabel: 'Select Order Type',
      dineIn: 'Dine In',
      dineInDesc: 'Served to your table',
      takeaway: 'Takeaway',
      takeawayDesc: 'Pick up at the counter',
      delivery: 'Delivery',
      deliveryDesc: 'Delivered to your door',
      nameLabel: 'Full Name',
      namePlaceholder: 'Your name',
      phoneLabel: 'Phone Number (Bangladesh)',
      phonePlaceholder: '01XXXXXXXXX or +8801XXXXXXXXX',
      addressLabel: 'Full Delivery Address',
      addressPlaceholder: 'House, road, block/area, landmark...',
      tableLabel: 'Table Number',
      tableOptional: 'Optional (if already seated)',
      tableDetected: 'Detected from Table QR',
      promoLabel: 'Promo Code',
      promoPlaceholder: 'Enter code',
      applyPromo: 'Apply',
      notesLabel: 'Order Notes (Optional)',
      notesPlaceholder: 'Any extra delivery or dining notes',
      summaryTitle: 'Order Summary',
      subtotal: 'Subtotal',
      deliveryCharge: 'Delivery Charge',
      serviceCharge: 'Service Charge',
      tax: 'Tax / VAT',
      discount: 'Discount',
      total: 'Total',
      placeOrderBtn: 'Send Order on WhatsApp',
      submitting: 'Preparing Order...',
      notAccepting: 'Zestro is temporarily paused for new online orders.',
      whatsappReadyTitle: 'WhatsApp Order Ready',
      whatsappReadyBody: 'Your order message is ready! Please press SEND in WhatsApp to contact Zestro. Your order will be confirmed once our team accepts it.',
      orderRefLabel: 'Order Reference',
      openWhatsappAgain: 'Open WhatsApp',
      doneBtn: 'Back to Menu',
      redeem: {
        title: 'Redeem Loyalty Points',
        rateHint: '10 pts = ৳1 · Min order ৳399 · Up to 80% of points per order',
        availableLabel: 'Available Balance',
        maxCapLabel: 'Max 80% Allowed',
        inputLabel: 'Points to Redeem',
        inputPlaceholder: 'Enter points (e.g. 80)',
        maxBtn: 'Use Max 80%',
        clearBtn: 'Clear',
        minOrderHint: 'Add {amount} more to unlock points redemption (minimum order ৳399).',
        signInHint: 'Sign in or sign up to redeem your Zestro loyalty points on orders of ৳399+.',
        noPointsHint: 'No redeemable loyalty points available yet.',
        discountLine: 'Points Redeemed ({pts} pts)',
        savingsPreview: 'Redeeming {pts} pts saves {amount} on this order',
        exceededError: 'Exceeds 80% limit — you can redeem at most {max} pts on this order.',
        minOrderError: 'Minimum order of ৳399 is required to redeem loyalty points.',
        invalidNumberError: 'Enter a whole number of points.',
        billLimitError: 'Points entered exceed the remaining payable order total (max {max} pts).',
      },
      errors: {
        nameRequired: 'Please enter your name.',
        phoneInvalid: 'Please enter a valid Bangladeshi mobile number (e.g. 017XXXXXXXX).',
        addressRequired: 'Please enter your full delivery address.',
        minOrderNotMet: 'Minimum order amount for delivery is',
        saveFailed: 'Could not save order to server, but you can still send your order via WhatsApp below.',
      },
    },
    footer: {
      tagline: 'Crafted food, specialty coffee, and warm table hospitality.',
      rights: 'All rights reserved.',
      whatsappOrderLine: 'WhatsApp Order Line',
    },
    history: {
      title: 'Your Orders',
      subtitle: 'Track live kitchen progress and reorder your favorites from this browser.',
      liveStatusHint: 'Live status synced with Zestro kitchen',
      emptyTitle: 'No past orders yet',
      emptyBody: 'Once you place an order on Zestro, it will appear here with live status updates and one-tap reordering.',
      browseMenu: 'Browse Menu',
      reorderBtn: 'Reorder Items',
      reopenWhatsapp: 'Open WhatsApp',
      allOrdersTab: 'All Orders',
      activeOrdersTab: 'Active Orders',
      searchPlaceholder: 'Search by order ref, dish, or table...',
      noActiveTitle: 'No active orders right now',
      noActiveBody: 'Every order in this feed has been completed or cancelled.',
      viewAllOrdersBtn: 'View All Orders',
      noSearchResults: 'No orders match "{query}".',
      clearSearchBtn: 'Clear Search',
      itemsLabel: 'items',
      tableLabel: 'Table',
      unavailableSkipped: 'item(s) currently unavailable were skipped.',
      allUnavailable: 'Items from this order are currently unavailable.',
      reorderedSuccess: 'Items added to your bag',
      orderReadyTitle: 'Order Ready!',
      orderReadyBody: 'Your order {ref} is freshly prepared and ready.',
      viewOrder: 'View Order',
      statuses: {
        awaiting_whatsapp_confirmation: 'Pending WhatsApp',
        confirmed: 'Confirmed',
        preparing: 'Preparing',
        ready: 'Ready',
        completed: 'Completed',
        cancelled: 'Cancelled',
      },
    },
    account: {
      signUpBtn: 'Sign Up',
      myAccountBtn: 'Account',
      signUpTab: 'Create Account',
      signInTab: 'Sign In',
      signUpTitle: 'Join Zestro',
      signUpSubtitle: 'Save your delivery details, track live kitchen status, and access every order receipt.',
      signInTitle: 'Welcome Back to Zestro',
      signInSubtitle: 'Sign in to view your profile, active orders, and complete order history.',
      continueGoogle: 'Continue with Google',
      orWithEmail: 'or continue with email',
      fullName: 'Full Name',
      fullNamePlaceholder: 'e.g. Nusrat Jahan',
      phone: 'Mobile Number (Optional)',
      phonePlaceholder: '01XXXXXXXXX',
      email: 'Email Address',
      emailPlaceholder: 'you@example.com',
      password: 'Password',
      passwordPlaceholder: 'Minimum 6 characters',
      defaultAddress: 'Default Delivery Address (Optional)',
      defaultAddressPlaceholder: 'House, road, block/area, landmark...',
      preferredOrderType: 'Preferred Order Mode',
      createAccountBtn: 'Create Customer Account',
      signInSubmitBtn: 'Sign In',
      creatingAccount: 'Creating Account...',
      signingIn: 'Signing In...',
      signOutBtn: 'Sign Out',
      welcomeBack: 'Signed in to your Zestro account',
      accountCreated: 'Welcome to Zestro! 100 welcome loyalty points added to your account.',
      signedOutToast: 'You have signed out.',
      profileSaved: 'Profile details updated.',
      profileTab: 'My Profile',
      ordersTab: 'My Orders',
      memberBadge: 'Zestro Guest Member',
      totalOrdersStat: 'Orders Placed',
      totalSpentStat: 'Total Ordered',
      completeProfileBanner: 'Add your phone number and default address for one-tap checkout.',
      saveProfileBtn: 'Save Profile',
      savingProfile: 'Saving...',
      viewDetailsBtn: 'Order Details',
      hideDetailsBtn: 'Hide Details',
      orderDetailsTitle: 'Complete Order Receipt',
      deliveryDetailsLabel: 'Contact & Fulfilment',
      kitchenNoteLabel: 'Kitchen Update',
      customerNoteLabel: 'Your Note',
      promoAppliedLabel: 'Promo Applied',
      signedInCheckoutHint: 'Pre-filled from your Zestro profile · This order will be saved to your account.',
      guestCheckoutAccountHint: 'Want live tracking across devices? Sign up or sign in to link orders to your profile.',
      signInForProfileBtn: 'Sign Up / Sign In',
      emailDisabledNotice: 'Email & Password sign-in is not yet enabled in Firebase Console. Use Google Sign-Up above for instant access, or enable Email/Password under Authentication → Sign-in method.',
      forgotPassword: 'Forgot password?',
      resetTitle: 'Reset Password',
      resetSubtitle: 'Enter your registered email and we will send a secure link to reset your password.',
      sendResetBtn: 'Send Reset Link',
      sendingReset: 'Sending Link...',
      resetSentTitle: 'Reset Link Sent',
      resetSentBody: 'Check your inbox (and spam folder) at {email} for instructions to set a new password.',
      backToSignIn: 'Back to Sign In',
      errors: {
        nameRequired: 'Please enter your full name.',
        phoneInvalid: 'Please enter a valid phone number (7–16 digits).',
        emailInvalid: 'Please enter a valid email address.',
        passwordMin: 'Password must be at least 6 characters long.',
        popupBlocked: 'Sign-in popup was closed or blocked. Please allow popups and try again.',
        genericAuth: 'Unable to authenticate right now. Please check your details and try again.',
      },
      loyalty: {
        balanceLabel: 'Available Loyalty Points',
        pointsUnit: 'pts',
        earnRateHint: 'Earn 1 pt per ৳10 once delivered / completed',
        pointsToNextTier: '{pts} pts to {tier}',
        maxTierReached: 'Top tier unlocked',
        completedLabel: 'Orders',
        inProgressLabel: 'Pending',
        welcomeBonusLabel: 'Welcome',
        adminBonusLabel: 'Admin Bonus',
        redeemedLabel: 'Redeemed',
        redeemedOnOrder: 'Redeemed {pts} pts',
        pendingNote: 'Order points stay pending until delivered or completed. Cancelled orders earn 0 pts.',
        earnedFromOrder: '+{pts} pts',
        pendingFromOrder: '+{pts} pts pending',
        cancelledFromOrder: '0 pts (Cancelled)',
        welcomeSignupBanner: 'Register today and receive 100 welcome loyalty points automatically.',
        tiers: {
          bronze: 'Bronze',
          silver: 'Silver',
          gold: 'Gold',
        },
      },
    },
    qrScanner: {
      scanTableBtn: 'Scan Table QR',
      switchTableBtn: 'Switch Table',
      clearTableBtn: 'Clear',
      title: 'Scan Table QR',
      subtitle: 'Point your camera at the QR code on your Zestro table to link your order automatically.',
      startingCamera: 'Starting camera...',
      cameraLiveHint: 'Align the table QR code inside the frame',
      cameraDenied: 'Camera permission was denied or blocked. Upload a QR photo or enter your table number below.',
      cameraUnavailable: 'Live camera is not available in this browser view. Upload a QR image or enter your table number below.',
      retryCameraBtn: 'Retry Camera',
      uploadQrBtn: 'Upload QR Image',
      manualLabel: 'Or enter table number / QR code',
      manualPlaceholder: 'e.g. 04 or table-04',
      applyCodeBtn: 'Link Table',
      verifying: 'Verifying table...',
      verifiedTitle: 'Table Linked',
      verifiedBody: 'Your dine-in order is automatically assigned to {table}.',
      tableIdLabel: 'Table ID',
      invalidQr: 'Unrecognized QR code. Please scan a Zestro table QR code or enter a valid table number.',
      tableNotFound: 'Table "{id}" was not found. Please verify the number on your table.',
      doneBtn: 'Continue to Order',
      autoAssignedBadge: 'QR Assigned',
    },
  },
  bn: {
    nav: {
      home: 'হোম',
      menu: 'মেনু',
      offers: 'অফার',
      about: 'আমাদের সম্পর্কে',
      contact: 'যোগাযোগ',
      admin: 'অ্যাডমিন',
      cart: 'কার্ট',
      orders: 'অর্ডার',
    },
    hero: {
      eyebrow: 'মডার্ন ক্যাফে ও রেস্টুরেন্ট',
      headline: 'অনন্য স্বাদ। সুন্দর মুহূর্ত। স্মরণীয় জেস্ট্রো।',
      subheadline: 'উড-ফায়ার্ড পিজ্জা ও সিগনেচার বার্গার থেকে শুরু করে ফ্রাপে ও স্পেশালিটি কফি — প্রতিটি পদ আপনার জন্য তাজা তৈরি।',
      orderNow: 'এখনই অর্ডার করুন',
      exploreMenu: 'মেনু দেখুন',
      tableWelcome: 'জেস্ট্রোতে স্বাগতম — টেবিল',
      callWaiter: 'ওয়েটার ডাকুন',
      waiterCalled: 'ওয়েটারকে জানানো হয়েছে — টেবিল',
      waiterCooldown: 'অনুরোধ পাঠানো হয়েছে। আমাদের টিম আসছে।',
    },
    sections: {
      featuredCategories: 'আমাদের মেনু ক্যাটাগরি',
      featuredCategoriesSub: 'জেস্ট্রোর জনপ্রিয় খাবার ও পানীয় ক্যাটাগরিগুলো দেখুন।',
      signatureEyebrow: 'সিগনেচার সিলেকশন',
      signatureTitle: 'কিচেনের সেরা সিগনেচার পদ',
      signatureSub: 'বাছাইকৃত বার্গার, পিজ্জা, ফ্রাইড চিকেন, রাইস বোল, স্যান্ডউইচ এবং বেকড পাস্তা।',
      beverageEyebrow: 'স্পেশালিটি কফি ও রিফ্রেশার',
      beverageTitle: 'জেস্ট্রো বেভারেজ বার',
      beverageSub: 'এসপ্রেসো ব্লেন্ড, ফ্রাপে, মোহিতো, স্মুদি এবং বাবল ড্রিংকস — অর্ডার অনুযায়ী তাজা প্রস্তুত।',
      exploreBeverages: 'সব পানীয় দেখুন',
      popularItems: 'জনপ্রিয় আইটেম',
      popularItemsSub: 'অতিথিদের সবচেয়ে পছন্দের খাবার ও পানীয়সমূহ।',
      specialOffers: 'বিশেষ অফার',
      specialOffersSub: 'বর্তমানে চলমান বিশেষ অফার ও ডিলসমূহ।',
      specialOffersEmpty: 'নতুন অফারের জন্য শীঘ্রই আবার দেখুন।',
      activeOfferBadge: 'চলমান অফার',
      orderOfferCta: 'এখনই অর্ডার করুন',
      copyPromo: 'কোড কপি করুন',
      promoCopied: 'কপি হয়েছে',
      whyChooseTitle: 'কেন জেস্ট্রো বেছে নেবেন',
      whyChoosePoints: [
        {
          title: 'তাজা ও অর্ডার অনুযায়ী তৈরি',
          body: 'প্রতিটি বার্গার, পাস্তা ও কফি অর্ডার কনফার্ম হওয়ার পর তাজা তৈরি করা হয়।',
        },
        {
          title: 'মানসম্মত উপকরণ',
          body: 'ঘরোয়া স্পেশাল সস, ক্রিস্পি সাইড এবং বাছাইকৃত কফি বিনের সমন্বয়।',
        },
        {
          title: 'সহজ টেবিল অর্ডারিং',
          body: 'টেবিলের কিউআর কোড স্ক্যান করে নিজের মতো কাস্টমাইজ করে সহজে অর্ডার করুন।',
        },
      ],
      aboutEyebrow: 'আমাদের গল্প',
      storyTitle: 'জেস্ট্রো অভিজ্ঞতা',
      storyBody: 'জেস্ট্রোতে একসাথে মিলছে উষ্ণ আতিথেয়তা, আরামদায়ক ক্যাফে পরিবেশ এবং দুর্দান্ত সব খাবার ও পানীয়ের সমাহার।',
      reviewsTitle: 'অতিথিদের মতামত',
      locationTitle: 'ঠিকানা ও সময়সূচি',
      addressLabel: 'ঠিকানা',
      hoursLabel: 'খোলার সময়',
      phoneLabel: 'অর্ডার ও তথ্য লাইন',
      socialLabel: 'সোশ্যাল মিডিয়া',
      callNow: 'কল করুন',
      chatWhatsapp: 'হোয়াটসঅ্যাপ',
    },
    menu: {
      title: 'ডিজিটাল মেনু',
      subtitle: 'বাংলাদেশি টাকায় (৳) মূল্য ও কাস্টমাইজেশনসহ সম্পূর্ণ মেনু দেখুন।',
      searchPlaceholder: 'বার্গার, পিজ্জা, কফি, শেক খুঁজুন...',
      clearSearch: 'অনুসন্ধান মুছুন',
      all: 'সব আইটেম',
      food: 'খাবার',
      beverages: 'পানীয়',
      popularFilter: 'জনপ্রিয়',
      quickAdd: 'যোগ করুন',
      viewDetails: 'বিস্তারিত',
      soldOut: 'শেষ হয়ে গেছে',
      unavailable: 'অনুপলব্ধ',
      customisable: 'কাস্টমাইজযোগ্য',
      noResults: 'আপনার খোঁজের সাথে কোনো মেনু আইটেম মেলেনি।',
      popularEmpty: 'বর্তমানে কোনো জনপ্রিয় আইটেম চিহ্নিত নেই।',
      resetFilters: 'সব আইটেম দেখুন',
      fromPrice: 'শুরু',
      showingLabel: 'দেখানো হচ্ছে',
      ofLabel: 'এর মধ্যে',
      itemsLabel: 'টি আইটেম',
      loadMoreBtn: 'আরও আইটেম দেখুন',
      loadingMore: 'লোড হচ্ছে...',
      allLoaded: 'এই তালিকার সব আইটেম দেখানো হয়েছে',
      resultsFor: 'ফলাফল:',
      sortLabel: 'সাজান',
      sortFeatured: 'বাছাইকৃত',
      sortPriceLow: 'দাম: কম থেকে বেশি',
      sortPriceHigh: 'দাম: বেশি থেকে কম',
    },
    customiser: {
      selectVariant: 'সাইজ / অপশন নির্বাচন করুন',
      selectMealSides: 'যেকোনো ২টি সাইড বেছে নিন',
      mealSidesHint: 'মিলের সাথে অন্তর্ভুক্ত। ঠিক ২টি সাইড নির্বাচন করুন।',
      sidesSelectedCount: 'নির্বাচিত (২টির মধ্যে)',
      specialInstructions: 'বিশেষ নির্দেশনা',
      instructionsPlaceholder: 'ঝাল কম, আলাদা সস, বা অন্য কোনো নির্দেশনা...',
      quantity: 'পরিমাণ',
      addToCart: 'কার্টে যোগ করুন',
      orderNow: 'এখনই অর্ডার করুন',
      optional: 'ঐচ্ছিক',
      required: 'আবশ্যক',
      free: 'অন্তর্ভুক্ত',
    },
    cart: {
      title: 'আপনার অর্ডার ব্যাগ',
      emptyTitle: 'আপনার ব্যাগ খালি',
      emptyBody: 'অর্ডার শুরু করতে জেস্ট্রো মেনু থেকে খাবার বা পানীয় যোগ করুন।',
      browseMenu: 'মেনু দেখুন',
      repeatLastOrder: 'আগের অর্ডার পুনরায় করুন',
      subtotal: 'সাবটোটাল',
      proceedCheckout: 'চেকআউট করুন',
      clearCart: 'মুছুন',
      itemCount: 'আইটেম',
      sidesLabel: 'সাইডস',
      noteLabel: 'নোট',
    },
    checkout: {
      title: 'অর্ডার সম্পন্ন করুন',
      orderTypeLabel: 'অর্ডারের ধরন নির্বাচন করুন',
      dineIn: 'ডাইন ইন',
      dineInDesc: 'আপনার টেবিলে পরিবেশন',
      takeaway: 'টেকঅ্যাওয়ে',
      takeawayDesc: 'কাউন্টার থেকে সংগ্রহ',
      delivery: 'ডেলিভারি',
      deliveryDesc: 'আপনার ঠিকানায় পৌঁছে দেওয়া হবে',
      nameLabel: 'আপনার নাম',
      namePlaceholder: 'পূর্ণ নাম লিখুন',
      phoneLabel: 'মোবাইল নম্বর (বাংলাদেশ)',
      phonePlaceholder: '01XXXXXXXXX অথবা +8801XXXXXXXXX',
      addressLabel: 'সম্পূর্ণ ডেলিভারি ঠিকানা',
      addressPlaceholder: 'বাসা, রোড, এলাকা, পরিচিত স্থান...',
      tableLabel: 'টেবিল নম্বর',
      tableOptional: 'ঐচ্ছিক (টেবিলে বসে থাকলে)',
      tableDetected: 'টেবিল কিউআর থেকে শনাক্তকৃত',
      promoLabel: 'প্রোমো কোড',
      promoPlaceholder: 'কোড লিখুন',
      applyPromo: 'প্রয়োগ',
      notesLabel: 'অতিরিক্ত নোট (ঐচ্ছিক)',
      notesPlaceholder: 'ডেলিভারি বা খাবার সংক্রান্ত কোনো নোট',
      summaryTitle: 'অর্ডার সারাংশ',
      subtotal: 'সাবটোটাল',
      deliveryCharge: 'ডেলিভারি চার্জ',
      serviceCharge: 'সার্ভিস চার্জ',
      tax: 'ভ্যাট / ট্যাক্স',
      discount: 'ছাড়',
      total: 'সর্বমোট',
      placeOrderBtn: 'হোয়াটসঅ্যাপে অর্ডার পাঠান',
      submitting: 'অর্ডার প্রস্তুত হচ্ছে...',
      notAccepting: 'জেস্ট্রো সাময়িকভাবে নতুন অনলাইন অর্ডার গ্রহণ বন্ধ রেখেছে।',
      whatsappReadyTitle: 'হোয়াটসঅ্যাপ অর্ডার প্রস্তুত',
      whatsappReadyBody: 'আপনার অর্ডার বার্তা তৈরি! জেস্ট্রোর সাথে যোগাযোগ করতে অনুগ্রহ করে হোয়াটসঅ্যাপে SEND চাপুন। আমাদের টিম গ্রহণ করার পর আপনার অর্ডার কনফার্ম হবে।',
      orderRefLabel: 'অর্ডার রেফারেন্স',
      openWhatsappAgain: 'হোয়াটসঅ্যাপ খুলুন',
      doneBtn: 'মেনুতে ফিরে যান',
      redeem: {
        title: 'লয়ালটি পয়েন্ট রিডিম করুন',
        rateHint: '১০ পয়েন্ট = ৳১ · সর্বনিম্ন অর্ডার ৳৩৯৯ · সর্বোচ্চ ৮০% পয়েন্ট ব্যবহারযোগ্য',
        availableLabel: 'ব্যবহারযোগ্য ব্যালেন্স',
        maxCapLabel: 'সর্বোচ্চ ৮০% সীমা',
        inputLabel: 'কত পয়েন্ট ব্যবহার করতে চান?',
        inputPlaceholder: 'পয়েন্ট লিখুন (যেমন ৮০)',
        maxBtn: 'সর্বোচ্চ ৮০%',
        clearBtn: 'মুছুন',
        minOrderHint: 'পয়েন্ট রিডিম করতে আরও {amount} যোগ করুন (সর্বনিম্ন অর্ডার ৳৩৯৯)।',
        signInHint: '৳৩৯৯+ অর্ডারে লয়ালটি পয়েন্ট ব্যবহার করতে সাইন ইন বা সাইন আপ করুন।',
        noPointsHint: 'এই মুহূর্তে ব্যবহারযোগ্য কোনো লয়ালটি পয়েন্ট নেই।',
        discountLine: 'পয়েন্ট রিডিম ({pts} পয়েন্ট)',
        savingsPreview: '{pts} পয়েন্ট ব্যবহারে {amount} ছাড় পাচ্ছেন',
        exceededError: '৮০% সীমা অতিক্রম করেছে — এই অর্ডারে সর্বোচ্চ {max} পয়েন্ট ব্যবহার করা যাবে।',
        minOrderError: 'পয়েন্ট রিডিম করতে সর্বনিম্ন ৳৩৯৯ টাকার অর্ডার প্রয়োজন।',
        invalidNumberError: 'অনুগ্রহ করে সঠিক পূর্ণ সংখ্যা দিন।',
        billLimitError: 'প্রদেয় বিলের চেয়ে বেশি পয়েন্ট দেওয়া হয়েছে (সর্বোচ্চ {max} পয়েন্ট)।',
      },
      errors: {
        nameRequired: 'অনুগ্রহ করে আপনার নাম লিখুন।',
        phoneInvalid: 'অনুগ্রহ করে সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন 017XXXXXXXX)।',
        addressRequired: 'অনুগ্রহ করে সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন।',
        minOrderNotMet: 'ডেলিভারির জন্য ন্যূনতম অর্ডার পরিমাণ',
        saveFailed: 'সার্ভারে অর্ডার সংরক্ষণ করা যায়নি, তবে নিচের বাটন থেকে সরাসরি হোয়াটসঅ্যাপে পাঠাতে পারবেন।',
      },
    },
    footer: {
      tagline: 'তাজা খাবার, স্পেশালিটি কফি এবং আন্তরিক আতিথেয়তা।',
      rights: 'সর্বস্বত্ব সংরক্ষিত।',
      whatsappOrderLine: 'হোয়াটসঅ্যাপ অর্ডার লাইন',
    },
    history: {
      title: 'আপনার অর্ডারসমূহ',
      subtitle: 'লাইভ কিচেন স্ট্যাটাস দেখুন এবং পছন্দের খাবার সহজেই পুনরায় অর্ডার করুন।',
      liveStatusHint: 'জেস্ট্রো কিচেনের সাথে লাইভ স্ট্যাটাস যুক্ত',
      emptyTitle: 'এখনো কোনো অর্ডার নেই',
      emptyBody: 'জেস্ট্রোতে অর্ডার করার পর এখানে লাইভ স্ট্যাটাস ও এক-ট্যাপে রিঅর্ডার অপশন দেখতে পাবেন।',
      browseMenu: 'মেনু দেখুন',
      reorderBtn: 'পুনরায় অর্ডার করুন',
      reopenWhatsapp: 'হোয়াটসঅ্যাপ খুলুন',
      allOrdersTab: 'সব অর্ডার',
      activeOrdersTab: 'চলমান অর্ডার',
      searchPlaceholder: 'অর্ডার রেফ, খাবার বা টেবিল দিয়ে খুঁজুন...',
      noActiveTitle: 'এই মুহূর্তে কোনো চলমান অর্ডার নেই',
      noActiveBody: 'আপনার সব অর্ডার ইতিমধ্যে সম্পন্ন বা বাতিল হয়েছে।',
      viewAllOrdersBtn: 'সব অর্ডার দেখুন',
      noSearchResults: '"{query}"-এর সাথে কোনো অর্ডার মেলেনি।',
      clearSearchBtn: 'অনুসন্ধান মুছুন',
      itemsLabel: 'টি আইটেম',
      tableLabel: 'টেবিল',
      unavailableSkipped: 'টি আইটেম বর্তমানে অনুপলব্ধ হওয়ায় বাদ দেওয়া হয়েছে।',
      allUnavailable: 'এই অর্ডারের আইটেমগুলো বর্তমানে অনুপলব্ধ।',
      reorderedSuccess: 'আইটেমগুলো আপনার ব্যাগে যোগ করা হয়েছে',
      orderReadyTitle: 'অর্ডার প্রস্তুত!',
      orderReadyBody: 'আপনার অর্ডার {ref} সম্পূর্ণ তৈরি এবং এখন প্রস্তুত!',
      viewOrder: 'অর্ডার দেখুন',
      statuses: {
        awaiting_whatsapp_confirmation: 'হোয়াটসঅ্যাপ অপেক্ষমান',
        confirmed: 'কনফার্মড',
        preparing: 'প্রস্তুত হচ্ছে',
        ready: 'প্রস্তুত',
        completed: 'সম্পন্ন',
        cancelled: 'বাতিল',
      },
    },
    account: {
      signUpBtn: 'সাইন আপ',
      myAccountBtn: 'অ্যাকাউন্ট',
      signUpTab: 'নতুন অ্যাকাউন্ট',
      signInTab: 'সাইন ইন',
      signUpTitle: 'জেস্ট্রোতে যোগ দিন',
      signUpSubtitle: 'দ্রুত চেকআউটের জন্য ঠিকানা সংরক্ষণ করুন এবং লাইভ অর্ডার স্ট্যাটাস ও বিস্তারিত দেখুন।',
      signInTitle: 'জেস্ট্রোতে স্বাগতম',
      signInSubtitle: 'আপনার প্রোফাইল, চলমান অর্ডার এবং পূর্বের অর্ডারের বিস্তারিত দেখতে সাইন ইন করুন।',
      continueGoogle: 'গুগল দিয়ে চালিয়ে যান',
      orWithEmail: 'অথবা ইমেইল ব্যবহার করুন',
      fullName: 'পূর্ণ নাম',
      fullNamePlaceholder: 'আপনার নাম লিখুন',
      phone: 'মোবাইল নম্বর (ঐচ্ছিক)',
      phonePlaceholder: '01XXXXXXXXX',
      email: 'ইমেইল ঠিকানা',
      emailPlaceholder: 'you@example.com',
      password: 'পাসওয়ার্ড',
      passwordPlaceholder: 'কমপক্ষে ৬ অক্ষর',
      defaultAddress: 'ডিফল্ট ডেলিভারি ঠিকানা (ঐচ্ছিক)',
      defaultAddressPlaceholder: 'বাসা, রোড, এলাকা, পরিচিত স্থান...',
      preferredOrderType: 'পছন্দের অর্ডার ধরন',
      createAccountBtn: 'অ্যাকাউন্ট তৈরি করুন',
      signInSubmitBtn: 'সাইন ইন করুন',
      creatingAccount: 'অ্যাকাউন্ট তৈরি হচ্ছে...',
      signingIn: 'সাইন ইন হচ্ছে...',
      signOutBtn: 'সাইন আউট',
      welcomeBack: 'আপনার জেস্ট্রো অ্যাকাউন্টে স্বাগতম',
      accountCreated: 'জেস্ট্রোতে স্বাগতম! আপনার অ্যাকাউন্টে ১০০টি স্বাগতম পয়েন্ট যোগ হয়েছে।',
      signedOutToast: 'আপনি সাইন আউট করেছেন।',
      profileSaved: 'প্রোফাইল তথ্য সংরক্ষণ করা হয়েছে।',
      profileTab: 'আমার প্রোফাইল',
      ordersTab: 'আমার অর্ডারসমূহ',
      memberBadge: 'জেস্ট্রো মেম্বার',
      totalOrdersStat: 'মোট অর্ডার',
      totalSpentStat: 'মোট খরচ',
      completeProfileBanner: 'এক-ট্যাপে চেকআউটের জন্য আপনার মোবাইল নম্বর ও ঠিকানা যোগ করুন।',
      saveProfileBtn: 'প্রোফাইল সংরক্ষণ',
      savingProfile: 'সংরক্ষণ হচ্ছে...',
      viewDetailsBtn: 'বিস্তারিত দেখুন',
      hideDetailsBtn: 'বিস্তারিত লুকান',
      orderDetailsTitle: 'অর্ডারের সম্পূর্ণ রসিদ',
      deliveryDetailsLabel: 'যোগাযোগ ও ডেলিভারি তথ্য',
      kitchenNoteLabel: 'কিচেন নোট',
      customerNoteLabel: 'আপনার নোট',
      promoAppliedLabel: 'প্রোমো প্রয়োগকৃত',
      signedInCheckoutHint: 'আপনার প্রোফাইল থেকে তথ্য নেওয়া হয়েছে · অর্ডারটি আপনার অ্যাকাউন্টে সংরক্ষিত হবে।',
      guestCheckoutAccountHint: 'সব ডিভাইসে লাইভ অর্ডার ট্র্যাক করতে সাইন আপ বা সাইন ইন করুন।',
      signInForProfileBtn: 'সাইন আপ / সাইন ইন',
      emailDisabledNotice: 'ফায়ারবেস কনসোলে ইমেইল ও পাসওয়ার্ড লগইন এখনো চালু করা হয়নি। তাৎক্ষণিক অ্যাক্সেসের জন্য উপরের গুগল বাটন ব্যবহার করুন।',
      forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
      resetTitle: 'পাসওয়ার্ড রিসেট করুন',
      resetSubtitle: 'আপনার নিবন্ধিত ইমেইল লিখুন, আমরা পাসওয়ার্ড রিসেটের লিংক পাঠাব।',
      sendResetBtn: 'রিসেট লিংক পাঠান',
      sendingReset: 'পাঠানো হচ্ছে...',
      resetSentTitle: 'রিসেট লিংক পাঠানো হয়েছে',
      resetSentBody: 'নতুন পাসওয়ার্ড সেট করতে {email}-এর ইনবক্স (বা স্প্যাম ফোল্ডার) দেখুন।',
      backToSignIn: 'সাইন ইনে ফিরে যান',
      errors: {
        nameRequired: 'অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।',
        phoneInvalid: 'অনুগ্রহ করে সঠিক ফোন নম্বর দিন (৭–১৬ অঙ্ক)।',
        emailInvalid: 'সঠিক ইমেইল ঠিকানা দিন।',
        passwordMin: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।',
        popupBlocked: 'সাইন-ইন পপআপ বন্ধ বা ব্লক করা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        genericAuth: 'এই মুহূর্তে সাইন ইন করা যাচ্ছে না। তথ্য যাচাই করে আবার চেষ্টা করুন।',
      },
      loyalty: {
        balanceLabel: 'ব্যবহারযোগ্য লয়ালটি পয়েন্টস',
        pointsUnit: 'পয়েন্ট',
        earnRateHint: 'অর্ডার সম্পন্ন হলে প্রতি ৳১০-এ ১ পয়েন্ট যোগ হবে',
        pointsToNextTier: '{tier} হতে আরও {pts} পয়েন্ট',
        maxTierReached: 'সর্বোচ্চ ধাপ অর্জিত',
        completedLabel: 'অর্ডার থেকে',
        inProgressLabel: 'অপেক্ষমান',
        welcomeBonusLabel: 'স্বাগতম',
        adminBonusLabel: 'অ্যাডমিন বোনাস',
        redeemedLabel: 'ব্যবহৃত',
        redeemedOnOrder: 'রিডিম {pts} পয়েন্ট',
        pendingNote: 'অর্ডার ডেলিভারি বা সম্পন্ন হওয়ার পর পয়েন্ট যুক্ত হবে। বাতিল অর্ডারে কোনো পয়েন্ট যোগ হয় না।',
        earnedFromOrder: '+{pts} পয়েন্ট',
        pendingFromOrder: '+{pts} পয়েন্ট অপেক্ষমান',
        cancelledFromOrder: '০ পয়েন্ট (বাতিল)',
        welcomeSignupBanner: 'নিবন্ধন করলেই পাচ্ছেন ১০০টি স্বাগতম লয়ালটি পয়েন্ট।',
        tiers: {
          bronze: 'ব্রোঞ্জ',
          silver: 'সিলভার',
          gold: 'গোল্ড',
        },
      },
    },
    qrScanner: {
      scanTableBtn: 'টেবিল QR স্ক্যান',
      switchTableBtn: 'টেবিল বদলান',
      clearTableBtn: 'সরান',
      title: 'টেবিল QR স্ক্যান করুন',
      subtitle: 'অর্ডারটি স্বয়ংক্রিয়ভাবে আপনার টেবিলে যুক্ত করতে টেবিলের QR কোড স্ক্যান করুন।',
      startingCamera: 'ক্যামেরা চালু হচ্ছে...',
      cameraLiveHint: 'ফ্রেমের ভেতরে টেবিল QR কোডটি ধরুন',
      cameraDenied: 'ক্যামেরার অনুমতি পাওয়া যায়নি। নিচে QR ছবি আপলোড করুন অথবা টেবিল নম্বর লিখুন।',
      cameraUnavailable: 'এই ব্রাউজারে লাইভ ক্যামেরা উপলব্ধ নয়। নিচে QR ছবি আপলোড করুন অথবা টেবিল নম্বর লিখুন।',
      retryCameraBtn: 'আবার চেষ্টা করুন',
      uploadQrBtn: 'QR ছবি আপলোড',
      manualLabel: 'অথবা টেবিল নম্বর / QR কোড লিখুন',
      manualPlaceholder: 'যেমন 04 বা table-04',
      applyCodeBtn: 'যুক্ত করুন',
      verifying: 'টেবিল যাচাই হচ্ছে...',
      verifiedTitle: 'টেবিল যুক্ত হয়েছে',
      verifiedBody: 'আপনার অর্ডারটি স্বয়ংক্রিয়ভাবে {table}-এ যুক্ত হয়েছে।',
      tableIdLabel: 'টেবিল আইডি',
      invalidQr: 'সঠিক QR কোড নয়। অনুগ্রহ করে জেস্ট্রো টেবিল QR স্ক্যান করুন বা টেবিল নম্বর দিন।',
      tableNotFound: '"{id}" টেবিলটি পাওয়া যায়নি। অনুগ্রহ করে টেবিল নম্বর যাচাই করুন।',
      doneBtn: 'অর্ডার চালিয়ে যান',
      autoAssignedBadge: 'QR যুক্ত',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      menu: 'القائمة',
      offers: 'العروض',
      about: 'من نحن',
      contact: 'تواصل معنا',
      admin: 'الإدارة',
      cart: 'السلة',
      orders: 'طلباتي',
    },
    hero: {
      eyebrow: 'مقهى ومطعم عصري',
      headline: 'طعام شهي. لحظات رائعة. تجربة زيسترو التي لا تُنسى.',
      subheadline: 'من البيتزا والبرجر المميز إلى مشروبات الفرابيه واللاتيه المختص — تُحضّر طازجة لطاولتك أو باب منزلك.',
      orderNow: 'اطلب الآن',
      exploreMenu: 'استكشف القائمة',
      tableWelcome: 'مرحباً بكم في زيسترو — طاولة',
      callWaiter: 'استدعاء النادل',
      waiterCalled: 'تم إشعار النادل للطاولة',
      waiterCooldown: 'تم إرسال الطلب بالفعل. الفريق في طريقه إليك.',
    },
    sections: {
      featuredCategories: 'أقسام المطبخ والمقهى',
      featuredCategoriesSub: 'تصفح أقسام الطعام والمشروبات المختارة في زيسترو.',
      signatureEyebrow: 'أطباقنا المميزة',
      signatureTitle: 'مختارات الشيف من المطبخ',
      signatureSub: 'تشكيلة مختارة من البرجر والبيتزا والدجاج المقرمش وأطباق الأرز والساندويتشات والباستا.',
      beverageEyebrow: 'القهوة المختصة والمنعشات',
      beverageTitle: 'بار مشروبات زيسترو',
      beverageSub: 'إسبريسو متوازن، فرابيه بارد، موهيتو منعش، سموذي ومشروبات البابلز محضرة عند الطلب.',
      exploreBeverages: 'تصفح جميع المشروبات',
      popularItems: 'الأكثر طلباً',
      popularItemsSub: 'الأطباق والمشروبات المفضلة لدى ضيوفنا.',
      specialOffers: 'العروض الخاصة',
      specialOffersSub: 'أحدث العروض والباقات المتاحة من مطبخ زيسترو.',
      specialOffersEmpty: 'ترقبوا عروض زيسترو الموسمية قريباً.',
      activeOfferBadge: 'عرض فعال',
      orderOfferCta: 'اطلب الآن',
      copyPromo: 'نسخ الرمز',
      promoCopied: 'تم النسخ',
      whyChooseTitle: 'لماذا يختارنا ضيوفنا',
      whyChoosePoints: [
        {
          title: 'يُحضر عند الطلب',
          body: 'كل قطعة برجر وطبق باستا وكوب قهوة يُحضر طازجاً فور تأكيد طلبك.',
        },
        {
          title: 'مكونات مختارة بعناية',
          body: 'صلصات منزلية متوازنة وأطباق جانبية مقرمشة وحبوب قهوة مختارة.',
        },
        {
          title: 'طلب سلس من الطاولة',
          body: 'امسح رمز QR الخاص بطاولتك، وخصّص طلبك وأرسله مباشرة إلى فريقنا.',
        },
      ],
      aboutEyebrow: 'فلسفتنا',
      storyTitle: 'تجربة زيسترو',
      storyBody: 'يجمع زيسترو بين الضيافة الدافئة وأجواء المقهى الهادئة ومطبخ يقدم أطباقاً شهية مع القهوة والموكتيلات الطازجة.',
      reviewsTitle: 'آراء ضيوفنا',
      locationTitle: 'الموقع وساعات العمل',
      addressLabel: 'العنوان',
      hoursLabel: 'ساعات العمل',
      phoneLabel: 'خط الطلبات والاستفسارات',
      socialLabel: 'وسائل التواصل',
      callNow: 'اتصل بنا',
      chatWhatsapp: 'واتساب',
    },
    menu: {
      title: 'القائمة الرقمية',
      subtitle: 'تصفح جميع الأطباق والمشروبات مع خيارات التخصيص الكاملة بالتاكا (৳).',
      searchPlaceholder: 'ابحث عن برجر، بيتزا، قهوة، شيك...',
      clearSearch: 'مسح البحث',
      all: 'الكل',
      food: 'الأطعمة',
      beverages: 'المشروبات',
      popularFilter: 'الأكثر طلباً',
      quickAdd: 'إضافة سريعة',
      viewDetails: 'التفاصيل',
      soldOut: 'نفذت الكمية',
      unavailable: 'غير متوفر',
      customisable: 'قابل للتخصيص',
      noResults: 'لا توجد أصناف مطابقة لبحثك أو الفئة المختارة.',
      popularEmpty: 'لا توجد أصناف مميزة في قائمة الأكثر طلباً حالياً.',
      resetFilters: 'عرض جميع الأصناف',
      fromPrice: 'ابتداءً من',
      showingLabel: 'عرض',
      ofLabel: 'من أصل',
      itemsLabel: 'صنف',
      loadMoreBtn: 'تحميل المزيد من الأصناف',
      loadingMore: 'جاري التحميل...',
      allLoaded: 'تم عرض جميع الأصناف في هذا القسم',
      resultsFor: 'نتائج البحث عن',
      sortLabel: 'ترتيب',
      sortFeatured: 'المميزة',
      sortPriceLow: 'السعر: الأقل للأعلى',
      sortPriceHigh: 'السعر: الأعلى للأقل',
    },
    customiser: {
      selectVariant: 'اختر الحجم / الخيار',
      selectMealSides: 'اختر أي طبقين جانبيين',
      mealSidesHint: 'مشمول مع الوجبة. يرجى اختيار طبقين بالضبط.',
      sidesSelectedCount: 'تم اختيارها من ٢',
      specialInstructions: 'تعليمات خاصة',
      instructionsPlaceholder: 'ملاحظات الحساسية أو طريقة التحضير...',
      quantity: 'الكمية',
      addToCart: 'أضف إلى السلة',
      orderNow: 'اطلب الآن',
      optional: 'اختياري',
      required: 'إلزامي',
      free: 'مشمول',
    },
    cart: {
      title: 'سلة طلباتك',
      emptyTitle: 'سلتك فارغة',
      emptyBody: 'أضف أطباقاً أو مشروبات من قائمة زيسترو لبدء طلبك.',
      browseMenu: 'تصفح القائمة',
      repeatLastOrder: 'إعادة آخر طلب',
      subtotal: 'المجموع الفرعي',
      proceedCheckout: 'إتمام الطلب',
      clearCart: 'إفراغ',
      itemCount: 'أصناف',
      sidesLabel: 'الأطباق الجانبية',
      noteLabel: 'ملاحظة',
    },
    checkout: {
      title: 'إكمال الطلب',
      orderTypeLabel: 'اختر نوع الطلب',
      dineIn: 'داخل المطعم',
      dineInDesc: 'يُقدم إلى طاولتك',
      takeaway: 'استلام شخصي',
      takeawayDesc: 'استلام من الكاونتر',
      delivery: 'توصيل',
      deliveryDesc: 'توصيل إلى عنوانك',
      nameLabel: 'الاسم الكامل',
      namePlaceholder: 'أدخل اسمك',
      phoneLabel: 'رقم الهاتف (بنغلاديش)',
      phonePlaceholder: '01XXXXXXXXX أو +8801XXXXXXXXX',
      addressLabel: 'عنوان التوصيل الكامل',
      addressPlaceholder: 'رقم المنزل، الشارع، المنطقة، أقرب معلم...',
      tableLabel: 'رقم الطاولة',
      tableOptional: 'اختياري (إذا كنت جالساً)',
      tableDetected: 'تم التعرف عليه من رمز الطاولة',
      promoLabel: 'رمز الخصم',
      promoPlaceholder: 'أدخل الرمز',
      applyPromo: 'تطبيق',
      notesLabel: 'ملاحظات إضافية (اختياري)',
      notesPlaceholder: 'أي ملاحظات إضافية للتوصيل أو الخدمة',
      summaryTitle: 'ملخص الطلب',
      subtotal: 'المجموع الفرعي',
      deliveryCharge: 'رسوم التوصيل',
      serviceCharge: 'رسوم الخدمة',
      tax: 'الضريبة',
      discount: 'الخصم',
      total: 'الإجمالي',
      placeOrderBtn: 'إرسال الطلب عبر واتساب',
      submitting: 'جاري تجهيز الطلب...',
      notAccepting: 'زيسترو متوقف مؤقتاً عن استقبال الطلبات عبر الإنترنت.',
      whatsappReadyTitle: 'رسالة الطلب جاهزة في واتساب',
      whatsappReadyBody: 'رسالة طلبك جاهزة! يرجى الضغط على إرسال (SEND) في واتساب للتواصل مع زيسترو. سيتم تأكيد طلبك فور قبوله من قبل فريقنا.',
      orderRefLabel: 'مرجع الطلب',
      openWhatsappAgain: 'فتح واتساب',
      doneBtn: 'العودة إلى القائمة',
      redeem: {
        title: 'استبدال نقاط الولاء',
        rateHint: '١٠ نقاط = ৳١ · الحد الأدنى للطلب ৳٣٩٩ · بحد أقصى ٨٠٪ من النقاط لكل طلب',
        availableLabel: 'الرصيد المتاح',
        maxCapLabel: 'الحد الأقصى ٨٠٪',
        inputLabel: 'النقاط المراد استبدالها',
        inputPlaceholder: 'أدخل النقاط (مثال: 80)',
        maxBtn: 'استخدام ٨٠٪',
        clearBtn: 'مسح',
        minOrderHint: 'أضف {amount} إضافية لتفعيل استبدال النقاط (الحد الأدنى ৳٣٩٩).',
        signInHint: 'سجل الدخول أو أنشئ حساباً لاستبدال نقاط الولاء على الطلبات بقيمة ৳٣٩٩ فأكثر.',
        noPointsHint: 'لا توجد نقاط ولاء متاحة للاستبدال حالياً.',
        discountLine: 'نقاط مستبدلة ({pts} نقطة)',
        savingsPreview: 'استبدال {pts} نقطة يوفر {amount} على هذا الطلب',
        exceededError: 'تجاوز حد ٨٠٪ — يمكنك استبدال {max} نقطة كحد أقصى في هذا الطلب.',
        minOrderError: 'الحد الأدنى للطلب هو ৳٣٩٩ لاستبدال نقاط الولاء.',
        invalidNumberError: 'يرجى إدخال رقم صحيح للنقاط.',
        billLimitError: 'النقاط المدخلة تتجاوز المبلغ المتبقي للدفع (الحد الأقصى {max} نقطة).',
      },
      errors: {
        nameRequired: 'يرجى إدخال اسمك.',
        phoneInvalid: 'يرجى إدخال رقم هاتف بنغلاديشي صحيح (مثال: 017XXXXXXXX).',
        addressRequired: 'يرجى إدخال عنوان التوصيل الكامل.',
        minOrderNotMet: 'الحد الأدنى لطلب التوصيل هو',
        saveFailed: 'تعذر حفظ الطلب في الخادم، ولكن لا يزال بإمكانك إرسال طلبك عبر واتساب أدناه.',
      },
    },
    footer: {
      tagline: 'أطباق متقنة، قهوة مختصة، وضيافة دافئة.',
      rights: 'جميع الحقوق محفوظة.',
      whatsappOrderLine: 'خط الطلبات عبر واتساب',
    },
    history: {
      title: 'سجل طلباتك',
      subtitle: 'تابع حالة طلبك مباشرة وأعد طلب أطباقك المفضلة بضغطة واحدة.',
      liveStatusHint: 'الحالة متزامنة مباشرة مع مطبخ زيسترو',
      emptyTitle: 'لا توجد طلبات سابقة بعد',
      emptyBody: 'بمجرد إرسال طلب في زيسترو، سيظهر هنا مع تحديثات الحالة المباشرة وإعادة الطلب.',
      browseMenu: 'تصفح القائمة',
      reorderBtn: 'إعادة الطلب',
      reopenWhatsapp: 'فتح واتساب',
      allOrdersTab: 'جميع الطلبات',
      activeOrdersTab: 'الطلبات النشطة',
      searchPlaceholder: 'ابحث برقم الطلب أو الصنف أو الطاولة...',
      noActiveTitle: 'لا توجد طلبات نشطة حالياً',
      noActiveBody: 'جميع طلباتك السابقة إما مكتملة أو ملغاة.',
      viewAllOrdersBtn: 'عرض جميع الطلبات',
      noSearchResults: 'لا توجد طلبات تطابق "{query}".',
      clearSearchBtn: 'مسح البحث',
      itemsLabel: 'أصناف',
      tableLabel: 'طاولة',
      unavailableSkipped: 'أصناف غير متوفرة حالياً تم تخطيها.',
      allUnavailable: 'الأصناف في هذا الطلب غير متوفرة حالياً.',
      reorderedSuccess: 'تمت إضافة الأصناف إلى سلتك',
      orderReadyTitle: 'طلبك جاهز!',
      orderReadyBody: 'طلبك {ref} تم تحضيره للتو وهو جاهز الآن.',
      viewOrder: 'عرض الطلب',
      statuses: {
        awaiting_whatsapp_confirmation: 'بانتظار واتساب',
        confirmed: 'تم التأكيد',
        preparing: 'قيد التحضير',
        ready: 'جاهز',
        completed: 'مكتمل',
        cancelled: 'ملغي',
      },
    },
    account: {
      signUpBtn: 'إنشاء حساب',
      myAccountBtn: 'حسابي',
      signUpTab: 'حساب جديد',
      signInTab: 'تسجيل الدخول',
      signUpTitle: 'انضم إلى زيسترو',
      signUpSubtitle: 'احفظ بيانات التوصيل وتابع حالة طلباتك مباشرة من المطبخ في أي وقت.',
      signInTitle: 'مرحباً بعودتك إلى زيسترو',
      signInSubtitle: 'سجل الدخول لعرض ملفك الشخصي وطلباتك الحالية وتفاصيل فواتيرك السابقة.',
      continueGoogle: 'المتابعة عبر جوجل',
      orWithEmail: 'أو عبر البريد الإلكتروني',
      fullName: 'الاسم الكامل',
      fullNamePlaceholder: 'أدخل اسمك الكامل',
      phone: 'رقم الهاتف (اختياري)',
      phonePlaceholder: '01XXXXXXXXX',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'you@example.com',
      password: 'كلمة المرور',
      passwordPlaceholder: '٦ أحرف على الأقل',
      defaultAddress: 'عنوان التوصيل الافتراضي (اختياري)',
      defaultAddressPlaceholder: 'رقم المنزل، الشارع، المنطقة...',
      preferredOrderType: 'طريقة الطلب المفضلة',
      createAccountBtn: 'إنشاء حساب عميل',
      signInSubmitBtn: 'تسجيل الدخول',
      creatingAccount: 'جاري إنشاء الحساب...',
      signingIn: 'جاري تسجيل الدخول...',
      signOutBtn: 'تسجيل الخروج',
      welcomeBack: 'تم تسجيل الدخول إلى حساب زيسترو الخاص بك',
      accountCreated: 'مرحباً بك في زيسترو! تم إضافة ١٠٠ نقطة ترحيبية إلى حسابك.',
      signedOutToast: 'تم تسجيل الخروج بنجاح.',
      profileSaved: 'تم حفظ بيانات الملف الشخصي.',
      profileTab: 'ملفي الشخصي',
      ordersTab: 'طلباتي',
      memberBadge: 'عضو زيسترو',
      totalOrdersStat: 'إجمالي الطلبات',
      totalSpentStat: 'إجمالي الطلبات المالية',
      completeProfileBanner: 'أضف رقم هاتفك وعنوانك الافتراضي لإتمام الطلب بضغطة واحدة.',
      saveProfileBtn: 'حفظ الملف الشخصي',
      savingProfile: 'جاري الحفظ...',
      viewDetailsBtn: 'تفاصيل الطلب',
      hideDetailsBtn: 'إخفاء التفاصيل',
      orderDetailsTitle: 'تفاصيل الفاتورة الكاملة',
      deliveryDetailsLabel: 'بيانات التواصل والاستلام',
      kitchenNoteLabel: 'تحديث المطبخ',
      customerNoteLabel: 'ملاحظتك',
      promoAppliedLabel: 'الخصم المستخدم',
      signedInCheckoutHint: 'تمت تعبئة البيانات تلقائياً من حسابك · سيتم حفظ هذا الطلب في سجل حسابك.',
      guestCheckoutAccountHint: 'هل تريد تتبع طلباتك من أي جهاز؟ أنشئ حساباً أو سجل الدخول الآن.',
      signInForProfileBtn: 'إنشاء حساب / دخول',
      emailDisabledNotice: 'تسجيل الدخول بالبريد الإلكتروني غير مفعّل حالياً في Firebase Console. استخدم زر جوجل أعلاه للدخول الفوري.',
      forgotPassword: 'نسيت كلمة المرور؟',
      resetTitle: 'استعادة كلمة المرور',
      resetSubtitle: 'أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً آمناً لإعادة تعيين كلمة المرور.',
      sendResetBtn: 'إرسال رابط الاستعادة',
      sendingReset: 'جاري الإرسال...',
      resetSentTitle: 'تم إرسال الرابط',
      resetSentBody: 'تحقق من صندوق الوارد في {email} لإكمال تعيين كلمة مرور جديدة.',
      backToSignIn: 'العودة لتسجيل الدخول',
      errors: {
        nameRequired: 'يرجى إدخال اسمك الكامل.',
        phoneInvalid: 'يرجى إدخال رقم هاتف صحيح (٧ إلى ١٦ رقماً).',
        emailInvalid: 'يرجى إدخال بريد إلكتروني صحيح.',
        passwordMin: 'يجب أن تتكون كلمة المرور من ٦ أحرف على الأقل.',
        popupBlocked: 'تم إغلاق نافذة تسجيل الدخول أو حظرها. يرجى المحاولة مرة أخرى.',
        genericAuth: 'تعذر تسجيل الدخول حالياً. يرجى التحقق من البيانات والمحاولة مرة أخرى.',
      },
      loyalty: {
        balanceLabel: 'رصيد نقاط الولاء المتاح',
        pointsUnit: 'نقطة',
        earnRateHint: 'اكسب نقطة واحدة مقابل كل ١٠ ৳ بعد اكتمال الطلب',
        pointsToNextTier: '{pts} نقطة للوصول إلى {tier}',
        maxTierReached: 'تم الوصول لأعلى مستوى',
        completedLabel: 'الطلبات',
        inProgressLabel: 'قيد الانتظار',
        welcomeBonusLabel: 'ترحيبية',
        adminBonusLabel: 'مكافأة الإدارة',
        redeemedLabel: 'مستبدلة',
        redeemedOnOrder: 'استبدال {pts} نقطة',
        pendingNote: 'تُضاف نقاط الطلب بعد توصيله واكتماله. الطلبات الملغاة لا تمنح نقاطاً.',
        earnedFromOrder: '+{pts} نقطة',
        pendingFromOrder: '+{pts} نقطة معلقة',
        cancelledFromOrder: '٠ نقطة (ملغي)',
        welcomeSignupBanner: 'سجّل الآن واحصل على ١٠٠ نقطة ولاء ترحيبية.',
        tiers: {
          bronze: 'البرونزي',
          silver: 'الفضي',
          gold: 'الذهبي',
        },
      },
    },
    qrScanner: {
      scanTableBtn: 'مسح QR الطاولة',
      switchTableBtn: 'تغيير الطاولة',
      clearTableBtn: 'إزالة',
      title: 'مسح رمز QR للطاولة',
      subtitle: 'وجّه الكاميرا نحو رمز QR الموجود على طاولتك لربط طلبك تلقائياً.',
      startingCamera: 'جاري تشغيل الكاميرا...',
      cameraLiveHint: 'ضع رمز QR الخاص بالطاولة داخل الإطار',
      cameraDenied: 'تم رفض إذن الكاميرا أو حظره. يمكنك رفع صورة الرمز أو إدخال رقم الطاولة أدناه.',
      cameraUnavailable: 'الكاميرا المباشرة غير متاحة هنا. ارفع صورة رمز QR أو أدخل رقم الطاولة أدناه.',
      retryCameraBtn: 'إعادة المحاولة',
      uploadQrBtn: 'رفع صورة QR',
      manualLabel: 'أو أدخل رقم الطاولة / رمز QR',
      manualPlaceholder: 'مثال: 04 أو table-04',
      applyCodeBtn: 'ربط الطاولة',
      verifying: 'جاري التحقق من الطاولة...',
      verifiedTitle: 'تم ربط الطاولة',
      verifiedBody: 'تم تعيين طلباتك القادمة تلقائياً إلى {table}.',
      tableIdLabel: 'معرّف الطاولة',
      invalidQr: 'رمز QR غير معروف. يرجى مسح رمز طاولة زيسترو أو إدخال رقم طاولة صحيح.',
      tableNotFound: 'لم يتم العثور على الطاولة "{id}". يرجى التأكد من الرقم.',
      doneBtn: 'المتابعة للطلب',
      autoAssignedBadge: 'مرتبط بـ QR',
    },
  },
};

export function getLocalized(
  text: { en: string; bn: string; ar: string } | undefined,
  lang: Language
): string {
  if (!text) return '';
  return text[lang] || text.en || text.bn || text.ar || '';
}
