import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'name',     title: 'Customer Name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'handle',   title: 'Social Handle', type: 'string' }),
    defineField({ name: 'avatar',   title: 'Avatar',        type: 'image', options: { hotspot: true } }),
    defineField({ name: 'rating',   title: 'Rating (1–5)',  type: 'number', validation: (R) => R.required().min(1).max(5) }),
    defineField({ name: 'text',     title: 'Review Text',   type: 'text',   validation: (R) => R.required().max(500) }),
    defineField({ name: 'product',  title: 'Product Name',  type: 'string' }),
    defineField({ name: 'verified', title: 'Verified Buyer?', type: 'boolean', initialValue: true }),
    defineField({ name: 'date',     title: 'Date (display)', type: 'string' }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime', initialValue: () => new Date().toISOString() }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'product', media: 'avatar' },
  },
});
