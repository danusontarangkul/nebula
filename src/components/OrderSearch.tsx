import { useState, type Dispatch, type ChangeEvent, type JSX, type SubmitEvent, type SetStateAction } from "react";
import { Button } from "./shared/Button.tsx";
import { ErrorMessage } from "./shared/ErrorMessage.tsx";
import { FormField } from "./shared/FormField.tsx";
import { Panel } from "./shared/Panel.tsx";

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
    <Panel id="order-search" title="Order lookup">
      <form onSubmit={handleSubmit} className="mt-3 flex flex-wrap items-end gap-2">
        <FormField label="Order ID">
          <input
            type="search"
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>): void => setQuery(event.currentTarget.value)}
            placeholder="ord_9w0yp"
            className="mt-1 w-64 rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-slate-900"
          />
        </FormField>
        <Button type="submit" variant="primary">
          Look up
        </Button>
      </form>
      {notFoundOrderId !== null && (
        <ErrorMessage>
          No order found for <span className="font-mono">{notFoundOrderId}</span>
        </ErrorMessage>
      )}
    </Panel>
  );
};
