
# Stacks — MVP

Daily word game: make **5-letter words** that **overlap 1–4 letters** with the previous stack and **spend letters from a 15-tile bag** until it hits **0**.
Score = **Finished in N Stacks in M:SS**.

## Quick start
```bash
npm i
npm run dev
```

## Build & deploy to GitHub Pages (sub-route)
```bash
# replace /stacks/ with your repo/route
BASE_URL=/stacks/ npm run build
```
Publish `dist/` to GitHub Pages.

### Optional: GitHub Action
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [ main ]
permissions:
  contents: write
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: BASE_URL=/stacks/ npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```
