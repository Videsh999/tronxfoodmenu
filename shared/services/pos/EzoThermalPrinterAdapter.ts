import type { Order } from '../../types/order';
import type { IPosPrinterAdapter, PosPrinterStatus, PrintReceiptResult } from './IPosPrinterAdapter';

function formatCurrency(amt: number): string {
  return `Rs. ${Number(amt || 0).toFixed(2)}`;
}

export class EzoThermalPrinterAdapter implements IPosPrinterAdapter {
  private bridgeUrl: string | null = null;
  private apiKey: string | null = null;
  private deviceName: string = 'EZO-80mm-BT';

  constructor(bridgeUrl?: string, apiKey?: string) {
    this.bridgeUrl = bridgeUrl || null;
    this.apiKey = apiKey || null;
  }

  async getStatus(): Promise<PosPrinterStatus> {
    if (!this.bridgeUrl || !this.apiKey) {
      return {
        isConfigured: false,
        deviceType: 'EZO_THERMAL_ESC_POS',
        connectionState: 'READY_FOR_CREDENTIALS',
        deviceName: this.deviceName,
        error: 'EZO hardware bridge URL or local agent credentials not configured in environment.',
      };
    }

    try {
      const res = await fetch(`${this.bridgeUrl}/status`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
      });
      if (res.ok) {
        return {
          isConfigured: true,
          deviceType: 'EZO_THERMAL_ESC_POS',
          connectionState: 'CONNECTED',
          deviceName: this.deviceName,
        };
      }
      return {
        isConfigured: true,
        deviceType: 'EZO_THERMAL_ESC_POS',
        connectionState: 'DISCONNECTED',
        deviceName: this.deviceName,
        error: `Bridge returned status ${res.status}`,
      };
    } catch (err: any) {
      return {
        isConfigured: true,
        deviceType: 'EZO_THERMAL_ESC_POS',
        connectionState: 'DISCONNECTED',
        deviceName: this.deviceName,
        error: err?.message || 'Failed to connect to EZO hardware bridge.',
      };
    }
  }

  formatThermalReceipt(order: Order): string {
    const invNumber = `INV-${order.orderNumber.replace('#', '')}`;
    const dateStr = new Date(order.createdAt).toLocaleString([], {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    const divider = '----------------------------------------';
    const lines: string[] = [];

    lines.push('              TRONX RESTAURANT           ');
    lines.push('       Good Food Brighter Moods          ');
    lines.push('      GSTIN: 29AABCC1234F1Z8             ');
    lines.push(divider);
    lines.push(`Receipt: ${invNumber}`);
    lines.push(`Date:    ${dateStr}`);
    lines.push(`Mode:    ${order.orderType}${order.tableNumber ? ` (Table: ${order.tableNumber})` : ''}`);
    lines.push(`Payment: ${order.paymentStatus} (${order.paymentReference || 'N/A'})`);
    lines.push(divider);
    lines.push('ITEM                      QTY    AMOUNT');
    lines.push(divider);

    for (const item of order.items) {
      const name = item.dishName.padEnd(24, ' ').substring(0, 24);
      const qty = String(item.quantity).padStart(3, ' ');
      const amt = formatCurrency(item.itemSubtotal).padStart(11, ' ');
      lines.push(`${name} ${qty} ${amt}`);
      if (item.selectedModifiers && item.selectedModifiers.length > 0) {
        for (const m of item.selectedModifiers) {
          lines.push(`  + ${m.optionName}`);
        }
      }
    }

    lines.push(divider);
    lines.push(`Subtotal:                 ${formatCurrency(order.subtotal).padStart(14, ' ')}`);
    lines.push(`Tax (GST 5%):             ${formatCurrency(order.taxAmount).padStart(14, ' ')}`);
    if (order.deliveryFee > 0) {
      lines.push(`Delivery:                 ${formatCurrency(order.deliveryFee).padStart(14, ' ')}`);
    }
    if (order.tipAmount > 0) {
      lines.push(`Gratuity:                 ${formatCurrency(order.tipAmount).padStart(14, ' ')}`);
    }
    lines.push(divider);
    lines.push(`TOTAL PAYABLE:            ${formatCurrency(order.totalAmount).padStart(14, ' ')}`);
    lines.push(divider);
    lines.push('     Thank you for dining with us!       ');
    lines.push('        Please visit us again.           ');
    lines.push('\n\n\n'); // ESC/POS cut feed

    return lines.join('\n');
  }

  async printOrderReceipt(order: Order): Promise<PrintReceiptResult> {
    const receiptText = this.formatThermalReceipt(order);
    const receiptReference = `INV-${order.orderNumber.replace('#', '')}`;

    if (!this.bridgeUrl || !this.apiKey) {
      return {
        success: false,
        receiptReference,
        error: 'EZO printer adapter is in READY_FOR_CREDENTIALS state. Hardware bridge credentials required for physical 80mm printout.',
      };
    }

    try {
      const res = await fetch(`${this.bridgeUrl}/print`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          printer: this.deviceName,
          rawText: receiptText,
          orderId: order.id,
          receiptReference,
        }),
      });

      if (!res.ok) {
        throw new Error(`Print server responded with ${res.status}`);
      }

      return {
        success: true,
        receiptReference,
      };
    } catch (err: any) {
      return {
        success: false,
        receiptReference,
        error: err?.message || 'Error communicating with EZO local bridge.',
      };
    }
  }
}
