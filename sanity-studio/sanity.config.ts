import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool }    from '@sanity/vision';

import product     from './schemas/product';
import category    from './schemas/category';
import testimonial from './schemas/testimonial';

export default defineConfig({
  name: 'luxe-storefront',
  title: 'Luxe Storefront',

  // Replace with your actual Sanity project ID
  projectId: 'YOUR_SANITY_PROJECT_ID',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: [product, category, testimonial],
  },
});
