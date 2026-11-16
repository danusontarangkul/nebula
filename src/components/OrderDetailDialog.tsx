import { useEffect, type JSX } from "react";
import type { KitDetail, OrderDetail } from "../types/data.ts";
import { formatTimestamp } from "../utils/formatDate.ts";
import { DetailItem } from "./DetailItem.tsx";
import { KitTimeline } from "./KitTimeline.tsx";

type OrderDetailDialogProps = {
  detail: OrderDetail;
  onClose: () => void;
};

export const OrderDetailDialog = ({ detail, onClose }: OrderDetailDialogProps): JSX.Element => {
  useEffect((): (() => void) => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return (): void => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-10 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-detail-heading"
        className="mt-12 w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 id="order-detail-heading" className="text-lg font-semibold">
            Order <span className="font-mono">{detail.order.orderId}</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <DetailItem label="Product" value={detail.order.product} />
          <DetailItem label="Country" value={detail.order.country} />
          <DetailItem label="Status" value={detail.order.status} />
          <DetailItem label="Created" value={formatTimestamp(detail.order.createdAt)} />
        </dl>
        {detail.kits.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">No kits for this order.</p>
        ) : (
          <ol className="mt-6 space-y-4">
            {detail.kits.map(
              (kit: KitDetail, index: number): JSX.Element => (
                <KitTimeline key={kit.kitId} kit={kit} index={index} />
              ),
            )}
          </ol>
        )}
      </div>
    </div>
  );
};
