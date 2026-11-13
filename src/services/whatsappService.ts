import { Order } from '../types';

export const DEFAULT_WHATSAPP_NUMBER = '+8801601987672';

export function normalizeWhatsappDigits(raw: string | undefined): string {
  const digits = (raw || DEFAULT_WHATSAPP_NUMBER).replace(/[^\d]/g, '');
  if (!digits) return '8801601987672';
  if (digits.startsWith('01')) return `88${digits}`;
  return digits;
}

export function formatOrderTypeLabel(type: Order['orderType']): string {
  if (type === 'dine_in') return 'DINE IN';
  if (type === 'takeaway') return 'TAKEAWAY';
  return 'DELIVERY';
}

export function buildWhatsappMessage(order: {
  orderRef: string;
  orderType: Order['orderType'];
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  tableNumber?: string;
  notes?: string;
  items: Order['items'];
  subtotal: number;
  deliveryFee: number;
  serviceCharge: number;
  taxAmount: number;
  discountAmount: number;
  redeemedPoints?: number;
  loyaltyDiscountAmount?: number;
  total: number;
}): string {
  const lines: string[] = [
    'Hello Zestro! I would like to place an order.',
    '',
    `ORDER REFERENCE: ${order.orderRef}`,
    `ORDER TYPE: ${formatOrderTypeLabel(order.orderType)}`,
    '',
    'CUSTOMER DETAILS:',
    `Name: ${order.customerName}`,
    `Phone: ${order.customerPhone}`,
  ];

  if (order.orderType === 'delivery' && order.deliveryAddress) {
    lines.push(`Address: ${order.deliveryAddress}`);
  }
  if (order.tableNumber) {
    lines.push(`Table Number: ${order.tableNumber}`);
  }
  if (order.notes) {
    lines.push(`Order Notes: ${order.notes}`);
  }

  lines.push('', 'ORDER DETAILS:');

  order.items.forEach((item, index) => {
    lines.push('', `${index + 1}. ${item.name}`);
    if (item.variantLabel) {
      lines.push(`   Variant / Size: ${item.variantLabel}`);
    }
    if (item.selectedSides && item.selectedSides.length > 0) {
      lines.push(`   Meal Sides: ${item.selectedSides.join(', ')}`);
    }
    if (item.customisations && item.customisations.length > 0) {
      const custText = item.customisations
        .map((c) => (c.price > 0 ? `${c.optionName} (+৳${c.price})` : c.optionName))
        .join(', ');
      lines.push(`   Customisations: ${custText}`);
    }
    if (item.specialInstructions) {
      lines.push(`   Special Instructions: ${item.specialInstructions}`);
    }
    lines.push(`   Quantity: ${item.quantity}`);
    lines.push(`   Unit Price: ৳${item.unitPrice}`);
    lines.push(`   Total: ৳${item.lineTotal}`);
  });

  const otherCharges = (order.serviceCharge || 0) + (order.taxAmount || 0);

  lines.push(
    '',
    `Subtotal: ৳${order.subtotal}`,
    `Delivery Charge: ৳${order.deliveryFee || 0}`,
    `Other Charges: ৳${otherCharges}`,
    `Discount: ৳${order.discountAmount || 0}`
  );
  if (order.redeemedPoints && order.redeemedPoints > 0) {
    lines.push(
      `Loyalty Points Redeemed: ${order.redeemedPoints} pts (-৳${order.loyaltyDiscountAmount || 0})`
    );
  }
  lines.push(`TOTAL: ৳${order.total}`, '', 'Thank you!');

  return lines.join('\n');
}

export function buildWhatsappUrl(
  whatsappNumber: string | undefined,
  message: string
): string {
  const digits = normalizeWhatsappDigits(whatsappNumber);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function openWhatsappHandoff(url: string): boolean {
  try {
    const newWin = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWin) return true;
    // Fallback link click
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  } catch {
    return false;
  }
}
