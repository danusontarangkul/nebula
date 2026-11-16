import type { Dataset, FilterOptions, Order } from "../types/data.ts";

const getSortedUnique = (values: string[]): string[] => {
  return [...new Set(values.filter((value: string): boolean => value !== ""))].sort();
};

export const getFilterOptions = (dataset: Dataset): FilterOptions => {
  return {
    products: getSortedUnique(dataset.orders.map((order: Order): string => order.product.trim())),
    countries: getSortedUnique(dataset.orders.map((order: Order): string => order.country.trim())),
  };
};
