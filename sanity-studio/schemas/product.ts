import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'name',        title: 'Name',        type: 'string',  validation: (R) => R.required() }),
    defineField({ name: 'slug',        title: 'Slug',        type: 'slug', options: { source: 'name' }, validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text'   }),
    defineField({ name: 'price',       title: 'Price (₹)',   type: 'number', validation: (R) => R.required().min(0) }),
    defineField({ name: 'originalPrice', title: 'Original Price (₹)', type: 'number' }),
    defineField({
      name: 'images', title: 'Images', type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (R) => R.min(1),
    }),
    defineField({
      name: 'category', title: 'Category', type: 'reference',
      to: [{ type: 'category' }],
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'variants', title: 'Variants (Sizes / Colors)', type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'size',       title: 'Size',        type: 'string' },
          { name: 'color',      title: 'Color',       type: 'string' },
          { name: 'colorHex',   title: 'Color Hex',   type: 'string' },
          { name: 'stock',      title: 'Stock',       type: 'number' },
          { name: 'sku',        title: 'SKU',         type: 'string' },
        ],
      }],
    }),
    defineField({ name: 'tags',           title: 'Tags',           type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'material',       title: 'Material',       type: 'string' }),
    defineField({ name: 'isFeatured',     title: 'Featured?',      type: 'boolean', initialValue: false }),
    defineField({ name: 'isNewArrival',   title: 'New Arrival?',   type: 'boolean', initialValue: false }),
    defineField({ name: 'isBestSeller',   title: 'Best Seller?',   type: 'boolean', initialValue: false }),
    defineField({ name: 'rating',         title: 'Rating (1–5)',   type: 'number', validation: (R) => R.min(1).max(5) }),
    defineField({ name: 'reviewCount',    title: 'Review Count',   type: 'number' }),
    defineField({ name: 'publishedAt',    title: 'Published At',   type: 'datetime', initialValue: () => new Date().toISOString() }),
  ],
  preview: {
    select: { title: 'name', media: 'images.0' },
  },
});
