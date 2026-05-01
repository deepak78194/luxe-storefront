import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="about" class="py-20 md:py-28 bg-secondary overflow-hidden" aria-labelledby="about-heading">
      <div class="container-luxe">

        <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <!-- Image collage -->
          <div class="relative order-2 lg:order-1">
            <!-- Main image -->
            <div class="relative z-10 rounded-2xl overflow-hidden shadow-card-hover aspect-[4/5] w-4/5">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
                alt="Luxe brand story"
                class="w-full h-full object-cover"
                loading="lazy" decoding="async"
              />
              <!-- Overlay text -->
              <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-text/60 to-transparent">
                <p class="text-white font-heading text-lg italic">"Wear your confidence."</p>
              </div>
            </div>

            <!-- Secondary image -->
            <div class="absolute -bottom-6 -right-0 z-20 w-2/5 rounded-2xl overflow-hidden shadow-modal
              border-4 border-white aspect-[3/4]">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
                alt="Craftsmanship detail"
                class="w-full h-full object-cover"
                loading="lazy" decoding="async"
              />
            </div>

            <!-- Decorative element -->
            <div class="absolute -top-8 -left-8 w-32 h-32 rounded-full
              bg-gradient-luxury opacity-10 z-0"></div>
            <div class="absolute top-1/2 -left-4 w-16 h-16 rounded-full
              bg-accent opacity-20 z-0"></div>
          </div>

          <!-- Content -->
          <div class="order-1 lg:order-2">
            <span class="text-primary text-sm font-semibold tracking-widest uppercase mb-4 block">
              Our Story
            </span>
            <h2 id="about-heading" class="section-title mb-6 text-balance">
              Crafted with Purpose,<br/>Worn with Pride
            </h2>
            <div class="divider mb-8"></div>

            <div class="space-y-5 text-text-muted leading-relaxed">
              <p>
                Luxe was born from a simple belief: that exceptional quality and
                thoughtful design should be accessible to everyone. We partner
                directly with artisan workshops across India to bring you pieces
                that stand the test of time.
              </p>
              <p>
                Every stitch, every leather panel, every fabric choice is made
                with intention. We use only ethically sourced materials and
                support fair wages for every craftsperson in our supply chain.
              </p>
              <p>
                From our first tote to our hundredth — each Luxe piece carries
                the same promise: beauty that lasts, values that matter.
              </p>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-border">
              @for (stat of stats; track stat.label) {
                <div class="text-center">
                  <p class="font-heading font-bold text-3xl text-primary mb-1">{{ stat.value }}</p>
                  <p class="text-xs text-text-muted uppercase tracking-wider">{{ stat.label }}</p>
                </div>
              }
            </div>

            <!-- Values -->
            <div class="mt-10 space-y-4">
              @for (value of values; track value.title) {
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center
                    flex-none text-xl">
                    {{ value.emoji }}
                  </div>
                  <div>
                    <h4 class="font-semibold text-text mb-0.5">{{ value.title }}</h4>
                    <p class="text-sm text-text-muted">{{ value.description }}</p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AboutComponent {
  readonly stats = [
    { value: '10K+', label: 'Happy Customers' },
    { value: '500+', label: 'Curated Products' },
    { value: '4.9★', label: 'Average Rating' },
  ];

  readonly values = [
    {
      emoji: '♻️',
      title: 'Sustainable Materials',
      description: 'Ethically sourced leathers, organic cottons and recycled packaging.',
    },
    {
      emoji: '🤝',
      title: 'Artisan Partnerships',
      description: 'Direct from skilled craftspeople — fair wages, transparent supply chain.',
    },
    {
      emoji: '📦',
      title: 'Zero-Waste Packaging',
      description: 'Every order ships in 100% recyclable, plastic-free packaging.',
    },
  ];
}
