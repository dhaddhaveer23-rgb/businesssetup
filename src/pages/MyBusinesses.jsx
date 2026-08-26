import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase, ChevronRight, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PullToRefresh from '@/components/PullToRefresh';

export default function MyBusinesses() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    base44.entities.UserBusiness.list('-created_date')
      .then(setBusinesses)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <PullToRefresh onRefresh={load}>
    <div className="px-6 pt-12">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">My Businesses</h1>
        <button
          onClick={() => navigate('/wizard')}
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
        >
          <Plus size={20} />
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Businesses you're setting up.</p>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-4 border-secondary border-t-primary rounded-full animate-spin" />
        </div>
      ) : businesses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <Briefcase size={28} className="text-muted-foreground" />
          </div>
          <p className="font-medium mb-1">No businesses yet</p>
          <p className="text-sm text-muted-foreground mb-5">Start the wizard to create your first checklist.</p>
          <button
            onClick={() => navigate('/wizard')}
            className="px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-medium text-sm"
          >
            Start a Business
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {businesses.map((b) => (
            <button
              key={b.id}
              onClick={() => navigate(`/checklist/${b.id}`)}
              className="w-full p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition text-left"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <p className="font-medium truncate">{b.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    {b.business_type} · <MapPin size={11} /> {b.country_code}
                  </p>
                </div>
                <ChevronRight size={18} className="text-muted-foreground shrink-0" />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${b.checklist_progress || 0}%` }} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{b.checklist_progress || 0}%</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
    </PullToRefresh>
  );
}