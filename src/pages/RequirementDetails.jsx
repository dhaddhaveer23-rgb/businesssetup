import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileWarning, ExternalLink, Building, Users, FileText, DollarSign, Clock, RefreshCw, ShieldCheck, Link2, Calendar } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function RequirementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [req, setReq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Requirement.get(id)
      .then(setReq)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!req) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <p className="text-muted-foreground mb-4">Requirement not found.</p>
        <button onClick={() => navigate(-1)} className="text-primary font-medium">Go back</button>
      </div>
    );
  }

  const status = req.verification_status || (req.is_test_data ? 'test_data' : 'unverified');
  const statusBadge =
    status === 'verified'
      ? { label: 'Verified', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' }
      : status === 'unverified'
      ? { label: 'Unverified', cls: 'bg-amber-50 text-amber-700 border border-amber-200' }
      : { label: 'Test data', cls: 'bg-amber-50 text-amber-700 border border-amber-200' };

  const fields = [
    { icon: FileText, label: 'Description', value: req.description },
    { icon: Users, label: 'Who it applies to', value: req.who_it_applies_to },
    { icon: ShieldCheck, label: 'Why it is needed', value: req.why_needed },
    { icon: FileText, label: 'Required documents', value: req.required_documents },
    { icon: DollarSign, label: 'Cost', value: req.cost },
    { icon: Clock, label: 'Processing time', value: req.processing_time },
    { icon: RefreshCw, label: 'Renewal information', value: req.renewal_info },
    { icon: Building, label: 'Issuing authority', value: req.issuing_authority }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto w-full px-6 pt-12 pb-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground mb-5 hover:text-foreground transition">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {req.category}
          </span>
          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge.cls}`}>
            {statusBadge.label}
          </span>
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight mb-4">{req.name}</h1>

        {req.is_test_data && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 mb-6">
            <FileWarning size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800">
              This is <strong>test data</strong> for demonstration only. Not an official requirement.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.label}>
              <div className="flex items-center gap-2 mb-1">
                <f.icon size={15} className="text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90 pl-6">{f.value || '—'}</p>
            </div>
          ))}

          {req.official_link && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link2 size={15} className="text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Official application link</span>
              </div>
              <a href={req.official_link} target="_blank" rel="noreferrer" className="text-sm text-primary underline pl-6 flex items-center gap-1">
                Open link <ExternalLink size={13} />
              </a>
            </div>
          )}

          <div className="pt-2 border-t border-border">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={15} className="text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Source</span>
            </div>
            <p className="text-sm text-foreground/90 pl-6">{req.source || '—'}</p>
            {req.source_url && (
              <a href={req.source_url} target="_blank" rel="noreferrer" className="text-sm text-primary underline pl-6 mt-1 flex items-center gap-1">
                Official source <ExternalLink size={13} />
              </a>
            )}
            <p className="text-xs text-muted-foreground pl-6 mt-1">
              Last verified: {req.last_verified_date || '—'}
            </p>
            </div>
        </div>
      </div>
    </div>
  );
}