import type { ChangeEvent, JSX } from "react";
import type { DashboardFilters, FilterOptions } from "../types/data.ts";
import { Button } from "./shared/Button.tsx";
import { Card } from "./shared/Card.tsx";
import { FormField } from "./shared/FormField.tsx";

type FilterBarProps = {
  filters: DashboardFilters;
  options: FilterOptions;
  onChange: (filters: DashboardFilters) => void;
  onClear: () => void;
};

const FIELD_CLASS: string = "mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900";

export const FilterBar = ({ filters, options, onChange, onClear }: FilterBarProps): JSX.Element => {
  return (
    <Card id="filters" title="Filters">
      <div className="mt-2 flex flex-wrap items-end gap-3">
        <FormField label="Ordered from">
          <input
            type="date"
            value={filters.startDate}
            onChange={(event: ChangeEvent<HTMLInputElement>): void =>
              onChange({ ...filters, startDate: event.currentTarget.value })
            }
            className={FIELD_CLASS}
          />
        </FormField>
        <FormField label="Ordered to">
          <input
            type="date"
            value={filters.endDate}
            onChange={(event: ChangeEvent<HTMLInputElement>): void =>
              onChange({ ...filters, endDate: event.currentTarget.value })
            }
            className={FIELD_CLASS}
          />
        </FormField>
        <FormField label="Product">
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
        </FormField>
        <FormField label="Country">
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
        </FormField>
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
        <Button type="button" variant="secondary" onClick={onClear}>
          Clear filters
        </Button>
      </div>
    </Card>
  );
};
