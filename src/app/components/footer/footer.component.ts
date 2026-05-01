import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-text text-white" aria-label="Footer">
      <!-- Newsletter strip -->
      <div class="bg-gradient-luxury py-14">
        <div class="container-luxe text-center">
          <h3 class="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
            Get Early Access & Exclusive Deals
          </h3>
          <p class="text-white/75 mb-7 max-w-md mx-auto">
            Join our community. Be the first to know about new arrivals, flash sales and style tips.
          </p>
          <form
            class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            (submit)="onSubscribe($event)"
          >
            <input
              type="email"
              placeholder="Your email address"
              class="input bg-white/10 border-white/20 text-white placeholder-white/50 flex-1
                focus:border-white focus:ring-white/20"
              aria-label="Email for newsletter"
              autocomplete="email"
            />
            <button type="submit" class="btn bg-white text-primary hover:bg-white/90 flex-none px-8">
              Subscribe
            </button>
          </form>
          <p class="text-white/50 text-xs mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </div>

      <!-- Main footer -->
      <div class="py-16">
        <div class="container-luxe">
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">

            <!-- Brand -->
            <div class="col-span-2 lg:col-span-2">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-9 h-9 rounded-full bg-gradient-luxury flex items-center justify-center">
                  <span class="text-white font-bold font-heading">L</span>
                </div>
                <span class="font-heading font-bold text-xl text-white">Luxe Storefront</span>
              </div>
              <p class="text-white/60 text-sm leading-relaxed max-w-xs mb-6">
                Premium fashion, bags and accessories. Crafted with care, curated for you.
                Shipped across India.
              </p>
              <!-- Social links -->
              <div class="flex gap-3">
                @for (social of socialLinks; track social.name) {
                  <a
                    [href]="social.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center
                      hover:bg-white/20 transition-colors"
                    [attr.aria-label]="social.name"
                  >
                    <span class="text-lg">{{ social.emoji }}</span>
                  </a>
                }
              </div>
            </div>

            <!-- Shop -->
            <div>
              <h4 class="font-semibold text-white text-sm uppercase tracking-widest mb-5">Shop</h4>
              <ul class="space-y-3">
                @for (link of shopLinks; track link.label) {
                  <li>
                    <a [href]="link.href"
                      class="text-white/60 text-sm hover:text-white transition-colors">
                      {{ link.label }}
                    </a>
                  </li>
                }
              </ul>
            </div>

            <!-- Help -->
            <div>
              <h4 class="font-semibold text-white text-sm uppercase tracking-widest mb-5">Help</h4>
              <ul class="space-y-3">
                @for (link of helpLinks; track link.label) {
                  <li>
                    <a [href]="link.href"
                      class="text-white/60 text-sm hover:text-white transition-colors">
                      {{ link.label }}
                    </a>
                  </li>
                }
              </ul>
            </div>

            <!-- Contact -->
            <div>
              <h4 class="font-semibold text-white text-sm uppercase tracking-widest mb-5">Contact</h4>
              <ul class="space-y-3">
                @for (item of contactItems; track item.label) {
                  <li>
                    <a [href]="item.href" target="_blank" rel="noopener noreferrer"
                      class="flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors">
                      <span>{{ item.emoji }}</span>
                      <span>{{ item.label }}</span>
                    </a>
                  </li>
                }
              </ul>
            </div>
          </div>

          <!-- Trust badges row -->
          <div class="mt-14 pt-10 border-t border-white/10
            grid grid-cols-2 md:grid-cols-4 gap-6">
            @for (badge of trustBadges; track badge.title) {
              <div class="flex items-center gap-3">
                <span class="text-2xl">{{ badge.emoji }}</span>
                <div>
                  <p class="text-white text-sm font-semibold">{{ badge.title }}</p>
                  <p class="text-white/50 text-xs">{{ badge.subtitle }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-white/10 py-6">
        <div class="container-luxe flex flex-col sm:flex-row items-center justify-between
          gap-3 text-white/40 text-xs">
          <p>© 2026 Luxe Storefront. All rights reserved.</p>
          <div class="flex items-center gap-4">
            @for (link of legalLinks; track link.label) {
              <a [href]="link.href"
                class="hover:text-white transition-colors">
                {{ link.label }}
              </a>
            }
          </div>
          <div class="flex items-center gap-2">
            <span>Payment:</span>
            @for (pm of paymentMethods; track pm) {
              <span class="px-1.5 py-0.5 bg-white/10 rounded text-white/60 text-[10px] font-medium uppercase">
                {{ pm }}
              </span>
            }
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly socialLinks = [
    { name: 'Instagram', emoji: '📸', href: '#' },
    { name: 'WhatsApp', emoji: '💬', href: 'https://wa.me/919876543210' },
    { name: 'Facebook', emoji: '👤', href: '#' },
    { name: 'Pinterest', emoji: '📌', href: '#' },
  ];

  readonly shopLinks = [
    { label: 'New Arrivals', href: '#catalog' },
    { label: 'Bags',         href: '#catalog' },
    { label: 'Clothing',     href: '#catalog' },
    { label: 'Accessories',  href: '#catalog' },
    { label: 'Shoes',        href: '#catalog' },
    { label: 'Sale',         href: '#catalog' },
  ];

  readonly helpLinks = [
    { label: 'FAQs',             href: '#' },
    { label: 'Shipping Policy',  href: '#' },
    { label: 'Return & Refund',  href: '#' },
    { label: 'Size Guide',       href: '#' },
    { label: 'Track My Order',   href: '#' },
  ];

  readonly contactItems = [
    { emoji: '💬', label: 'WhatsApp Us', href: 'https://wa.me/919876543210' },
    { emoji: '✉️', label: 'hello@luxe.com', href: 'mailto:hello@luxe.com' },
    { emoji: '📸', label: '@luxe.store', href: '#' },
  ];

  readonly trustBadges = [
    { emoji: '🔒', title: 'Secure Payments', subtitle: 'SSL encrypted checkout' },
    { emoji: '🚚', title: 'Fast Delivery',    subtitle: 'Pan-India shipping' },
    { emoji: '↩️', title: 'Easy Returns',    subtitle: '7-day return policy' },
    { emoji: '💎', title: 'Authentic',         subtitle: '100% genuine products' },
  ];

  readonly legalLinks = [
    { label: 'Privacy Policy',     href: '#' },
    { label: 'Terms of Service',   href: '#' },
    { label: 'Cookie Policy',      href: '#' },
  ];

  readonly paymentMethods = ['UPI', 'Cards', 'Net Banking', 'COD'];

  onSubscribe(event: Event): void {
    event.preventDefault();
    // Integrate with email service (Mailchimp, Klaviyo, etc.)
  }
}
