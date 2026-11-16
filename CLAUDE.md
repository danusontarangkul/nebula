# CLAUDE.md

## Tech Stack

React, TypeScript, Vite, Tailwind CSS, PapaParse, Recharts, Vitest, React Testing Library. Deployed to GitHub Pages via GitHub Actions. Frontend only, no backend.

## Commands

- `npm run dev`: start the dev server
- `npm run lint`: lint with oxlint (fails on warnings)
- `npm test`: run unit tests
- `npm run build`: type-check and build

## Project Structure

```
src/
  components/   React components (UI only)
  hooks/        React hooks
  utils/        Pure functions: parsing, cleaning, metrics
  types/        Shared TypeScript types
public/
  orders.csv
  kit_events.csv
```

## Workflow

### Only build what is asked
- Implement only what the current prompt asks for
- Do not add extra features, utils, files, dependencies, or tests beyond what the prompt needs
- If something extra seems useful, suggest it in the reply instead of building it

### Git flow
1. Before starting a new feature, create a new branch from the latest `main`
2. The user prompts, then revises the code until it is right
3. The user opens a PR and merges it into `main`
4. After the merge, switch to `main`, pull, and create a new branch for the next prompt

- The user's own edits to any file, including `README.md`, are kept exactly as they are: never revert, rewrite, or reformat them
- Always include the user's own edits in the commit and PR for the current branch
- Never commit feature work directly to `main`
- Branch names: `feature/<short-name>`, `fix/<short-name>`, or `chore/<short-name>`

## Code Rules

### No `any`

- Never use `any`, including `as any` and `any[]`
- Use `unknown` for untrusted input and narrow it with type guards
- Use strict mode in `tsconfig.json` (`"strict": true`, `"noImplicitAny": true`)

### Explicit types

- Every variable declares its type explicitly, even when TypeScript could infer it
- Every function declares its parameter types and return type
- React components declare their props type and return `JSX.Element`

```ts
const count: number = 0;
const kitIds: string[] = [];
const byOrderId: Map<string, Order> = new Map();
```

### No comments

- Do not write code comments
- Use clear names for variables, functions, and types instead

### Utils folder

- All data logic lives in `src/utils/`: CSV parsing, timestamp normalization, deduplication, kit stage derivation, durations, stuck-kit detection, filtering
- Utils are pure functions: no React, no DOM, no side effects
- Components and hooks call utils. They do not contain data logic themselves

```ts
export const toUtcDate = (raw: string): Date | null => {
  const trimmed: string = raw.trim();
  const hasZone: boolean = /Z$|[+-]\d{2}:\d{2}$/.test(trimmed);
  const iso: string = hasZone ? trimmed : `${trimmed.replace(" ", "T")}Z`;
  const date: Date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};
```

### Loading, error, and success states

- Every async operation (loading the bundled CSVs, uploading CSVs) uses a single state type
- Every component that shows async data renders all three states

```ts
export type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };
```

```tsx
export const Dashboard = (): JSX.Element => {
  const state: AsyncState<DashboardData> = useDashboardData();

  if (state.status === "loading") return <LoadingState />;
  if (state.status === "error") return <ErrorState message={state.message} />;
  return <DashboardView data={state.data} />;
};
```

## Testing

- Every function in `src/utils/` has unit tests
- Test files sit next to the file they test: `src/utils/toUtcDate.ts` and `src/utils/toUtcDate.test.ts`
- Cover the messy-data cases in REQUIREMENTS.md: duplicates, mixed timestamp formats, orphan events, test orders, replacement kits
- Run `npm test` and make sure everything passes before finishing a task

```ts
import { describe, expect, it } from "vitest";
import { toUtcDate } from "./toUtcDate";

describe("toUtcDate", () => {
  it("parses Z timestamps", () => {
    expect(toUtcDate("2026-08-06T14:59:46Z")?.toISOString()).toBe(
      "2026-08-06T14:59:46.000Z",
    );
  });

  it("parses offset timestamps", () => {
    expect(toUtcDate("2026-08-06T09:59:46-05:00")?.toISOString()).toBe(
      "2026-08-06T14:59:46.000Z",
    );
  });

  it("treats naive timestamps as UTC", () => {
    expect(toUtcDate("2026-08-06 14:59:46")?.toISOString()).toBe(
      "2026-08-06T14:59:46.000Z",
    );
  });

  it("returns null for invalid input", () => {
    expect(toUtcDate("not a date")).toBeNull();
  });
});
```
