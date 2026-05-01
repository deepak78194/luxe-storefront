import {
  ApplicationConfig,
  provideZoneChangeDetection,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch }         from '@angular/common/http';
import { provideAnimationsAsync }               from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { ProductService } from './core/services/product.service';

function initStore(productService: ProductService) {
  return () => Promise.all([
    productService.loadProducts(),
    productService.loadCategories(),
  ]);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      useFactory: initStore,
      deps: [ProductService],
      multi: true,
    },
  ],
};
