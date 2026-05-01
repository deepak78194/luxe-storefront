import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent }            from '../../components/navbar/navbar.component';
import { HeroComponent }              from '../../components/hero/hero.component';
import { FeaturedCollectionsComponent } from '../../components/featured-collections/featured-collections.component';
import { ProductCatalogComponent }    from '../../components/product-catalog/product-catalog.component';
import { AboutComponent }             from '../../components/about/about.component';
import { TestimonialsComponent }      from '../../components/testimonials/testimonials.component';
import { ContactComponent }           from '../../components/contact/contact.component';
import { FooterComponent }            from '../../components/footer/footer.component';
import { CartDrawerComponent }        from '../../components/cart-drawer/cart-drawer.component';
import { ProductModalComponent }      from '../../components/product-modal/product-modal.component';
import { WhatsAppFabComponent }       from '../../components/whatsapp-fab/whatsapp-fab.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    FeaturedCollectionsComponent,
    ProductCatalogComponent,
    AboutComponent,
    TestimonialsComponent,
    ContactComponent,
    FooterComponent,
    CartDrawerComponent,
    ProductModalComponent,
    WhatsAppFabComponent,
  ],
  template: `
    <app-navbar />

    <main>
      <app-hero />
      <app-featured-collections />
      <app-product-catalog />
      <app-about />
      <app-testimonials />
      <app-contact />
    </main>

    <app-footer />

    <!-- Overlays & floating UI -->
    <app-cart-drawer />
    <app-product-modal />
    <app-whatsapp-fab />
  `,
})
export class HomePageComponent {}
