# Kit Lifecycle Dashboard: Requirements

## Requirements

### Functional

1. Display data from the two bundled CSV files (`orders.csv`, `kit_events.csv`) by default
2. Upload a new pair of CSV files and render their data
3. Show pipeline overview: order volume, where kits are now, how many have finished
4. Show how long each stage takes, broken down by product
5. List stuck kits that are past their stage target and need follow-up
6. Drill into a single order and see its full event timeline
7. Filter by date, product, and country
8. Handle messy data (duplicates, mixed timestamp formats, orphan events, test orders, replacement kits)

### Non-functional

1. Uploaded CSV files stay in the local browser only
2. Unit tests
3. Frontend Only

## Tech Stack

- **Framework:** React + TypeScript
- **Build tool:** Vite
- **Styling:** Tailwind CSS
- **CSV parsing:** PapaParse
- **Charts:** Recharts
- **Testing:** Vitest + React Testing Library
- **Deployment:** GitHub Pages via GitHub Actions

## Out of Scope

1. No backend, server, API, or database
2. No login, user accounts, or roles
3. No saving uploaded data between sessions (localStorage, IndexedDB)
4. No editing, adding, or deleting orders or events in the app
5. No exporting or downloading data (CSV, PDF, reports)
6. No email, Slack, or in-app alerts for stuck kits
7. No live data feeds or integrations with carrier or lab systems
8. No forecasting, predictions, or AI-generated insights
9. No configurable stage targets; use the fixed targets from the challenge
10. No file formats other than CSV (Excel, JSON)
11. No customer-facing views
12. No dark mode, theming, or internationalization

## User Stories

### 1. Display data from the bundled CSVs by default

**As an** ops team member, **I want** the dashboard to show data as soon as I open it, **so that** I can start using it without any setup.

- [ ] Opening the app loads `orders.csv` and `kit_events.csv` automatically
- [ ] All views are populated on first load, with no upload needed
- [ ] The data's "as of" date is shown on screen

### 2. Upload a new pair of CSVs and render their data

**As an** ops team member, **I want** to upload a different `orders.csv` and `kit_events.csv`, **so that** I can analyze a newer export.

- [ ] I can select both files from the UI
- [ ] Every view updates to reflect the uploaded data
- [ ] If a required column is missing, a clear error is shown and the current data stays loaded

### 3. Pipeline overview

**As an** ops team member, **I want** a summary of the whole pipeline, **so that** I can see at a glance how things are going.

- [ ] Shows total order volume
- [ ] Shows the number of kits currently at each pipeline stage
- [ ] Shows the number of kits that have finished (`report_ready`)

### 4. Stage durations by product

**As an** ops team member, **I want** to see how long each stage takes for each product, **so that** I can spot slow stages.

- [ ] Each stage shows its median duration alongside its target in days
- [ ] Results can be compared between `wgs_30x` and `wgs_100x`
- [ ] Stages that miss their target are visually highlighted

### 5. Stuck kits

**As an** ops team member, **I want** a list of kits that are past their stage target, **so that** I know who to follow up with.

- [ ] A kit is listed when its time in its current stage exceeds that stage's target, measured to the "as of" date
- [ ] Each row shows order ID, kit ID, product, current stage, and days over target
- [ ] The list is sorted by days over target, longest first
- [ ] Completed, replaced, cancelled, refunded, and test kits are excluded

### 6. Order drill-down

**As an** ops team member, **I want** to look up a single order, **so that** I can see exactly what happened to it.

- [ ] I can search for an order by `order_id`
- [ ] The order's details are shown: product, country, status, and created date
- [ ] Every kit on the order is listed, including replacements
- [ ] Each kit shows a timeline of events in time order
- [ ] Clicking a stuck kit opens its order

### 7. Filters

**As an** ops team member, **I want** to filter by date, product, and country, **so that** I can focus on the subset I care about.

- [ ] Filters for date range, product, and country are available
- [ ] Filters apply to every view (overview, durations, and stuck kits)
- [ ] Filters can be cleared in one action

### 8. Messy data handling

**As an** ops team member, **I want** bad data cleaned up consistently, **so that** I can trust the numbers.

- [ ] Duplicate events (same kit, type, and timestamp) are counted once
- [ ] All timestamp formats are normalized to UTC
- [ ] Orphan events with no matching order are excluded
- [ ] Test orders are excluded by default
- [ ] A replacement kit is tracked as its own kit, linked to the original
- [ ] A count of excluded or corrected rows is visible
