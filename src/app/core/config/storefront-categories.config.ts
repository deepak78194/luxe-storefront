import { Category, CategoryStatus } from '../models/category.model';

/**
 * The client only wants 3 sections shown on the storefront, out of everything
 * that actually exists in Sanity. This allowlist is the single source of truth —
 * anything not listed here simply doesn't render, but nothing in Sanity is
 * touched, so re-enabling a category later is a one-line edit here.
 */
interface CategoryOverride {
  matchSlug: string;
  matchName: string;
  displayName: string;
  status: CategoryStatus;
  order: number;
  isVirtual?: boolean;
  teaserNote?: string;
}

export const STOREFRONT_CATEGORY_ALLOWLIST: CategoryOverride[] = [
  {
    matchSlug: 'beddings',
    matchName: 'beddings',
    displayName: 'Bedding',
    status: 'active',
    order: 0,
  },
  {
    // No Sanity data exists for this yet — synthesized so it can be teased on the site.
    matchSlug: 'kids-clothing',
    matchName: 'kids clothing',
    displayName: 'Kids Clothing',
    status: 'launching-soon',
    order: 1,
    isVirtual: true,
    teaserNote: 'Launching soon',
  },
  {
    matchSlug: 'womens-fashion',
    matchName: "women's fashion",
    displayName: "Women's Apparel",
    status: 'launching-soon',
    order: 2,
    teaserNote: 'Clothing & Loungewear — launching soon',
  },
];

/** Filters + relabels raw Sanity categories down to the allowlist, in order. */
export function buildStorefrontCategories(raw: Category[]): Category[] {
  const result: Category[] = [];

  for (const override of STOREFRONT_CATEGORY_ALLOWLIST) {
    if (override.isVirtual) {
      result.push({
        id: `virtual-${override.matchSlug}`,
        slug: override.matchSlug,
        name: override.displayName,
        status: override.status,
        isVirtual: true,
        teaserNote: override.teaserNote,
        order: override.order,
        productCount: 0,
      });
      continue;
    }

    const match = raw.find(
      (c) =>
        c.slug?.toLowerCase() === override.matchSlug ||
        c.name?.toLowerCase().trim() === override.matchName
    );

    if (match) {
      result.push({
        ...match,
        name: override.displayName,
        status: override.status,
        teaserNote: override.teaserNote,
        order: override.order,
      });
    } else {
      console.warn(
        `[storefront-categories] No Sanity category matched allowlist entry "${override.displayName}" ` +
          `(looked for slug "${override.matchSlug}" or name "${override.matchName}")`
      );
    }
  }

  return result.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
