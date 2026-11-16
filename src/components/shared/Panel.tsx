import type { JSX, ReactNode } from "react";

type PanelProps = {
  id: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
};

export const Panel = ({ id, title, description, children }: PanelProps): JSX.Element => {
  const headingId: string = `${id}-heading`;

  return (
    <section aria-labelledby={headingId} className="mt-8">
      <h2 id={headingId} className="text-xl font-semibold">
        {title}
      </h2>
      {description !== undefined && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      {children}
    </section>
  );
};
