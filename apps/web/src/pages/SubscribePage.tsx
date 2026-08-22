import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../utils/authFetch';
import medhaaIcon from '../assets/logo/medhaa-icon.svg';

type Plan = {
  id: string;
  name: string;
  amountPaise: number;
  durationDays?: number;
  limitedOffer?: boolean;
  [key: string]: any;
};

const BENEFIT_ICONS: Record<string, string> = {
  'Unlimited access to every game, no daily play limit': '🎮',
  'Full IQ, EQ, SQ, & Eingineering Score progress reports after every session': '🧠',
  'Weekly brain-score tracking and trend charts': '📈',
  'Priority access to new games as they launch': '🚀',
  'Downloadable report cards for school submission': '📄',
};

const BENEFIT_META: Record<string, { title: string; color: string }> = {
  'Unlimited access to every game, no daily play limit': {
    title: 'Unlimited Play',
    color: '#f59e0b',
  },
  'Full IQ, EQ & SQ progress reports after every session': {
    title: 'Full Progress Reports',
    color: '#3b82f6',
  },
  'Weekly brain-score tracking and trend charts': {
    title: 'Brain-Score Tracking',
    color: '#3b82f6',
  },
  'Priority access to new games as they launch': {
    title: 'Priority Access',
    color: '#10b981',
  },
  'Downloadable report cards for school submission': {
    title: 'School Report Cards',
    color: '#10b981',
  },
};

const PLAN_FEATURES: Record<string, string[]> = {
  MONTHLY_1: [
    '1 Child Profile',
    'Medhaa Cognitive Games',
    'Progress Tracking',
    'Performance Insights',
    'Achievements',
  ],
  MONTHLY_2: [
    '2 Child Profiles',
    'Medhaa Cognitive Games',
    'Individual Progress Tracking',
    'Individual Insights',
    'Family Access',
  ],
  YEARLY_1: [
    '1 Child Profile',
    'Full Medhaa Access',
    'Progress Tracking',
    'Skill-wise Insights',
    'Long-term Progress History',
    'Better Annual Value',
  ],
  YEARLY_2: [
    '2 Child Profiles',
    'Full Medhaa Access',
    'Individual Progress Tracking',
    'Individual Insights',
    'Long-term Progress History',
    'Best Family Value',
  ],
};

const PLAN_BADGE: Record<
  string,
  { label: string; bg: string } | undefined
> = {
  YEARLY_1: {
    label: 'MOST POPULAR',
    bg: 'linear-gradient(90deg,#6366f1,#a855f7)',
  },
  YEARLY_2: {
    label: 'LIMITED OFFER',
    bg: 'linear-gradient(90deg,#f59e0b,#ef4444)',
  },
};

type AccountRole = 'student' | 'parent' | 'teacher' | 'school' | null;

function getLoggedInRole(): AccountRole {
  const token = localStorage.getItem('accessToken');

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = String(payload.role || '').toLowerCase();

    if (
      role === 'student' ||
      role === 'parent' ||
      role === 'teacher' ||
      role === 'school'
    ) {
      return role;
    }

    return null;
  } catch {
    return null;
  }
}

export function SubscribePage({ apiUrl }: { apiUrl: string }) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/subscriptions/plans`)
      .then((res) => res.json())
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

  async function startSubscription(planId: string) {
    setError('');

    try {
      const res = await authFetch(
        `${apiUrl}/subscriptions/initiate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ planId }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          data.error ||
            'Could not start the subscription. Please try again.'
        );
        return;
      }

      navigate('/subscribe/pay', {
        state: {
          subscriptionId: data.subscriptionId,
          amount: data.amount,
          plan: data.plan,
          upiId: data.upiId,
        },
      });
    } catch {
      setError('Could not connect to Medhā. Please try again.');
    }
  }

  function choosePlan(planId: string) {
    const role = getLoggedInRole();

    /*
     * No account yet:
     * Ask the visitor to choose whether they are a
     * Parent or Student before continuing.
     */
    if (!role) {
      sessionStorage.setItem('pendingPlanId', planId);
      navigate('/login');
      return;
    }

    /*
     * Individual subscription accounts
     */
    if (role === 'student' || role === 'parent') {
      startSubscription(planId);
      return;
    }

    /*
     * Institutional accounts
     */
    if (role === 'teacher' || role === 'school') {
      setError(
        'Teacher and School accounts use institutional plans. Please contact Medhā for access and pricing.'
      );
      return;
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        Loading plans…
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1040,
        margin: '0 auto',
        padding: '24px 24px 60px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '8px 18px',
            borderRadius: 999,
            border: '1.5px solid #6366f1',
            background: '#fff',
            color: '#6366f1',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Home
        </button>

        <img
          src={medhaaIcon}
          alt="Medhā"
          style={{
            width: 42,
            height: 42,
            objectFit: 'contain',
          }}
        />
      </div>

      <h1
        style={{
          fontWeight: 800,
          marginBottom: 6,
          textAlign: 'center',
          fontSize: 32,
          background:
            'linear-gradient(90deg,#6366f1,#a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Unlock Your Child's Full Potential
      </h1>

      <p
        style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: 32,
        }}
      >
        Everything you get with a Medhā individual subscription
      </p>

      {benefits.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
            marginBottom: 48,
          }}
        >
          {benefits.map((b, i) => {
            const meta =
              BENEFIT_META[b] || {
                title: b,
                color: '#6366f1',
              };

            const icon = BENEFIT_ICONS[b] || '⭐';

            return (
              <div
                key={i}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: '24px 20px 22px',
                  textAlign: 'center',
                  boxShadow:
                    '0 2px 10px rgba(15,23,42,0.06)',
                  border: '1px solid #eef0f4',
                  borderTopWidth: 4,
                  borderTopStyle: 'solid',
                  borderTopColor: meta.color,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    margin: '0 auto 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                    background: `conic-gradient(${meta.color} 0deg 260deg, #e5e7eb 260deg 360deg)`,
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                    }}
                  >
                    {icon}
                  </div>
                </div>

                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    marginBottom: 10,
                    color: '#1f2937',
                  }}
                >
                  {meta.title}
                </h3>

                <span
                  style={{
                    display: 'inline-block',
                    background: meta.color,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 700,
                    borderRadius: 999,
                    padding: '4px 14px',
                    marginBottom: 10,
                  }}
                >
                  Included
                </span>

                <p
                  style={{
                    fontSize: 13,
                    color: '#555',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {b}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <h2
        style={{
          fontWeight: 800,
          textAlign: 'center',
          marginBottom: 6,
          fontSize: 26,
          color: '#1f2937',
        }}
      >
        Choose Your Medhā Plan
      </h2>

      <p
        style={{
          textAlign: 'center',
          color: '#6b7280',
          marginBottom: 32,
          fontSize: 15,
        }}
      >
        Designed for students and families who want
        continuous access to Medhā.
      </p>

      {error && (
        <div
          style={{
            maxWidth: 720,
            margin: '0 auto 20px',
            padding: '14px 18px',
            borderRadius: 12,
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            color: '#9a3412',
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          {error}

          <div style={{ marginTop: 10 }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                border: 'none',
                background: '#6366f1',
                color: '#fff',
                padding: '8px 18px',
                borderRadius: 999,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Contact Medhā
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 20,
          alignItems: 'stretch',
        }}
      >
        {plans.map((plan) => {
          const isYearly =
            (plan.durationDays ?? 30) >= 300;

          const badge = PLAN_BADGE[plan.id];
          const features =
            PLAN_FEATURES[plan.id] || [];

          const isHighlighted = !!badge;

          return (
            <div
              key={plan.id}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isHighlighted
                  ? '2px solid #6366f1'
                  : '1.5px solid #e5e7eb',
                borderRadius: 18,
                padding: '28px 20px 24px',
                textAlign: 'center',
                background: '#fff',
                boxShadow: isHighlighted
                  ? '0 8px 24px rgba(99,102,241,0.15)'
                  : '0 1px 4px rgba(15,23,42,0.04)',
                transform: isHighlighted
                  ? 'translateY(-4px)'
                  : 'none',
              }}
            >
              {badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: -13,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: badge.bg,
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: 0.5,
                    padding: '5px 14px',
                    borderRadius: 999,
                    whiteSpace: 'nowrap',
                    boxShadow:
                      '0 2px 6px rgba(0,0,0,0.15)',
                  }}
                >
                  {badge.label}
                </span>
              )}

              <div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: 17,
                    marginTop: badge ? 10 : 0,
                    marginBottom: 10,
                    color: '#1f2937',
                    minHeight: 44,
                  }}
                >
                  {plan.name.replace(
                    ' (Limited Offer)',
                    ''
                  )}
                </h3>

                <div style={{ marginBottom: 4 }}>
                  <span
                    style={{
                      fontSize: 30,
                      fontWeight: 800,
                      background:
                        'linear-gradient(90deg,#6366f1,#a855f7)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor:
                        'transparent',
                    }}
                  >
                    ₹
                    {(plan.amountPaise / 100).toFixed(
                      0
                    )}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: 12,
                    color: '#9ca3af',
                    fontWeight: 600,
                    marginBottom: 18,
                  }}
                >
                  /{isYearly ? 'year' : 'month'}
                </p>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 22px',
                    textAlign: 'left',
                  }}
                >
                  {features.map((f, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                        fontSize: 13.5,
                        color: '#374151',
                        marginBottom: 9,
                        lineHeight: 1.4,
                      }}
                    >
                      <span
                        style={{
                          color: '#10b981',
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => choosePlan(plan.id)}
                style={{
                  width: '100%',
                  padding: 11,
                  borderRadius: 999,
                  border: 'none',
                  background: isHighlighted
                    ? 'linear-gradient(90deg,#6366f1,#a855f7)'
                    : 'linear-gradient(90deg,#818cf8,#c084fc)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Choose Plan
              </button>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 40,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 13.5,
            fontWeight: 600,
            color: '#4b5563',
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontWeight: 800,
              color: '#1f2937',
            }}
          >
            All individual plans include:{' '}
          </span>
          🎮 Cognitive games &amp; activities · 📊
          Progress tracking · 🏆 Achievements · 👤
          Individual child profile
        </p>

        <p
          style={{
            fontSize: 13.5,
            color: '#9ca3af',
            fontStyle: 'italic',
          }}
        >
          No pressure. No complicated setup. Just let
          your child explore, practise and grow.
        </p>

        <p
          style={{
            marginTop: 18,
            fontSize: 13,
            color: '#6b7280',
          }}
        >
          Teachers and schools have separate
          institutional plans.{' '}
          <button
            type="button"
            onClick={() =>
              (window.location.href =
                'mailto:bhaavatech@gmail.com?subject=Medh%C4%81%20Institutional%20Plan')
            }
            style={{
              border: 'none',
              background: 'transparent',
              color: '#6366f1',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Contact Medhā
          </button>
        </p>
      </div>
    </div>
  );
}