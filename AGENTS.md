# Repository Guidelines

## Project Structure & Module Organization

This is a Vue 3 SPA built with Vite and Element Plus.

- `src/main.js` bootstraps Vue, the router, Element Plus, and global icons.
- `src/App.vue` defines the root layout; `src/layout/` contains the header and aside components.
- `src/router/index.js` owns hash-based routes. Add route pages to `src/views/` using the `*View.vue` pattern.
- `src/components/` contains reusable components; use PascalCase filenames.
- `src/const/` holds shared constants and state, and `src/util/` holds helpers.
- `src/assets/` holds bundled styles and images; `public/` is copied as-is for directly served files.
- `dist/` is generated output and should not be edited.

The `@` import alias points to `src/`.

## Build, Test, and Development Commands

- `npm ci` installs the locked dependency set.
- `npm run dev` starts the Vite development server.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the production build locally for verification.

No automated test or lint framework is configured. Treat a successful `npm run build` plus a manual smoke test of affected routes as the minimum validation.

## Coding Style & Naming Conventions

Use Vue single-file components with `<template>`, `<script>`, and optional `<style>` blocks. Prefer `<script setup>` and the Composition API for new components; retain the Options API when editing older files. Use four-space indentation and match each file's quote and semicolon style. Keep route paths lowercase (for example, `/text2image`) and use camelCase for variables and functions. Avoid unrelated formatting changes.

## Testing Guidelines

There are no configured test files, test runner, or coverage threshold. Verify changes manually in the browser, including loading, error, and responsive states. If tests are introduced, add the runner and scripts to `package.json` and document the exact command here.

## Commit & Pull Request Guidelines

Git history mixes feature notes, fixes, and date-only messages. Use concise imperative summaries with a scope when useful, such as `fix: handle failed weather requests`; avoid vague messages like `fix` or `1`.

Pull requests should explain the change, link relevant issues, list verification commands, and include screenshots for visible UI changes. Keep commits focused and exclude `node_modules/`, `dist/`, logs, and local editor settings.

## Configuration & Security

The API base URL and shared auth state live in `src/const/commom.js`; auth is persisted in `localStorage`. Do not commit credentials, tokens, or private API data. Review changes to `public/js/` carefully because those files are served directly.
