import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const router  = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) return true; // allow SSR to pass through

  // Session token is issued by /api/admin-login (CF Pages Function).
  // Client-side we only check expiry; HMAC integrity is verified server-side on each write.
  const token = sessionStorage.getItem('admin-session-token') ?? '';
  if (token) {
    const dotIdx = token.indexOf('.');
    if (dotIdx !== -1 && Date.now() < Number(token.slice(0, dotIdx))) {
      return true;
    }
  }

  router.navigate(['/admin/login']);
  return false;
};
