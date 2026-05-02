import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SanityService } from '../../core/services/sanity.service';
import { Testimonial } from '../../core/models/testimonial.model';
import { environment } from '../../../environments/environment';

const DEMO_TESTIMONIALS: Testimonial[] = [
  {
    id: '1', name: 'Priya Sharma', handle: '@priyastyle',
    avatar: 'https://i.pravatar.cc/80?img=1',
    rating: 5, verified: true,
    text: 'The Tote Bag is everything I dreamed of. The leather is buttery soft and the quality is absolutely top-notch. I get compliments everywhere I go!',
    product: 'The Tote Bag — Sand',
    date: 'March 2026',
  },
  {
    id: '2', name: 'Ananya Mehta', handle: '@ananya.wears',
    avatar: 'https://i.pravatar.cc/80?img=2',
    rating: 5, verified: true,
    text: 'Ordered the Midi Slip Dress for a wedding — it was an absolute showstopper. The silk is gorgeous and the fit is perfect. Will order again!',
    product: 'Midi Slip Dress — Ivory',
    date: 'February 2026',
  },
  {
    id: '3', name: 'Riya Kapoor', handle: '@riyakapoor_life',
    avatar: 'https://i.pravatar.cc/80?img=3',
    rating: 5, verified: true,
    text: 'Incredible quality for the price. The Mini Crossbody feels luxurious — definitely rivals designer bags costing 10x more. Fast WhatsApp ordering too!',
    product: 'Mini Crossbody — Black',
    date: 'January 2026',
  },
  {
    id: '4', name: 'Sneha Reddy', handle: '@snehafashion',
    avatar: 'https://i.pravatar.cc/80?img=4',
    rating: 4, verified: true,
    text: 'The Linen Blazer is my go-to for work. Super versatile and the camel color goes with literally everything. Packaging was beautiful too — felt like a gift.',
    product: 'Linen Blazer — Camel',
    date: 'April 2026',
  },
  {
    id: '5', name: 'Meera Nair', handle: '@meera.luxe',
    avatar: 'https://i.pravatar.cc/80?img=5',
    rating: 5, verified: true,
    text: 'The Silk Scarf is stunning — the print quality is amazing and the material is so smooth. Ordered via WhatsApp and received delivery the next day. 10/10!',
    product: 'Silk Scarf — Floral',
    date: 'March 2026',
  },
];

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="testimonials" class="py-20 md:py-28 bg-white overflow-hidden"
      aria-labelledby="testimonials-heading">
      <div class="container-luxe">

        <!-- Header -->
        <div class="text-center mb-14">
          <span class="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">
            Customer Love
          </span>
          <h2 id="testimonials-heading" class="section-title mb-4">
            What Our Customers Say
          </h2>
          <div class="divider mx-auto mb-6"></div>
          <p class="section-subtitle mx-auto text-center">
            Thousands of happy customers. Real reviews, real people.
          </p>
        </div>

        <!-- Average rating banner -->
        <div class="flex items-center justify-center gap-8 mb-12 py-6
          rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5">
          <div class="text-center">
            <p class="font-heading font-bold text-5xl text-primary">4.9</p>
            <div class="stars justify-center flex gap-0.5 mt-1">
              @for (i of [1,2,3,4,5]; track i) {
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
                  class="text-accent">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              }
            </div>
            <p class="text-xs text-text-muted mt-1">Average Rating</p>
          </div>
          <div class="w-px h-16 bg-border"></div>
          <div class="text-center">
            <p class="font-heading font-bold text-5xl text-primary">10K+</p>
            <p class="text-xs text-text-muted mt-2">Verified Reviews</p>
          </div>
          <div class="w-px h-16 bg-border hidden sm:block"></div>
          <div class="text-center hidden sm:block">
            <p class="font-heading font-bold text-5xl text-primary">98%</p>
            <p class="text-xs text-text-muted mt-2">Would Recommend</p>
          </div>
        </div>

        <!-- Testimonial grid -->
        <div class="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          @for (t of testimonials(); track t.id) {
            <article
              class="break-inside-avoid card p-6 mb-5 flex flex-col gap-4"
              [attr.aria-label]="'Review by ' + t.name"
            >
              <!-- Stars -->
              <div class="flex gap-0.5">
                @for (i of starArray(t.rating); track $index) {
                  <svg width="14" height="14" viewBox="0 0 24 24"
                    [attr.fill]="i === 'full' ? 'currentColor' : 'none'"
                    stroke="currentColor" stroke-width="2"
                    class="text-accent">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                }
              </div>

              <!-- Quote -->
              <p class="text-text text-sm leading-relaxed">"{{ t.text }}"</p>

              <!-- Product tag -->
              @if (t.product) {
                <span class="text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-full
                  w-fit font-medium">
                  {{ t.product }}
                </span>
              }

              <!-- Author -->
              <div class="flex items-center justify-between pt-2 border-t border-border">
                <div class="flex items-center gap-3">
                  @if (t.avatar) {
                    <img
                      [src]="t.avatar"
                      [alt]="t.name"
                      class="w-9 h-9 rounded-full object-cover"
                      loading="lazy" decoding="async"
                    />
                  } @else {
                    <div class="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center
                      text-primary font-bold text-sm">
                      {{ t.name[0] }}
                    </div>
                  }
                  <div>
                    <p class="font-semibold text-text text-sm">{{ t.name }}</p>
                    @if (t.handle) {
                      <p class="text-xs text-text-muted">{{ t.handle }}</p>
                    }
                  </div>
                </div>
                <div class="text-right">
                  @if (t.verified) {
                    <span class="flex items-center gap-1 text-xs text-success font-medium">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                      Verified
                    </span>
                  }
                  @if (t.date) {
                    <p class="text-xs text-text-muted">{{ t.date }}</p>
                  }
                </div>
              </div>
            </article>
          }
        </div>

        <!-- CTA -->
        <div class="text-center mt-14">
          <p class="text-text-muted mb-4">Join thousands of happy customers</p>
          <a
            [href]="'https://wa.me/' + waPhone + '?text=Hi! I want to place my first order.'"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-whatsapp px-10 py-3.5 text-base"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            Shop Now on WhatsApp
          </a>
        </div>
      </div>
    </section>
  `,
})
export class TestimonialsComponent implements OnInit {
  readonly waPhone = environment.whatsappPhone;
  private sanity = inject(SanityService);
  testimonials = signal<Testimonial[]>(DEMO_TESTIMONIALS);

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.sanity.fetchTestimonials();
      if (data.length > 0) this.testimonials.set(data);
    } catch {
      // Use demo data
    }
  }

  starArray(rating: number): ('full' | 'empty')[] {
    return Array.from({ length: 5 }, (_, i) => (i < Math.round(rating) ? 'full' : 'empty'));
  }
}
