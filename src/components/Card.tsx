import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function Card({ title, children }: Props) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow">
      <h2 className="text-lg font-semibold mb-3 text-white">
        {title}
      </h2>
      {children}
    </div>
  );
}
