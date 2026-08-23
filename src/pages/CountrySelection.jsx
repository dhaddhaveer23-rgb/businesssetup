import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Lock, ArrowRight, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function CountrySelection() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    base44.entities.Country.list('name')
      .then(setCountries)
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (country) => {
    if (!country.available) return;
    setSelecting(true);
    localStorage.setItem('bs_country', country.code);
    base44.auth
      .updateMe({ selected_country: country.code })
      .catch(() => {})
      .finally(() => navigate('/home', { replace: true }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto w-full px-6 pt-14 pb-10">
        <button
          onClick={() => navigate('/home')}
          className="text-sm text-muted-foreground mb-6 hover:text-foreground transition"
        >
          Skip for now
        </button>
        <h1 className="font-heading text-3xl font-semibold tracking-tight mb-2">
          Where are you starting your business?
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Select your country to see the requirements that apply to you.
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-7 h-7 border-4 border-secondary border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {countries.map((country) => {
              const available = country.available;
              return (
                <button
                  key={country.id}
                  disabled={!available || selecting}
                  onClick={() => handleSelect(country)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition text-left ${
                    available
                      ? 'border-border bg-card hover:border-primary/40 hover:bg-accent/50'
                      : 'border-border bg-muted/40 opacity-70 cursor-not-allowed'
                  }`}
                >
                  <div className="text-3xl">{country.flag}</div>
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {country.name}
                      {available && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          Available
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {available ? country.tagline : 'Coming soon'}
                    </div>
                  </div>
                  {available ? (
                    <ArrowRight size={18} className="text-muted-foreground" />
                  ) : (
                    <Lock size={16} className="text-muted-foreground" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}