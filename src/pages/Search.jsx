import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ChevronRight, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import PullToRefresh from '@/components/PullToRefresh';

export default function Search() {
  const navigate = useNavigate();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);

  const load = () =>
    base44.entities.Requirement.filter({ country_code: 'IN', searchable: true })
      .then(setAll)
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(all.map((r) => r.category));
    return ['All', ...Array.from(set)];
  }, [all]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((r) => {
      const matchQ = !q || r.name.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q) || (r.category || '').toLowerCase().includes(q);
      const matchC = category === 'All' || r.category === category;
      return matchQ && matchC;
    });
  }, [all, query, category]);

  return (
    <PullToRefresh onRefresh={load}>
    <div className="px-6 pt-12">
      <h1 className="font-heading text-2xl font-semibold tracking-tight mb-1">Search</h1>
      <p className="text-sm text-muted-foreground mb-5">Find licences, permits and certificates.</p>

      <div className="relative mb-4">
        <SearchIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search requirements..."
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border bg-card outline-none focus:border-primary transition text-sm"
        />
      </div>

      <button
        onClick={() => setFilterOpen(true)}
        className="flex items-center gap-2 w-full p-3.5 rounded-2xl border border-border bg-card text-sm mb-4 select-none"
      >
        <SlidersHorizontal size={16} className="text-muted-foreground" />
        <span className="flex-1 text-left font-medium">{category === 'All' ? 'All categories' : category}</span>
        <ChevronDown size={16} className="text-muted-foreground" />
      </button>

      <Drawer open={filterOpen} onOpenChange={setFilterOpen}>
        <DrawerContent className="max-w-md mx-auto rounded-t-2xl">
          <DrawerHeader className="text-left">
            <DrawerTitle>Filter by category</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8 space-y-1 max-h-[60vh] overflow-y-auto no-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => { setCategory(c); setFilterOpen(false); }}
                className={`w-full flex items-center justify-between p-4 rounded-xl text-left min-h-[44px] select-none ${
                  category === c ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-secondary'
                }`}
              >
                <span>{c}</span>
                {category === c && <Check size={18} className="text-primary" />}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>


      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-4 border-secondary border-t-primary rounded-full animate-spin" />
        </div>
      ) : results.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-16">No results found.</p>
      ) : (
        <div className="space-y-2">
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => navigate(`/requirement/${r.id}`)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition text-left"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm leading-tight">{r.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{r.category}</p>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      )}
    </div>
    </PullToRefresh>
  );
}