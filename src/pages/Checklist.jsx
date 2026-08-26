import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight, Circle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import TipsButton from '@/components/TipsButton';
import PullToRefresh from '@/components/PullToRefresh';

const CATEGORY_ORDER = [
  'Business Registration',
  'Licences & Permits',
  'Premises',
  'Tax',
  'Employees',
  'Safety',
  'Industry-specific',
  'Other'
];

export default function Checklist() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);
  const [tipsMap, setTipsMap] = useState({});

  const load = async () => {
    try {
      const b = await base44.entities.UserBusiness.get(businessId);
      const [its, reqs] = await Promise.all([
        base44.entities.ChecklistItem.filter({ user_business_id: businessId }),
        base44.entities.Requirement.filter({ country_code: b.country_code })
      ]);
      const tMap = {};
      reqs.forEach((r) => { tMap[r.id] = r.tips; });
      setTipsMap(tMap);
      setBusiness(b);
      setItems(its);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [businessId]);

  const grouped = useMemo(() => {
    const map = {};
    items.forEach((it) => {
      if (!map[it.category]) map[it.category] = [];
      map[it.category].push(it);
    });
    return CATEGORY_ORDER.filter((c) => map[c]).map((c) => ({ category: c, items: map[c] }));
  }, [items]);

  const completedCount = items.filter((i) => i.completed).length;
  const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const toggle = async (item) => {
    if (toggling === item.id) return;
    setToggling(item.id);
    const newCompleted = !item.completed;
    // Optimistic update: reflect the change in the UI immediately
    const updatedItems = items.map((i) => (i.id === item.id ? { ...i, completed: newCompleted } : i));
    setItems(updatedItems);
    const newCount = updatedItems.filter((i) => i.completed).length;
    const newProgress = updatedItems.length > 0 ? Math.round((newCount / updatedItems.length) * 100) : 0;
    setBusiness({ ...business, checklist_progress: newProgress });
    try {
      await base44.entities.ChecklistItem.update(item.id, {
        completed: newCompleted,
        completed_date: newCompleted ? new Date().toISOString().slice(0, 10) : null
      });
      base44.entities.UserBusiness.update(businessId, { checklist_progress: newProgress }).catch(() => {});
    } catch (e) {
      // Revert on failure
      setItems(items);
      setBusiness({ ...business, checklist_progress: progress });
    } finally {
      setToggling(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
        <h1 className="font-heading text-xl font-semibold mb-2">Business not found</h1>
        <p className="text-sm text-muted-foreground mb-6">This business may have been deleted or isn't available.</p>
        <Link to="/my-businesses" className="px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-medium text-sm">
          Back to My Businesses
        </Link>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={load}>
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto w-full">
        {/* Header */}
        <div className="px-6 pt-[calc(3rem+env(safe-area-inset-top))] pb-6 bg-primary text-primary-foreground">
          <button onClick={() => navigate('/my-businesses')} className="flex items-center gap-1.5 text-sm text-primary-foreground/80 mb-4">
            <ArrowLeft size={16} /> My Businesses
          </button>
          <h1 className="font-heading text-2xl font-semibold tracking-tight mb-1 truncate">{business?.name}</h1>
          <p className="text-sm text-primary-foreground/80 mb-5">
            {business?.business_type} · {business?.country_code}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2.5 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-sm font-semibold">{progress}%</span>
          </div>
          <p className="text-xs text-primary-foreground/70 mt-2">
            {completedCount} of {items.length} requirements completed
          </p>
        </div>


        {/* Checklist */}
        <div className="px-6 py-5 space-y-6">
          {grouped.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-10">No requirements generated for this business.</p>
          )}
          {grouped.map((group) => (
            <div key={group.category}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">{group.category}</h2>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border select-none"
                  >
                    <button
                      onClick={() => toggle(item)}
                      disabled={toggling === item.id}
                      className="shrink-0 select-none"
                    >
                      {item.completed ? (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check size={14} className="text-primary-foreground" strokeWidth={3} />
                        </div>
                      ) : (
                        <Circle size={24} className="text-muted-foreground/40" />
                      )}
                    </button>
                    <Link to={`/requirement/${item.requirement_id}`} className="flex-1 min-w-0">
                      <p className={`text-sm font-medium leading-tight ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.requirement_name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-0.5">
                        View details <ChevronRight size={12} />
                      </p>
                    </Link>
                    <TipsButton tips={tipsMap[item.requirement_id]} name={item.requirement_name} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </PullToRefresh>
  );
}