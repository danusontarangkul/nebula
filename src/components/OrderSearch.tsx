import { useState, type Dispatch, type ChangeEvent, type JSX, type SubmitEvent, type SetStateAction } from "react";

type OrderSearchProps = {
  onSearch: (orderId: string) => boolean;
  notFoundOrderId: string | null;
};

export const OrderSearch = ({ onSearch, notFoundOrderId }: OrderSearchProps): JSX.Element => {
  const [query, setQuery]: [string, Dispatch<SetStateAction<string>>] = useState<string>("");

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const orderId: string = query.trim();
    if (orderId === "") {
      return;
    }
    const isFound: boolean = onSearch(orderId);
    if (isFound) {
      setQuery("");
    }
  };

  return (
    <section aria-labelledby="order-search-heading" className="mt-6">
      <h2 id="order-search-heading" className="text-xl font-semibold">
        Order lookup
      </h2>
      <form onSubmit={handleSubmit} className="mt-3 flex flex-wrap items-end gap-2">
        <label className="flex flex-col text-sm text-slate-600">
          Order ID
          <input
            type="search"
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>): void => setQuery(event.currentTarget.value)}
            placeholder="ord_9w0yp"
            className="mt-1 w-64 rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-slate-900"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Look up
        </button>
      </form>
      {notFoundOrderId !== null && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          No order found for <span className="font-mono">{notFoundOrderId}</span>
        </p>
      )}
    </section>
  );
};
