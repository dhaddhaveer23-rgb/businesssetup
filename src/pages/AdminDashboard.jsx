import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, CheckCircle2, Award, TrendingDown, BarChart3, ShieldAlert } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const COUNTRY_NAMES = { SG: 'Singapore', IN: 'India', MY: 'Malaysia', TH: 'Thailand', ID: 'Indonesia', PH: 'Philippines', VN: 'Vietnam' };

function StageBar({ icon: Icon, label, value, total, tone }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const barWidth = total > 0 ? (value / total) * 100 : 0;
  const toneClasses = {
    primary: 'bg-primary',
    green: 'bg-emerald-500',
    gold: 'bg-amber-500'
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="flex items-center gap-2 text-sm font-medium">
          <Icon size={16} className="text-muted-foreground" /> {label}
        </span>
        <span className="text-sm tabular-nums">{value} <span className="text-muted-foreground">· {pct}%</span></span>
      </div>
      <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${toneClasses[tone] || 'bg-primary'}`} style={{ width: `${barWidth}%` }} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await base44.functions.invoke('getOnboardingFunnel', {});
        if (res.data?.error) {
          setError(res.data.error === 'Forbidden' ? 'not_authorized' : 'error');
        } else {
          setData(res.data);
        }
      } catch (e) {
        const status = e?.response?.status;
        setError(status === 403 ? 'not_authorized' : 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error === 'not_authorized') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
        <ShieldAlert size={40} className="text-muted-foreground mb-3" />
        <h1 className="font-heading text-xl font-semibold mb-1">Admins only</h1>
        <p className="text-sm text-muted-foreground mb-6">You need an admin account to view this dashboard.</p>
        <button onClick={() => navigate('/home')} className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium">Back to home</button>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
        <h1 className="font-heading text-xl font-semibold mb-1">Couldn't load data</h1>
        <p className="text-sm text-muted-foreground mb-6">Please try again later.</p>
        <button onClick={() => navigate('/home')} className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium">Back to home</button>
      </div>
    );
  }

  const { totalSelected, reachedChecklist, completed, droppedOff, byCountry } = data;
  const engagementRate = totalSelected > 0 ? Math.round((reachedChecklist / totalSelected) * 100) : 0;
  const completionRate = totalSelected > 0 ? Math.round((completed / totalSelected) * 100) : 0;
  const dropoffRate = totalSelected > 0 ? Math.round((droppedOff / totalSelected) * 100) : 0;
  const countries = Object.entries(byCountry).sort((a, b) => b[1].selected - a[1].selected);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto w-full px-6 pt-[calc(3rem+env(safe-area-inset-top))] pb-12">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center mb-5 select-none">
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={20} className="text-primary" />
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Onboarding Funnel</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">How users progress from selecting a business type to completing their checklist.</p>

        <div className="rounded-3xl bg-card border border-border p-6 mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Funnel stages</h2>
          <div className="space-y-5">
            <StageBar icon={Users} label="Selected a business type" value={totalSelected} total={totalSelected} tone="primary" />
            <StageBar icon={CheckCircle2} label="Reached checklist (engaged)" value={reachedChecklist} total={totalSelected} tone="green" />
            <StageBar icon={Award} label="Completed checklist" value={completed} total={totalSelected} tone="gold" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-2xl bg-card border border-border p-4 text-center">
            <p className="text-2xl font-semibold tabular-nums">{engagementRate}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">Engagement</p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-4 text-center">
            <p className="text-2xl font-semibold tabular-nums text-amber-600 dark:text-amber-500">{completionRate}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">Completion</p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-4 text-center">
            <p className="text-2xl font-semibold tabular-nums text-destructive">{dropoffRate}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">Drop-off</p>
          </div>
        </div>

        <div className="rounded-3xl bg-destructive/5 border border-destructive/20 p-5 mb-6 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
            <TrendingDown size={18} />
          </div>
          <div>
            <p className="font-medium text-sm text-destructive">Dropped off after business type selection</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {droppedOff} {droppedOff === 1 ? 'user' : 'users'} selected a business type but never engaged with their checklist.
            </p>
          </div>
        </div>

        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">By country</h2>
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          {countries.map(([cc, c], i) => (
            <div key={cc} className={`flex items-center justify-between px-4 py-3 ${i !== countries.length - 1 ? 'border-b border-border' : ''}`}>
              <span className="text-sm font-medium">{COUNTRY_NAMES[cc] || cc}</span>
              <span className="text-sm text-muted-foreground tabular-nums">
                {c.selected} selected · {c.completed} completed
              </span>
            </div>
          ))}
          {countries.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">No businesses yet.</p>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-6 text-center">Aggregate counts across all users · Test data version</p>
      </div>
    </div>
  );
}