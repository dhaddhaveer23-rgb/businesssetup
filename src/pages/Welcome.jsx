import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Welcome() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    base44.auth.isAuthenticated().then((authed) => {
      if (authed) navigate('/home', { replace: true });
      else setChecking(false);
    });
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 max-w-md mx-auto w-full flex flex-col px-6 pt-16 pb-10">
        <div className="flex items-center gap-2 mb-16">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="text-primary-foreground" size={20} />
          </div>
          <span className="font-heading font-semibold text-lg tracking-tight">BusinessSetup</span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-6">
            <ShieldCheck size={13} />
            Singapore · Test data version
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight leading-[1.1] mb-4">
            Start your business smarter.
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed mb-10">
            Find the registrations, licences, certificates and requirements you need to get started.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/register"
            className="w-full rounded-2xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 py-3.5 px-5 shadow-lg shadow-primary/25 hover:opacity-95 transition"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/login"
            className="w-full rounded-2xl bg-secondary text-secondary-foreground font-medium flex items-center justify-center py-3.5 px-5 hover:bg-accent transition"
          >
            Log In
          </Link>
          <p className="text-center text-xs text-muted-foreground pt-2">
            Currently supporting Singapore. More countries coming soon.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-6">
          <Link to="/privacy-policy" className="hover:text-foreground transition">Privacy</Link>
          <span className="text-border">·</span>
          <Link to="/terms-of-service" className="hover:text-foreground transition">Terms</Link>
          <span className="text-border">·</span>
          <Link to="/disclaimer" className="hover:text-foreground transition">Disclaimer</Link>
          <span className="text-border">·</span>
          <Link to="/contact" className="hover:text-foreground transition">Contact</Link>
        </div>
      </div>
    </div>
  );
}