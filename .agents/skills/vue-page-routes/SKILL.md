---
name: vue-page-routes
description: Add, rename, or remove page views in the HBuilder pages Vue app by updating src/router/index.js and src/layout/AppAside.vue.
---

# Vue Page Routes

Use this skill for page-route work in `D:\Projects\HBuilder\pages`.

## Add a Page

Given a new `src/views/XxxView.vue`:

1. Read the view and derive its route from the component basename without `View`, lowercased. For example, `ChartAnalysisView.vue` becomes `/chartanalysis`. An explicitly requested path takes precedence.
2. In `src/router/index.js`, import the component with the existing relative-import style and add a route object to `routes`:

   ```js
   import ChartAnalysisView from '../views/ChartAnalysisView.vue'

   { path: '/chartanalysis', component: ChartAnalysisView },
   ```

3. In `src/layout/AppAside.vue`, add a matching entry to `views`. Reuse the exact route path, derive a readable `text` from the component name (`ChartAnalysisView` becomes `Chart Analysis`), and choose a relevant Element Plus icon wrapped in `markRaw`:

   ```js
   import { DataAnalysis } from '@element-plus/icons-vue'

   { path: '/chartanalysis', text: 'Chart Analysis', icon: markRaw(DataAnalysis) },
   ```

   Add the entry to `authViews` instead when the page should remain hidden until authentication succeeds.

For renames or removals, update the import, route, sidebar entry, and any matching route references together. Do not renumber `dist/` or edit generated files.

## Verify

Confirm the router path and sidebar path are identical, then run:

```sh
npm run build
```

When the development server is running, open the route using the hash URL, such as `/#/chartanalysis`, and verify the sidebar navigates to it.
