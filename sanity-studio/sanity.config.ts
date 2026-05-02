import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool }    from '@sanity/vision';

import product     from './schemas/product';
import category    from './schemas/category';
import testimonial from './schemas/testimonial';

export default defineConfig({
  name: 'luxe-storefront',
  title: 'Luxe Storefront',

  // TODO: paste your Project ID from sanity.io/manage
  projectId: 'YOUR_SANITY_PROJECT_ID',
  dataset: 'pdc1c',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: [product, category, testimonial],
  },
});
