import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, Search, FileCheck, Plus, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PullToRefresh from '@/components/PullToRefresh';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [businessCount, setBusinessCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);
        const selected = u?.data?.selected_country || u?.selected_country || localStorage.getItem('bs_country');
        if (!selected) {
          navigate('/select-country', { replace: true });
          return;
        }
      } catch (e) {}
      base44.entities.UserBusiness.list().then((b) => setBusinessCount(b.length)).catch(() => {});
    })();
  }, [navigate]);

  const reload = () => base44.entities.UserBusiness.list().then((b) => setBusinessCount(b.length)).catch(() => {});

  const firstName = user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  return (
    <PullToRefresh onRefresh={reload}>
    <div className="px-6 pt-[calc(3rem+env(safe-area-inset-top))]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight capitalize">{firstName}</h1>
        </div>
        <Link to="/profile" className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
          {firstName.charAt(0).toUpperCase()}
        </Link>
      </div>

      <Link
        to="/wizard"
        className="block rounded-3xl bg-primary text-primary-foreground p-6 mb-6 relative overflow-hidden shadow-lg shadow-primary/20 select-none"
      >
        <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -right-10 bottom-2 w-20 h-20 rounded-full bg-white/10" />
        <div className="relative">
          <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center mb-4">
            <Sparkles size={22} />
          </div>
          <h2 className="font-heading text-xl font-semibold mb-1">Start a Business</h2>
          <p className="text-primary-foreground/80 text-sm mb-4 max-w-[80%]">
            Answer a few questions and get your personalised checklist.
          </p>
          <div className="inline-flex items-center gap-1.5 text-sm font-medium bg-white/15 rounded-full px-3 py-1.5">
            Get started <ArrowRight size={15} />
          </div>
        </div>
      </Link>

      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/my-businesses"
          className="rounded-2xl bg-card border border-border p-5 hover:border-primary/30 transition select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center mb-3">
            <Briefcase size={18} />
          </div>
          <h3 className="font-medium text-sm mb-0.5">My Businesses</h3>
          <p className="text-xs text-muted-foreground">{businessCount} saved</p>
        </Link>

        <Link
          to="/search"
          className="rounded-2xl bg-card border border-border p-5 hover:border-primary/30 transition select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center mb-3">
            <FileCheck size={18} />
          </div>
          <h3 className="font-medium text-sm mb-0.5">Licences & Certificates</h3>
          <p className="text-xs text-muted-foreground">Browse all</p>
        </Link>
      </div>

      <Link
        to="/search"
        className="mt-3 flex items-center gap-3 rounded-2xl bg-card border border-border p-4 hover:border-primary/30 transition select-none"
      >
        <div className="w-10 h-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center">
          <Search size={18} />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">Search</h3>
          <p className="text-xs text-muted-foreground">Find licences, permits and certificates</p>
        </div>
        <ArrowRight size={16} className="text-muted-foreground" />
      </Link>
    </div>
    </PullToRefresh>
  );
}