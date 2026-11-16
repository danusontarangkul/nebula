import type { ChangeEvent, JSX } from "react";
import type { DashboardFilters, FilterOptions } from "../types/data.ts";

type FilterBarProps = {
  filters: DashboardFilters;
  options: FilterOptions;
  onChange: (filters: DashboardFilters) => void;
  onClear: () => void;
};

const FIELD_CLASS: string = "mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900";

export const FilterBar = ({ filters, options, onChange, onClear }: FilterBarProps): JSX.Element => {
  return (
    <section aria-labelledby="filters-heading" className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
      <h2 id="filters-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Filters
      </h2>
      <div className="mt-2 flex flex-wrap items-end gap-3">
        <label className="flex flex-col text-sm text-slate-600">
          Ordered from
          <input
            type="date"
            value={filters.startDate}
            onChange={(event: ChangeEvent<HTMLInputElement>): void =>
              onChange({ ...filters, startDate: event.currentTarget.value })
            }
            className={FIELD_CLASS}
          />
        </label>
        <label className="flex flex-col text-sm text-slate-600">
          Ordered to
          <input
            type="date"
            value={filters.endDate}
            onChange={(event: ChangeEvent<HTMLInputElement>): void =>
              onChange({ ...filters, endDate: event.currentTarget.value })
            }
            className={FIELD_CLASS}
          />
        </label>
        <label className="flex flex-col text-sm text-slate-600">
          Product
          <select
            value={filters.product}
            onChange={(event: ChangeEvent<HTMLSelectElement>): void =>
              onChange({ ...filters, product: event.currentTarget.value })
            }
            className={FIELD_CLASS}
          >
            <option value="">All products</option>
            {options.products.map(
              (product: string): JSX.Element => (
                <option key={product} value={product}>
                  {product}
                </option>
              ),
            )}
          </select>
        </label>
        <label className="flex flex-col text-sm text-slate-600">
          Country
          <select
            value={filters.country}
            onChange={(event: ChangeEvent<HTMLSelectElement>): void =>
              onChange({ ...filters, country: event.currentTarget.value })
            }
            className={FIELD_CLASS}
          >
            <option value="">All countries</option>
            {options.countries.map(
              (country: string): JSX.Element => (
                <option key={country} value={country}>
                  {country}
                </option>
              ),
            )}
          </select>
        </label>
        <label className="flex items-center gap-2 py-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={filters.includeTestOrders}
            onChange={(event: ChangeEvent<HTMLInputElement>): void =>
              onChange({ ...filters, includeTestOrders: event.currentTarget.checked })
            }
            className="h-4 w-4"
          />
          Include test orders
        </label>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Clear filters
        </button>
      </div>
    </section>
  );
};
