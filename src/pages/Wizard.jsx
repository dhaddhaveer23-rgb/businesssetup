import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import BusinessTypeIcon from '@/components/BusinessTypeIcon';

export default function Wizard() {
  const navigate = useNavigate();
  const [businessTypes, setBusinessTypes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({
    country: 'SG',
    business_type: '',
    business_type_id: '',
    business_name: '',
    has_employees: null,
    has_premises: null
  });

  useEffect(() => {
    Promise.all([
      base44.entities.BusinessType.filter({ country_code: 'SG' }),
      base44.entities.BusinessQuestion.filter({ country_code: 'SG' })
    ])
      .then(([types, qs]) => {
        setBusinessTypes(types);
        setQuestions(qs);
      })
      .finally(() => setLoading(false));
  }, []);

  const additionalQuestions = useMemo(
    () => questions.filter((q) => q.business_type_id && q.business_type_id === answers.business_type_id && q.step >= 6),
    [questions, answers.business_type_id]
  );

  const steps = useMemo(() => {
    const base = [
      { key: 'country', title: 'Country' },
      { key: 'business_type', title: 'Business type' },
      { key: 'business_name', title: 'Business name' },
      { key: 'has_employees', title: 'Employees' },
      { key: 'has_premises', title: 'Premises' }
    ];
    if (additionalQuestions.length > 0) {
      base.push({ key: 'additional', title: 'Details' });
    }
    return base;
  }, [additionalQuestions]);

  const current = steps[stepIndex];
  const total = steps.length;
  const progress = ((stepIndex + 1) / total) * 100;

  const canProceed = () => {
    if (!current) return false;
    if (current.key === 'country') return !!answers.country;
    if (current.key === 'business_type') return !!answers.business_type_id;
    if (current.key === 'business_name') return true;
    if (current.key === 'has_employees') return answers.has_employees !== null;
    if (current.key === 'has_premises') return answers.has_premises !== null;
    if (current.key === 'additional') {
      return additionalQuestions.every((q) => answers[q.question_key] !== undefined && answers[q.question_key] !== null);
    }
    return false;
  };

  const handleNext = () => {
    if (stepIndex < total - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      const selectedType = businessTypes.find((t) => t.id === answers.business_type_id);
      const business = await base44.entities.UserBusiness.create({
        name: answers.business_name || `My ${selectedType?.name || 'Business'}`,
        business_type: selectedType?.name || '',
        business_type_id: answers.business_type_id,
        country_code: answers.country,
        answers,
        checklist_progress: 0,
        status: 'in_progress'
      });

      // Fetch all SG requirements and filter
      const allReqs = await base44.entities.Requirement.filter({ country_code: answers.country });
      const hasEmp = answers.has_employees === true;
      const hasPrem = answers.has_premises === true;
      const matched = allReqs.filter((r) => {
        const btOk = !r.business_type_id || r.business_type_id === answers.business_type_id;
        const empOk = r.applies_to_employees === null || r.applies_to_employees === undefined || r.applies_to_employees === hasEmp;
        const premOk = r.applies_to_premises === null || r.applies_to_premises === undefined || r.applies_to_premises === hasPrem;
        return btOk && empOk && premOk;
      });

      if (matched.length > 0) {
        await base44.entities.ChecklistItem.bulkCreate(
          matched.map((r) => ({
            user_business_id: business.id,
            requirement_id: r.id,
            requirement_name: r.name,
            category: r.category,
            completed: false
          }))
        );
      }
      navigate(`/checklist/${business.id}`, { replace: true });
    } catch (e) {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="max-w-md mx-auto w-full px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => (stepIndex === 0 ? navigate(-1) : setStepIndex(stepIndex - 1))}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-sm font-medium text-muted-foreground">
            Step {stepIndex + 1} of {total}
          </span>
          <div className="w-9" />
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-md mx-auto w-full px-6 py-6">
        {current?.key === 'country' && (
          <Step title="What country are you starting in?" subtitle="We'll tailor requirements to your country.">
            <div className="space-y-3">
              {[
                { code: 'SG', name: 'Singapore', flag: '🇸🇬' }
              ].map((c) => (
                <button
                  key={c.code}
                  onClick={() => setAnswers({ ...answers, country: c.code })}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition text-left ${
                    answers.country === c.code ? 'border-primary bg-primary/5' : 'border-border bg-card'
                  }`}
                >
                  <span className="text-3xl">{c.flag}</span>
                  <span className="flex-1 font-medium">{c.name}</span>
                  {answers.country === c.code && <Check size={20} className="text-primary" />}
                </button>
              ))}
            </div>
          </Step>
        )}

        {current?.key === 'business_type' && (
          <Step title="What type of business are you starting?" subtitle="Choose the closest match.">
            <div className="grid grid-cols-2 gap-3">
              {businessTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setAnswers({ ...answers, business_type: t.name, business_type_id: t.id })}
                  className={`p-4 rounded-2xl border transition text-left flex flex-col gap-2 ${
                    answers.business_type_id === t.id ? 'border-primary bg-primary/5' : 'border-border bg-card'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${answers.business_type_id === t.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    <BusinessTypeIcon name={t.icon} size={18} />
                  </div>
                  <span className="text-sm font-medium leading-tight">{t.name}</span>
                </button>
              ))}
            </div>
          </Step>
        )}

        {current?.key === 'business_name' && (
          <Step title="What will you call your business?" subtitle="This is optional — you can change it later.">
            <input
              type="text"
              value={answers.business_name}
              onChange={(e) => setAnswers({ ...answers, business_name: e.target.value })}
              placeholder="e.g. Sunrise Café"
              className="w-full p-4 rounded-2xl border border-border bg-card text-base outline-none focus:border-primary transition"
            />
            <button
              onClick={() => setAnswers({ ...answers, business_name: '' })}
              className="text-sm text-muted-foreground mt-3"
            >
              Skip this step
            </button>
          </Step>
        )}

        {current?.key === 'has_employees' && (
          <Step title="Will you have employees?" subtitle="This includes full-time, part-time or contract staff.">
            <YesNo value={answers.has_employees} onChange={(v) => setAnswers({ ...answers, has_employees: v })} />
          </Step>
        )}

        {current?.key === 'has_premises' && (
          <Step title="Will you operate from physical premises?" subtitle="A shop, office, kiosk or other physical location.">
            <YesNo value={answers.has_premises} onChange={(v) => setAnswers({ ...answers, has_premises: v })} />
          </Step>
        )}

        {current?.key === 'additional' && (
          <Step title="A few more details" subtitle="Based on your business type.">
            <div className="space-y-6">
              {additionalQuestions.map((q) => (
                <div key={q.id}>
                  <p className="font-medium text-base mb-1">{q.question}</p>
                  {q.help_text && <p className="text-sm text-muted-foreground mb-3">{q.help_text}</p>}
                  {q.input_type === 'boolean' ? (
                    <YesNo value={answers[q.question_key]} onChange={(v) => setAnswers({ ...answers, [q.question_key]: v })} compact />
                  ) : (
                    <input
                      type="text"
                      value={answers[q.question_key] || ''}
                      onChange={(e) => setAnswers({ ...answers, [q.question_key]: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-border bg-card outline-none focus:border-primary transition"
                    />
                  )}
                </div>
              ))}
            </div>
          </Step>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto w-full px-6 pb-8 pt-2">
        <button
          onClick={handleNext}
          disabled={!canProceed() || saving}
          className="w-full rounded-2xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 py-3.5 disabled:opacity-40 transition"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
          ) : stepIndex === total - 1 ? (
            'See my checklist'
          ) : (
            <>
              Continue <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Step({ title, subtitle, children }) {
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight mb-1.5">{title}</h1>
      <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>
      {children}
    </div>
  );
}

function YesNo({ value, onChange, compact }) {
  const size = compact ? 'py-3' : 'py-4';
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() => onChange(true)}
        className={`${size} rounded-2xl border transition font-medium ${value === true ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card'}`}
      >
        Yes
      </button>
      <button
        onClick={() => onChange(false)}
        className={`${size} rounded-2xl border transition font-medium ${value === false ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card'}`}
      >
        No
      </button>
    </div>
  );
}