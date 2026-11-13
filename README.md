# Zestro Customer Website — Clean Start

This package contains the customer-facing React + Vite website only.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the local URL printed by Vite.

## Current clean-start scope

- Firebase SDK, Firebase Authentication, Firestore, Firebase Admin, and Firebase configuration have been removed.
- Admin dashboard and admin authentication are not included.
- Menu/catalogue content is loaded from `src/data/initialMenu.ts`.
- Cart and basic preferences use browser local storage.
- Customer accounts, cloud order history, live order status, and persistent waiter-call delivery are disabled pending the new backend.
- Checkout/order submission endpoints are not active in this static-only build.

## Deployment direction

The intended hosting direction is Cloudflare Pages for the customer website. A later phase can add Cloudflare Workers, D1, and R2 for order processing, menu management, waiter calls, and the separate admin application.

Do not treat local browser storage as a production order database.
