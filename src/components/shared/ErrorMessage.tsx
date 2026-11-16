import type { JSX, ReactNode } from "react";

type ErrorMessageProps = {
  children: ReactNode;
};

export const ErrorMessage = ({ children }: ErrorMessageProps): JSX.Element => {
  return (
    <div role="alert" className="mt-3 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      <span aria-hidden="true" className="font-bold">
        !
      </span>
      <p>{children}</p>
    </div>
  );
};
