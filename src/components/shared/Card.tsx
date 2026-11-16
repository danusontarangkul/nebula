import type { JSX, ReactNode } from "react";

type CardProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export const Card = ({ id, title, children }: CardProps): JSX.Element => {
  const headingId: string = `${id}-heading`;

  return (
    <section aria-labelledby={headingId} className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
      <h2 id={headingId} className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h2>
      {children}
    </section>
  );
};
