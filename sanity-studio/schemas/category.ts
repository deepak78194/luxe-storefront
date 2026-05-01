import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({ name: 'name',        title: 'Name',  type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'slug',        title: 'Slug',  type: 'slug', options: { source: 'name' }, validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'image',       title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'order',       title: 'Display Order', type: 'number', initialValue: 0 }),
  ],
  preview: {
    select: { title: 'name', media: 'image' },
  },
});
