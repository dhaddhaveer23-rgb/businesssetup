import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function LegalLayout({ title, lastUpdated, children }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto w-full px-6 pt-12 pb-16">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 hover:text-foreground transition"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="font-heading text-3xl font-semibold tracking-tight mb-1">{title}</h1>
        {lastUpdated && <p className="text-sm text-muted-foreground mb-8">Last updated: {lastUpdated}</p>}
        <div className="space-y-5 text-[15px] leading-relaxed text-foreground/90">{children}</div>
      </div>
    </div>
  );
}

export function H2({ children }) {
  return <h2 className="font-heading text-lg font-semibold text-foreground pt-2">{children}</h2>;
}

export function P({ children }) {
  return <p>{children}</p>;
}

export function UL({ children }) {
  return <ul className="list-disc pl-5 space-y-1.5">{children}</ul>;
}