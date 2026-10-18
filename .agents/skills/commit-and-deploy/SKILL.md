---
name: commit-and-deploy
description: Commit the current project changes and push the main branch to the GitHub remote so the connected Cloudflare Pages project can deploy automatically. Use only when the user explicitly asks to submit or deploy the project.
metadata:
  short-description: Commit and push the project for automatic deployment
---

# Commit and deploy

Use this skill when the user explicitly requests submitting or deploying the current project.

## Workflow

1. Run `git status --short` and review the changed files. Keep unrelated user changes; do not reset, discard, or overwrite them.
2. Stage the current project changes with `git add -A` and create a concise imperative commit message, such as `chore: update project`.
3. Create the commit with `git commit -m "<message>"`.
4. Push the `main` branch to the `github` remote with:

   ```powershell
   git push github main
   ```

5. Report the commit and push result. The connected Cloudflare Pages project is expected to pull the GitHub update and deploy automatically; do not run a separate Cloudflare command unless the user asks for one.

## Stop conditions

- If `git status --short` is empty, report that there is nothing to commit and do not create an empty commit.
- If the commit fails, do not push; report the error.
- If the push fails, report the error and do not claim that deployment completed.
- If the push succeeds, report that the GitHub update was sent and that Cloudflare Pages deployment is expected to start automatically. Do not claim deployment success without deployment evidence.
