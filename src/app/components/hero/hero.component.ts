import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';

interface HeroSlide {
  tag: string;
  heading: string;
  subheading: string;
  cta: string;
  ctaHref: string;
  imageUrl: string;
  imageAlt: string;
  accentColor: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="hero" class="relative overflow-hidden" aria-label="Hero">

      <!-- Slides -->
      <div class="relative">
        @for (slide of slides; track slide.heading; let i = $index) {
          <div
            class="transition-all duration-700"
            [class.opacity-100]="currentSlide() === i"
            [class.opacity-0]="currentSlide() !== i"
            [class.absolute]="currentSlide() !== i"
            [class.inset-0]="currentSlide() !== i"
            [attr.aria-hidden]="currentSlide() !== i"
          >
            <!-- Background image -->
            <div class="relative min-h-[90vh] md:min-h-screen flex items-center">
              <div class="absolute inset-0 z-0">
                <img
                  [src]="slide.imageUrl"
                  [alt]="slide.imageAlt"
                  class="w-full h-full object-cover object-center"
                  [attr.loading]="i === 0 ? 'eager' : 'lazy'"
                  decoding="async"
                />
                <!-- Gradient overlay -->
                <div class="absolute inset-0 bg-gradient-to-r from-text/70 via-text/40 to-transparent"></div>
              </div>

              <!-- Content -->
              <div class="container-luxe relative z-10 py-24 md:py-32">
                <div class="max-w-xl animate-slide-up">
                  <!-- Tag -->
                  <span class="badge badge-new mb-4 inline-flex animate-fade-in">
                    {{ slide.tag }}
                  </span>

                  <!-- Heading -->
                  <h1 class="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                    font-bold text-white leading-tight text-balance mb-6 animate-slide-up delay-100">
                    {{ slide.heading }}
                  </h1>

                  <!-- Subheading -->
                  <p class="text-lg md:text-xl text-white/85 leading-relaxed mb-10
                    max-w-lg animate-slide-up delay-200">
                    {{ slide.subheading }}
                  </p>

                  <!-- CTAs -->
                  <div class="flex flex-wrap gap-4 animate-slide-up delay-300">
                    <a
                      [href]="slide.ctaHref"
                      class="btn btn-primary text-base px-8 py-3.5"
                    >
                      {{ slide.cta }}
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </a>
                    <a
                      href="https://wa.me/919876543210?text=Hi! I want to explore your collection."
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn btn-whatsapp text-base px-8 py-3.5"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                      </svg>
                      Order on WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <!-- Slide number -->
              <div class="absolute bottom-8 right-8 text-white/60 text-sm font-medium hidden md:block">
                {{ (i + 1).toString().padStart(2, '0') }} / {{ slides.length.toString().padStart(2, '0') }}
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Slide indicators -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2" role="tablist">
        @for (slide of slides; track slide.heading; let i = $index) {
          <button
            class="h-1.5 rounded-full transition-all duration-300"
            [class.w-6]="currentSlide() === i"
            [class.bg-white]="currentSlide() === i"
            [class.w-3]="currentSlide() !== i"
            [class.bg-white/40]="currentSlide() !== i"
            (click)="goToSlide(i)"
            role="tab"
            [attr.aria-selected]="currentSlide() === i"
            [attr.aria-label]="'Go to slide ' + (i + 1)"
          ></button>
        }
      </div>

      <!-- Category highlights strip -->
      <div class="bg-gradient-to-r from-primary to-primary-light py-0">
        <div class="container-luxe">
          <div class="flex overflow-x-auto scrollbar-hide gap-0 divide-x divide-white/20">
            @for (cat of categoryHighlights; track cat.label) {
              <a
                [href]="cat.href"
                class="flex-none flex items-center gap-2 px-6 py-4 text-white/90
                  hover:text-white hover:bg-white/10 transition-colors group"
              >
                <span class="text-xl">{{ cat.emoji }}</span>
                <span class="text-sm font-medium whitespace-nowrap">{{ cat.label }}</span>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  class="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0
                  transition-all stroke-2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            }
          </div>
        </div>
      </div>
    </section>

    <!-- Scroll indicator -->
    <div class="absolute bottom-20 left-8 hidden lg:flex flex-col items-center gap-2
      text-white/60 text-xs tracking-widest uppercase"
      style="writing-mode: vertical-rl; text-orientation: mixed;"
    >
      <div class="w-px h-16 bg-white/30"></div>
      Scroll
    </div>
  `,
})
export class HeroComponent implements OnInit, OnDestroy {
  currentSlide = signal(0);
  private intervalId?: ReturnType<typeof setInterval>;

  readonly slides: HeroSlide[] = [
    {
      tag: 'New Collection 2026',
      heading: 'Effortless Luxury,\nEvery Day',
      subheading: 'Discover curated fashion pieces crafted with intention. Premium materials, timeless aesthetics.',
      cta: 'Explore Collection',
      ctaHref: '#catalog',
      imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
      imageAlt: 'Model wearing luxury fashion',
      accentColor: '#0F766E',
    },
    {
      tag: 'Bags & Accessories',
      heading: 'Carry Confidence\nEverywhere',
      subheading: 'From structured totes to sleek crossbodies — bags that complete every look.',
      cta: 'Shop Bags',
      ctaHref: '#catalog',
      imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600&q=80',
      imageAlt: 'Luxury bags collection',
      accentColor: '#F59E0B',
    },
    {
      tag: 'Best Sellers',
      heading: 'Loved by\nThousands',
      subheading: 'Our most-adored pieces — tried, trusted and beautifully crafted for the modern woman.',
      cta: 'See Best Sellers',
      ctaHref: '#catalog',
      imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80',
      imageAlt: 'Fashion show',
      accentColor: '#0F766E',
    },
  ];

  readonly categoryHighlights = [
    { label: 'New Arrivals', emoji: '✨', href: '#catalog' },
    { label: 'Bags',         emoji: '👜', href: '#catalog' },
    { label: 'Clothing',     emoji: '👗', href: '#catalog' },
    { label: 'Accessories',  emoji: '💍', href: '#catalog' },
    { label: 'Shoes',        emoji: '👠', href: '#catalog' },
    { label: 'Sale',         emoji: '🏷️', href: '#catalog' },
  ];

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
    this.stopAutoplay();
    this.startAutoplay();
  }

  private startAutoplay(): void {
    this.intervalId = setInterval(() => {
      this.currentSlide.update((i) => (i + 1) % this.slides.length);
    }, 5500);
  }

  private stopAutoplay(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
