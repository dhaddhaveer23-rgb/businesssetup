import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Search() {
  const navigate = useNavigate();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    base44.entities.Requirement.filter({ country_code: 'IN', searchable: true })
      .then(setAll)
      .finally(() => setLoading(false));
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

      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 -mx-6 px-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
              category === c ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {c}
          </button>
        ))}
      </div>


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
  );
}