### Quick start

#### 1. Requirements

- Node 18+
- pnpm

#### 2. Install deps

```
pnpm install
```

#### 3. Configure environment

Create a `.env` file in the project root and fill it following `.env.example`

#### 4. Run the app

```bash
pnpm dev
```

### Assumptions

- User will only fill valid US address.
- User will just want the label and not any other information about the shipment. To simplify, after the form is submitted we're opening a new tab with the label to be printed.
- We assume user will always want to choose the lowest cost USPS shipment.
- Left the form pre-filled to easily test the label creation.

### Known bugs

- Opening state select breaks the layout. Not sure what's happening here, spent a few minutes but couldn't find the root cause in time.
- Unable to erase number inputs

### What I’d do next

- Fix select layout bug
- Fix number input not being able to be erased
- Add address verification and suggestions using Google Maps API or similar services.
- Show available USPS shipping options (cost, ETA) and let the user choose before purchase/generating the label.
- Better error handling, show a more specific error message if we have that information from EasyPost API.
- Improve tests: test form validation, add e2e tests using Playwright.
- Improve UI in general by customizing shadcn styles and redesigning the app to look better.

### Tech stack

- Next.js App Router, React, TypeScript
- Form/validation: react-hook-form + zod
- UI: Shadcn
- Testing: Vitest + Testing Library
- Lint/format: Biome
