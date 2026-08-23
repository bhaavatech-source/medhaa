import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../utils/authFetch';

type Audience = 'individual' | 'teacher' | 'school';

type Plan = {
  id: string;
  name: string;
  amountPaise: number;
  durationDays?: number;
  limitedOffer?: boolean;
  [key: string]: any;
};

type IndividualChildCount = 1 | 2;
type IndividualDuration = 'monthly' | 'yearly';

type InstitutionalProfile = {
  size: string;
  classes: string;
  needs: string[];
  implementation?: string;
};

const BENEFIT_ICONS: Record<string, string> = {
  'Unlimited access to every game, no daily play limit': '🎮',
  'Full IQ, EQ & SQ progress reports after every session': '🧠',
  'Weekly Medhā Score tracking and trend charts': '📈',
  'Priority access to new games as they launch': '🚀',
  'Downloadable report cards for school submission': '📄',
};

const BENEFIT_META: Record<string, { title: string; color: string }> = {
  'Unlimited access to every game, no daily play limit': { title: 'Unlimited Play', color: '#f59e0b' },
  'Full IQ, EQ & SQ progress reports after every session': { title: 'Full Progress Reports', color: '#3b82f6' },
  'Weekly Medhā Score tracking and trend charts': { title: 'Medhā Score Tracking', color: '#6366f1' },
  'Priority access to new games as they launch': { title: 'Priority Access', color: '#10b981' },
  'Downloadable report cards for school submission': { title: 'School Report Cards', color: '#10b981' },
};

const PLAN_FEATURES: Record<string, string[]> = {
  MONTHLY_1: ['1 Child Profile', 'Medhā Cognitive Games', 'My Medhā (Pro)', 'Medhā Score & Progress', 'Achievements'],
  MONTHLY_2: ['2 Child Profiles', 'Medhā Cognitive Games', 'My Medhā (Pro)', 'Individual Medhā Score & Progress', 'Family Access'],
  YEARLY_1: ['1 Child Profile', 'My Medhā (Pro)', 'Medhā Score & Progress', 'Skill-wise Insights', 'Long-term Progress History', 'Better Annual Value'],
  YEARLY_2: ['2 Child Profiles', 'My Medhā (Pro)', 'Individual Medhā Score & Progress', 'Individual Insights', 'Long-term Progress History', 'Best Family Value'],
};

const PLAN_BADGE: Record<string, { label: string; bg: string } | undefined> = {
  YEARLY_1: { label: 'MOST POPULAR', bg: 'linear-gradient(90deg,#6366f1,#a855f7)' },
  YEARLY_2: { label: 'LIMITED OFFER', bg: 'linear-gradient(90deg,#f59e0b,#ef4444)' },
};

const TEACHER_NEEDS = [
  'Student activities',
  'Progress insights',
  'Class planning',
  'Assignments',
  'Reports',
];

const SCHOOL_NEEDS = [
  'Student activities',
  'Teacher workspace',
  'Parent visibility',
  'Progress reports',
  'School analytics',
];

const INDIVIDUAL_COPY = {
  title: 'For Students & Parents',
  subtitle: 'Choose the number of children and the access period that fits your family.',
};

function getPlanForIndividual(plans: Plan[], children: IndividualChildCount, duration: IndividualDuration) {
  const targetId =
    duration === 'monthly'
      ? children === 1 ? 'MONTHLY_1' : 'MONTHLY_2'
      : children === 1 ? 'YEARLY_1' : 'YEARLY_2';

  return plans.find((plan) => plan.id === targetId) ?? null;
}

function formatCurrency(amountPaise: number) {
  return `₹${(amountPaise / 100).toFixed(0)}`;
}

function toggleListValue(current: string[], value: string) {
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
}

export function SubscribePage({ apiUrl }: { apiUrl: string }) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [audience, setAudience] = useState<Audience>('individual');
  const [children, setChildren] = useState<IndividualChildCount>(1);
  const [duration, setDuration] = useState<IndividualDuration>('monthly');
  const [roleChoiceOpen, setRoleChoiceOpen] = useState(false);
  const [selectedInstitutionalPlan, setSelectedInstitutionalPlan] = useState('');
  const [institutionSubmitted, setInstitutionSubmitted] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState<InstitutionalProfile>({
    size: '1–25 students',
    classes: '1 class',
    needs: ['Student activities', 'Progress insights'],
  });
  const [schoolProfile, setSchoolProfile] = useState<InstitutionalProfile>({
    size: '100–300 students',
    classes: '11–25 teachers',
    needs: ['Student activities', 'Teacher workspace', 'Progress reports'],
    implementation: 'Multiple grades',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/subscriptions/plans`)
      .then((res) => {
        if (!res.ok) throw new Error('Plans request failed');
        return res.json();
      })
      .then((data) => {
        setPlans(data.plans || []);
        setBenefits(data.benefits || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load plans. Please try again.');
        setLoading(false);
      });
  }, [apiUrl]);

  const selectedIndividualPlan = useMemo(
    () => getPlanForIndividual(plans, children, duration),
    [plans, children, duration],
  );

  const teacherRecommendation = useMemo(() => {
    const count = teacherProfile.size;
    const classes = teacherProfile.classes;
    if (count === '100+ students' || classes === '4+ classes' || teacherProfile.needs.length >= 4) {
      return 'Teacher Pro';
    }
    if (count === '51–100 students' || classes === '2–3 classes' || teacherProfile.needs.length >= 3) {
      return 'Teacher Plus';
    }
    return 'Teacher Starter';
  }, [teacherProfile]);

  const schoolRecommendation = useMemo(() => {
    const size = schoolProfile.size;
    const implementation = schoolProfile.implementation;
    if (size === '700+ students' || implementation === 'Whole school') return 'School Campus';
    if (size === '300–700 students' || implementation === 'Multiple grades') return 'School Growth';
    return 'School Starter';
  }, [schoolProfile]);

  async function chooseIndividualPlan() {
    if (!selectedIndividualPlan) {
      setError('The selected plan is not available right now.');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setRoleChoiceOpen(true);
      return;
    }

    setError('');
    const res = await authFetch(`${apiUrl}/subscriptions/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: selectedIndividualPlan.id }),
    });

    if (res.ok) {
      const data = await res.json();
      navigate('/subscribe/pay', {
        state: {
          subscriptionId: data.subscriptionId,
          amount: data.amount,
          plan: data.plan,
          upiId: data.upiId,
        },
      });
      return;
    }

    let message = 'Could not start subscription. Please try again.';
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // Keep the default message.
    }
    setError(message);
  }

  function submitInstitutionalEnquiry() {
    const isTeacher = audience === 'teacher';
    const profile = isTeacher ? teacherProfile : schoolProfile;
    const plan = isTeacher ? teacherRecommendation : schoolRecommendation;

    setSelectedInstitutionalPlan(plan);
    setInstitutionSubmitted(true);

    const subject = encodeURIComponent(`Medhā ${isTeacher ? 'Teacher' : 'School'} Plan Enquiry — ${plan}`);
    const bodyLines = [
      `Audience: ${isTeacher ? 'Teacher' : 'School'}`,
      `Recommended plan: ${plan}`,
      `Student range: ${profile.size}`,
      isTeacher ? `Classes: ${profile.classes}` : `Teacher range: ${profile.classes}`,
      isTeacher ? '' : `Implementation: ${profile.implementation || ''}`,
      `Needs: ${profile.needs.join(', ')}`,
      '',
      'Please contact me regarding the selected Medhā institutional setup.',
    ].filter(Boolean);

    // Temporary structured hand-off until an institutional enquiry endpoint exists.
    window.location.href = `mailto:support@medhaa.net?subject=${subject}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
  }

  if (loading) {
    return <div style={{ padding: 48, textAlign: 'center', color: '#475569' }}>Loading Medhā plans…</div>;
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg,#f7fbff 0%,#f5f3ff 48%,#ffffff 100%)',
        color: '#172033',
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '22px 20px 64px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              padding: '9px 18px',
              borderRadius: 999,
              border: '1px solid #c7d2fe',
              background: '#fff',
              color: '#4f46e5',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ← Home
          </button>
          <span style={{ fontWeight: 800, color: '#64748b', fontSize: 14 }}>Medhā Plans</span>
        </header>

        <section style={{ textAlign: 'center', marginBottom: 34 }}>
          <span
            style={{
              display: 'inline-flex',
              padding: '7px 14px',
              borderRadius: 999,
              background: '#eef2ff',
              color: '#4f46e5',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '.06em',
            }}
          >
            CHOOSE YOUR MEDHĀ EXPERIENCE
          </span>
          <h1 style={{ margin: '14px 0 8px', fontSize: 'clamp(30px,5vw,48px)', lineHeight: 1.05, fontWeight: 900 }}>
            A plan that fits the way you use Medhā.
          </h1>
          <p style={{ maxWidth: 720, margin: '0 auto', color: '#64748b', fontSize: 16, lineHeight: 1.6 }}>
            Start with a family plan, configure a teacher setup, or shape a school implementation around your actual needs.
          </p>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 10, marginBottom: 30 }}>
          {([
            ['individual', '👨‍👩‍👧', 'Student / Parent', 'Individual access'],
            ['teacher', '👩‍🏫', 'Teacher', 'Classroom use'],
            ['school', '🏫', 'School', 'Institutional use'],
          ] as const).map(([key, icon, title, subtitle]) => (
            <button
              key={key}
              type="button"
              onClick={() => { setAudience(key); setError(''); setInstitutionSubmitted(false); }}
              style={{
                border: audience === key ? '2px solid #6366f1' : '1px solid #dbe2ef',
                background: audience === key ? '#eef2ff' : '#fff',
                borderRadius: 20,
                padding: '15px 12px',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: audience === key ? '0 10px 28px rgba(99,102,241,.10)' : '0 4px 16px rgba(15,23,42,.04)',
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontWeight: 900 }}>{title}</div>
              <div style={{ color: '#64748b', fontSize: 12 }}>{subtitle}</div>
            </button>
          ))}
        </section>

        {error && (
          <div style={{ maxWidth: 900, margin: '0 auto 20px', padding: '12px 16px', borderRadius: 14, background: '#fff1f2', color: '#be123c', fontWeight: 700 }}>
            {error}
          </div>
        )}

        {audience === 'individual' && (
          <section style={{ maxWidth: 980, margin: '0 auto' }}>
            <div style={{ background: '#fff', borderRadius: 28, padding: '28px 24px', boxShadow: '0 18px 50px rgba(15,23,42,.07)', border: '1px solid #e6eaf2' }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>{INDIVIDUAL_COPY.title}</h2>
                <p style={{ color: '#64748b', margin: '8px auto 0', maxWidth: 620 }}>{INDIVIDUAL_COPY.subtitle}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 18 }}>
                <div style={{ padding: 18, background: '#f8fafc', borderRadius: 20 }}>
                  <span style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748b', marginBottom: 10 }}>NUMBER OF CHILDREN</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[1, 2].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setChildren(count as IndividualChildCount)}
                        style={{
                          padding: '14px 12px',
                          borderRadius: 15,
                          border: children === count ? '2px solid #6366f1' : '1px solid #dbe2ef',
                          background: children === count ? '#eef2ff' : '#fff',
                          cursor: 'pointer',
                          fontWeight: 900,
                          color: children === count ? '#4338ca' : '#334155',
                        }}
                      >
                        {count} {count === 1 ? 'Child' : 'Children'}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ padding: 18, background: '#f8fafc', borderRadius: 20 }}>
                  <span style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748b', marginBottom: 10 }}>ACCESS PERIOD</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {(['monthly', 'yearly'] as const).map((period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => setDuration(period)}
                        style={{
                          padding: '14px 12px',
                          borderRadius: 15,
                          border: duration === period ? '2px solid #6366f1' : '1px solid #dbe2ef',
                          background: duration === period ? '#eef2ff' : '#fff',
                          cursor: 'pointer',
                          fontWeight: 900,
                          color: duration === period ? '#4338ca' : '#334155',
                        }}
                      >
                        {period === 'monthly' ? 'Monthly' : 'Yearly'}
                        {period === 'yearly' && <span style={{ display: 'block', fontSize: 11, color: '#059669', marginTop: 3 }}>Best value</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {selectedIndividualPlan && (
                <div style={{ marginTop: 18, padding: 22, borderRadius: 22, background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)', border: '1px solid #d9ddff' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#6366f1' }}>RECOMMENDED FOR YOUR SELECTION</span>
                      <h3 style={{ margin: '5px 0 4px', fontSize: 23, fontWeight: 900 }}>{selectedIndividualPlan.name.replace(' (Limited Offer)', '')}</h3>
                      <p style={{ margin: 0, color: '#64748b' }}>{children} {children === 1 ? 'child' : 'children'} · {duration === 'monthly' ? '30 days' : '1 year'}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 34, fontWeight: 900, color: '#4338ca' }}>{formatCurrency(selectedIndividualPlan.amountPaise)}</div>
                      <div style={{ color: '#64748b', fontSize: 12 }}>{duration === 'monthly' ? 'per month' : 'per year'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 9, marginTop: 18 }}>
                    {(PLAN_FEATURES[selectedIndividualPlan.id] || []).map((feature) => (
                      <span key={feature} style={{ padding: '9px 11px', borderRadius: 12, background: '#fff', color: '#334155', fontSize: 12.5, fontWeight: 700 }}>✓ {feature}</span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={chooseIndividualPlan}
                    style={{ width: '100%', marginTop: 20, padding: 14, borderRadius: 999, border: 'none', background: 'linear-gradient(90deg,#6366f1,#a855f7)', color: '#fff', fontWeight: 900, fontSize: 15, cursor: 'pointer' }}
                  >
                    Continue to Payment
                  </button>
                </div>
              )}
            </div>

            {benefits.length > 0 && (
              <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
                {benefits.map((benefit) => {
                  const meta = BENEFIT_META[benefit] || { title: benefit, color: '#6366f1' };
                  return (
                    <article key={benefit} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 18, padding: 16, boxShadow: '0 6px 22px rgba(15,23,42,.04)' }}>
                      <div style={{ fontSize: 23 }}>{BENEFIT_ICONS[benefit] || '⭐'}</div>
                      <strong style={{ display: 'block', marginTop: 8, color: meta.color }}>{meta.title}</strong>
                      <p style={{ margin: '5px 0 0', color: '#64748b', fontSize: 12.5, lineHeight: 1.45 }}>{benefit}</p>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {audience === 'teacher' && (
          <InstitutionConfigurator
            title="Build your Teacher setup"
            subtitle="Choose how you teach, how many students you work with, and what you want Medhā to support."
            profile={teacherProfile}
            setProfile={setTeacherProfile}
            needs={TEACHER_NEEDS}
            recommendation={teacherRecommendation}
            planDescription="A classroom-focused setup based on your selections. Institutional pricing can be finalized after we review your requirements."
            onSubmit={submitInstitutionalEnquiry}
            submitted={institutionSubmitted}
            selectedPlan={selectedInstitutionalPlan || teacherRecommendation}
            teacher
          />
        )}

        {audience === 'school' && (
          <InstitutionConfigurator
            title="Configure your School implementation"
            subtitle="Build a school setup around student scale, teacher coverage, implementation scope and reporting needs."
            profile={schoolProfile}
            setProfile={setSchoolProfile}
            needs={SCHOOL_NEEDS}
            recommendation={schoolRecommendation}
            planDescription="A school-wide configuration based on your selections. Pricing and implementation can be customized to the actual requirement."
            onSubmit={submitInstitutionalEnquiry}
            submitted={institutionSubmitted}
            selectedPlan={selectedInstitutionalPlan || schoolRecommendation}
          />
        )}
      </div>

      {roleChoiceOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.45)', display: 'grid', placeItems: 'center', padding: 20, zIndex: 1000 }}>
          <div style={{ width: 'min(460px,100%)', background: '#fff', borderRadius: 24, padding: 26, boxShadow: '0 24px 70px rgba(15,23,42,.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 23 }}>Continue as</h3>
              <button type="button" onClick={() => setRoleChoiceOpen(false)} style={{ border: 'none', background: 'transparent', fontSize: 24, cursor: 'pointer', color: '#64748b' }}>×</button>
            </div>
            <p style={{ color: '#64748b', lineHeight: 1.5, marginTop: 8 }}>Choose the account type you want to use for the individual subscription.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18 }}>
              <button
                type="button"
                onClick={() => navigate('/login/student')}
                style={{ padding: '16px 12px', borderRadius: 16, border: '1px solid #c7d2fe', background: '#eef2ff', color: '#4338ca', fontWeight: 900, cursor: 'pointer' }}
              >
                👩‍🎓 Student Login
              </button>
              <button
                type="button"
                onClick={() => navigate('/login/parent')}
                style={{ padding: '16px 12px', borderRadius: 16, border: '1px solid #dbe2ef', background: '#f8fafc', color: '#334155', fontWeight: 900, cursor: 'pointer' }}
              >
                👨‍👩‍👧 Parent Login
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function InstitutionConfigurator({
  title,
  subtitle,
  profile,
  setProfile,
  needs,
  recommendation,
  planDescription,
  onSubmit,
  submitted,
  selectedPlan,
  teacher = false,
}: {
  title: string;
  subtitle: string;
  profile: InstitutionalProfile;
  setProfile: Dispatch<SetStateAction<InstitutionalProfile>>;
  needs: string[];
  recommendation: string;
  planDescription: string;
  onSubmit: () => void;
  submitted: boolean;
  selectedPlan: string;
  teacher?: boolean;
}) {
  const update = (patch: Partial<InstitutionalProfile>) => setProfile((current) => ({ ...current, ...patch }));

  const sizeOptions = teacher
    ? ['1–25 students', '26–50 students', '51–100 students', '100+ students']
    : ['<100 students', '100–300 students', '300–700 students', '700+ students'];

  const classOptions = teacher
    ? ['1 class', '2–3 classes', '4+ classes']
    : ['1–10 teachers', '11–25 teachers', '26–50 teachers', '50+ teachers'];

  return (
    <section style={{ maxWidth: 1040, margin: '0 auto' }}>
      <div style={{ background: '#fff', borderRadius: 28, padding: '28px 24px', boxShadow: '0 18px 50px rgba(15,23,42,.07)', border: '1px solid #e6eaf2' }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 26px' }}>
          <h2 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>{title}</h2>
          <p style={{ margin: '8px 0 0', color: '#64748b', lineHeight: 1.6 }}>{subtitle}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 16 }}>
          <ChoiceGroup title={teacher ? 'Student reach' : 'Student population'} options={sizeOptions} value={profile.size} onChange={(value) => update({ size: value })} />
          <ChoiceGroup title={teacher ? 'Teaching scope' : 'Teacher coverage'} options={classOptions} value={profile.classes} onChange={(value) => update({ classes: value })} />
        </div>

        {!teacher && (
          <div style={{ marginTop: 16 }}>
            <span style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748b', marginBottom: 10 }}>IMPLEMENTATION SCOPE</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 10 }}>
              {['Pilot', 'One grade', 'Multiple grades', 'Whole school'].map((value) => (
                <SelectTile key={value} selected={profile.implementation === value} label={value} onClick={() => update({ implementation: value })} />
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 18 }}>
          <span style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748b', marginBottom: 10 }}>WHAT WOULD YOU LIKE MEDHĀ TO SUPPORT?</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 10 }}>
            {needs.map((need) => {
              const selected = profile.needs.includes(need);
              return (
                <button
                  key={need}
                  type="button"
                  onClick={() => update({ needs: toggleListValue(profile.needs, need) })}
                  style={{
                    textAlign: 'left',
                    padding: '12px 13px',
                    borderRadius: 14,
                    border: selected ? '2px solid #6366f1' : '1px solid #dbe2ef',
                    background: selected ? '#eef2ff' : '#fff',
                    color: selected ? '#4338ca' : '#334155',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ marginRight: 7 }}>{selected ? '✓' : '○'}</span>{need}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 22, padding: 20, borderRadius: 22, background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)', border: '1px solid #d9ddff' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14, alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#6366f1' }}>RECOMMENDED BASED ON YOUR SELECTIONS</span>
              <h3 style={{ margin: '5px 0 4px', fontSize: 24, fontWeight: 900 }}>{recommendation}</h3>
              <p style={{ margin: 0, maxWidth: 680, color: '#64748b', lineHeight: 1.5 }}>{planDescription}</p>
            </div>
            <span style={{ padding: '9px 13px', borderRadius: 999, background: '#fff', color: '#4338ca', fontWeight: 900, fontSize: 12 }}>Customized pricing</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 9, marginTop: 16 }}>
            <SummaryChip label={teacher ? 'Students' : 'Students'} value={profile.size} />
            <SummaryChip label={teacher ? 'Classes' : 'Teachers'} value={profile.classes} />
            {!teacher && <SummaryChip label="Implementation" value={profile.implementation || 'Not set'} />}
            <SummaryChip label="Needs selected" value={`${profile.needs.length}`} />
          </div>

          <button
            type="button"
            onClick={onSubmit}
            style={{ width: '100%', marginTop: 18, padding: 14, borderRadius: 999, border: 'none', background: 'linear-gradient(90deg,#6366f1,#a855f7)', color: '#fff', fontWeight: 900, fontSize: 15, cursor: 'pointer' }}
          >
            {submitted ? `Plan Selected: ${selectedPlan}` : `Request ${recommendation}`}
          </button>

          {submitted && (
            <div style={{ marginTop: 11, padding: '10px 13px', borderRadius: 12, background: '#ecfdf5', color: '#047857', fontSize: 12.5, fontWeight: 700 }}>
              Your structured plan summary has been prepared for the next enquiry step.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ChoiceGroup({ title, options, value, onChange }: { title: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <div style={{ padding: 18, background: '#f8fafc', borderRadius: 20 }}>
      <span style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748b', marginBottom: 10 }}>{title.toUpperCase()}</span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 9 }}>
        {options.map((option) => (
          <SelectTile key={option} selected={value === option} label={option} onClick={() => onChange(option)} />
        ))}
      </div>
    </div>
  );
}

function SelectTile({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '12px 10px',
        borderRadius: 14,
        border: selected ? '2px solid #6366f1' : '1px solid #dbe2ef',
        background: selected ? '#eef2ff' : '#fff',
        color: selected ? '#4338ca' : '#334155',
        fontWeight: 800,
        cursor: 'pointer',
        fontSize: 13,
      }}
    >
      {selected ? '✓ ' : ''}{label}
    </button>
  );
}

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '10px 12px', border: '1px solid #e4e7ef' }}>
      <span style={{ display: 'block', color: '#94a3b8', fontSize: 10.5, fontWeight: 800 }}>{label.toUpperCase()}</span>
      <strong style={{ display: 'block', marginTop: 2, color: '#334155', fontSize: 12.5 }}>{value}</strong>
    </div>
  );
}

export default SubscribePage;
