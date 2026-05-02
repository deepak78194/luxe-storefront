import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const router  = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) return true; // allow SSR to pass through

  const authenticated = sessionStorage.getItem('admin-auth') === 'true';
  if (authenticated) return true;

  router.navigate(['/admin/login']);
  return false;
};
