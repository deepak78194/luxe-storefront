import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface WhatsAppOrderPayload {
  productName: string;
  price?: number;
  currency?: string;
  size?: string;
  color?: string;
  quantity?: number;
  productUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class WhatsAppService {
  private readonly phone = environment.whatsappPhone;
  private readonly baseUrl = 'https://wa.me';

  /**
   * Opens WhatsApp with a pre-filled order message.
   * Sanitizes all inputs to prevent injection in URL.
   */
  openOrder(payload: WhatsAppOrderPayload): void {
    const text = this.buildOrderMessage(payload);
    const url = `${this.baseUrl}/${encodeURIComponent(this.phone)}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Returns the WhatsApp URL without opening it (for use in templates).
   */
  getOrderUrl(payload: WhatsAppOrderPayload): string {
    const text = this.buildOrderMessage(payload);
    return `${this.baseUrl}/${encodeURIComponent(this.phone)}?text=${encodeURIComponent(text)}`;
  }

  openGeneralInquiry(message: string): void {
    // Sanitize to plain text only
    const clean = message.replace(/[<>]/g, '').substring(0, 500);
    const url = `${this.baseUrl}/${encodeURIComponent(this.phone)}?text=${encodeURIComponent(clean)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  private buildOrderMessage(payload: WhatsAppOrderPayload): string {
    const name = payload.productName.replace(/[<>]/g, '').substring(0, 200);
    let text = `Hi! I want to order: *${name}*`;

    if (payload.price !== undefined && payload.currency) {
      text += `\nPrice: ${payload.currency} ${payload.price.toFixed(2)}`;
    }
    if (payload.size) text += `\nSize: ${payload.size.replace(/[<>]/g, '')}`;
    if (payload.color) text += `\nColor: ${payload.color.replace(/[<>]/g, '')}`;
    if (payload.quantity) text += `\nQuantity: ${payload.quantity}`;
    text += '\n\nPlease confirm availability. Thank you!';

    return text;
  }
}
