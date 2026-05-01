import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="contact" class="py-20 md:py-28 bg-secondary" aria-labelledby="contact-heading">
      <div class="container-luxe">

        <div class="grid lg:grid-cols-2 gap-12 lg:gap-20">

          <!-- Left: contact info -->
          <div>
            <span class="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
              Get in Touch
            </span>
            <h2 id="contact-heading" class="section-title mb-6">
              We'd Love to Hear From You
            </h2>
            <div class="divider mb-8"></div>
            <p class="section-subtitle mb-10">
              Have a question? Want to place a bulk order? Or just want to say hi?
              We're available on WhatsApp for the fastest response.
            </p>

            <!-- Contact methods -->
            <div class="space-y-5">
              @for (method of contactMethods; track method.label) {
                <a
                  [href]="method.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-4 p-4 rounded-xl bg-white
                    shadow-card hover:shadow-card-hover transition-all group"
                >
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-none"
                    [style.background]="method.bgColor">
                    {{ method.emoji }}
                  </div>
                  <div>
                    <p class="text-xs text-text-muted uppercase tracking-widest font-semibold mb-0.5">
                      {{ method.type }}
                    </p>
                    <p class="font-medium text-text group-hover:text-primary transition-colors">
                      {{ method.label }}
                    </p>
                  </div>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="ml-auto text-text-muted group-hover:text-primary group-hover:translate-x-1
                    transition-all" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              }
            </div>

            <!-- Working hours -->
            <div class="mt-8 p-5 rounded-xl bg-primary/5 border border-primary/10">
              <h4 class="font-semibold text-text mb-3">Business Hours</h4>
              <div class="space-y-1.5 text-sm text-text-muted">
                <div class="flex justify-between">
                  <span>Monday – Saturday</span>
                  <span class="font-medium text-text">9:00 AM – 7:00 PM IST</span>
                </div>
                <div class="flex justify-between">
                  <span>Sunday</span>
                  <span class="font-medium text-text">10:00 AM – 4:00 PM IST</span>
                </div>
              </div>
              <p class="text-xs text-primary font-medium mt-3">
                ✅ WhatsApp responses within 30 minutes during business hours
              </p>
            </div>
          </div>

          <!-- Right: contact form -->
          <div>
            <div class="bg-white rounded-2xl shadow-card p-8">
              <h3 class="font-heading font-semibold text-xl mb-6">Send a Message</h3>

              @if (submitted()) {
                <div class="flex flex-col items-center justify-center py-12 text-center animate-scale-in">
                  <div class="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mb-4">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      class="text-success" stroke-width="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h4 class="font-heading font-semibold text-xl mb-2">Message Sent!</h4>
                  <p class="text-text-muted text-sm mb-6">
                    We'll get back to you within 30 minutes during business hours.
                  </p>
                  <button class="btn btn-primary" (click)="submitted.set(false)">
                    Send Another Message
                  </button>
                </div>
              } @else {
                <form class="space-y-5" (submit)="onSubmit($event)" novalidate>
                  <!-- Name -->
                  <div>
                    <label for="contact-name" class="block text-sm font-medium text-text mb-1.5">
                      Full Name <span class="text-error">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      class="input"
                      placeholder="Priya Sharma"
                      [(ngModel)]="form.name"
                      name="name"
                      required
                      autocomplete="name"
                    />
                  </div>

                  <!-- Email -->
                  <div>
                    <label for="contact-email" class="block text-sm font-medium text-text mb-1.5">
                      Email Address <span class="text-error">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      class="input"
                      placeholder="priya@example.com"
                      [(ngModel)]="form.email"
                      name="email"
                      required
                      autocomplete="email"
                    />
                  </div>

                  <!-- Phone -->
                  <div>
                    <label for="contact-phone" class="block text-sm font-medium text-text mb-1.5">
                      Phone / WhatsApp
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      class="input"
                      placeholder="+91 98765 43210"
                      [(ngModel)]="form.phone"
                      name="phone"
                      autocomplete="tel"
                    />
                  </div>

                  <!-- Subject -->
                  <div>
                    <label for="contact-subject" class="block text-sm font-medium text-text mb-1.5">
                      Subject
                    </label>
                    <select
                      id="contact-subject"
                      class="input"
                      [(ngModel)]="form.subject"
                      name="subject"
                    >
                      <option value="">Select a topic...</option>
                      <option value="order">Place / Track an Order</option>
                      <option value="return">Returns & Exchanges</option>
                      <option value="bulk">Bulk / Wholesale Order</option>
                      <option value="product">Product Query</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <!-- Message -->
                  <div>
                    <label for="contact-message" class="block text-sm font-medium text-text mb-1.5">
                      Message <span class="text-error">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows="4"
                      class="input resize-none"
                      placeholder="How can we help you?"
                      [(ngModel)]="form.message"
                      name="message"
                      required
                      maxlength="1000"
                    ></textarea>
                    <p class="text-xs text-text-muted text-right mt-1">
                      {{ form.message.length }}/1000
                    </p>
                  </div>

                  <!-- Submit -->
                  <div class="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="submit"
                      class="btn btn-primary flex-1 py-3.5"
                      [disabled]="submitting()"
                    >
                      @if (submitting()) {
                        <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                        Sending…
                      } @else {
                        Send Message
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                      }
                    </button>
                    <a
                      href="https://wa.me/919876543210?text=Hi! I have a question."
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn btn-whatsapp flex-1 py-3.5 justify-center"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                  </div>
                </form>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ContactComponent {
  submitted  = signal(false);
  submitting = signal(false);

  form = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  };

  readonly contactMethods = [
    {
      type: 'WhatsApp',
      label: '+91 98765 43210',
      emoji: '💬',
      bgColor: 'rgba(37,211,102,0.15)',
      href: 'https://wa.me/919876543210?text=Hi! I have a question.',
    },
    {
      type: 'Email',
      label: 'hello@luxestorefront.com',
      emoji: '✉️',
      bgColor: 'rgba(15,118,110,0.1)',
      href: 'mailto:hello@luxestorefront.com',
    },
    {
      type: 'Instagram',
      label: '@luxe.storefront',
      emoji: '📸',
      bgColor: 'rgba(245,158,11,0.1)',
      href: 'https://instagram.com',
    },
  ];

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    // Basic validation
    if (!this.form.name.trim() || !this.form.email.trim() || !this.form.message.trim()) {
      return;
    }

    this.submitting.set(true);

    // Simulate submission (integrate with your backend / email service)
    await new Promise<void>((resolve) => setTimeout(resolve, 1200));

    this.submitted.set(true);
    this.submitting.set(false);
    this.form = { name: '', email: '', phone: '', subject: '', message: '' };
  }
}
