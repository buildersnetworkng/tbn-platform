'use client';

import { useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/Button';

const supabase = createClient(
  'https://ouzhjyxbrwponrvktwor.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91emhqeXhicndwb25ydmt0d29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDU3MTYsImV4cCI6MjA5NjkyMTcxNn0.KwjrVLsINydKJmJ_bHRiJf9M7LOuq7S7kq-d3k4akw4'
);

const TOTAL_STEPS = 5;

const PRIMARY_SKILLS = [
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'Mobile Development',
  'UI/UX Design',
  'Graphic Design',
  'AI / Machine Learning',
  'Data Science',
  'Cybersecurity',
  'DevOps / Cloud',
  'Product Management',
  'Digital Marketing',
  'Blockchain / Web3',
  'Other',
];

const AVAILABILITY_OPTIONS = ['Full-time', 'Internship', 'Freelance', 'Collaboration', 'Learning'];

const STEP_META = [
  { label: 'Account', headline: 'Create your account', sub: 'This becomes your permanent identity inside the ecosystem.' },
  { label: 'Background', headline: "Where you're building from", sub: 'Helps match you to the right opportunities.' },
  { label: 'Skills', headline: 'What are you building with', sub: 'Your primary skill defines how you show up across the network.' },
  { label: 'Work', headline: 'Show your work', sub: "Links and assets. Optional — but what you've shipped speaks louder." },
  { label: 'Review', headline: 'Confirm your profile', sub: 'This is what enters the ecosystem. Take a moment.' },
];

type FormState = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  country: string;
  city: string;
  experienceLevel: string;
  primarySkill: string;
  secondarySkills: string[];
  bio: string;
  currentProject: string;
  availability: string[];
  portfolioUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  xUrl: string;
};

const initialForm: FormState = {
  fullName: '',
  username: '',
  email: '',
  password: '',
  country: 'Nigeria',
  city: '',
  experienceLevel: '',
  primarySkill: '',
  secondarySkills: [],
  bio: '',
  currentProject: '',
  availability: [],
  portfolioUrl: '',
  githubUrl: '',
  linkedinUrl: '',
  xUrl: '',
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block font-sans text-[10px] font-medium uppercase tracking-[0.15em] text-text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full border-0 border-b border-border bg-transparent py-3 font-sans text-[15px] font-normal text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent';

export function ApplyForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [skillInput, setSkillInput] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const meta = STEP_META[step - 1]!;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function showError(msg: string) {
    setError(msg);
    window.setTimeout(() => setError(''), 5000);
  }

  function goNext() {
    if (step === 1) {
      if (!form.fullName.trim() || !form.username.trim() || !form.email.trim() || !form.password) {
        return showError('Please fill in all fields.');
      }
      if (form.password.length < 6) return showError('Password must be at least 6 characters.');
    }
    if (step === 3 && !form.primarySkill) return showError('Please select your primary skill.');
    setError('');
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function goBack() {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
  }

  function addSkill() {
    const val = skillInput.trim();
    if (!val) return;
    if (!form.secondarySkills.includes(val)) {
      update('secondarySkills', [...form.secondarySkills, val]);
    }
    setSkillInput('');
  }

  function toggleAvailability(value: string) {
    update(
      'availability',
      form.availability.includes(value)
        ? form.availability.filter((a) => a !== value)
        : [...form.availability, value]
    );
  }

  const reviewLines = useMemo(() => {
    return [
      ['Name', form.fullName],
      ['Username', form.username],
      ['Email', form.email],
      ['Location', [form.city, form.country].filter(Boolean).join(', ') || '—'],
      ['Experience', form.experienceLevel || '—'],
      ['Primary skill', form.primarySkill || '—'],
      ['Secondary', form.secondarySkills.join(', ') || '—'],
      ['Bio', form.bio || '—'],
      ['Building', form.currentProject || '—'],
      ['Available for', form.availability.join(', ') || '—'],
      ['Portfolio', form.portfolioUrl || '—'],
      ['GitHub', form.githubUrl || '—'],
      ['LinkedIn', form.linkedinUrl || '—'],
      ['X', form.xUrl || '—'],
      ['CV', cvFile?.name || '—'],
      ['Photo', imgFile?.name || '—'],
    ] as const;
  }, [form, cvFile, imgFile]);

  async function submitProfile() {
    setSubmitting(true);
    setError('');
    try {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
      });
      if (authErr) throw new Error(authErr.message);

      const userId = authData.user?.id;
      if (!userId) throw new Error('Account creation failed. Please try again.');

      let cvUrl: string | null = null;
      let imgUrl: string | null = null;

      if (cvFile) {
        await supabase.storage.from('cv-uploads').upload(`${userId}/cv.pdf`, cvFile, { upsert: true });
        cvUrl = `${userId}/cv.pdf`;
      }

      if (imgFile) {
        const ext = imgFile.name.split('.').pop() || 'jpg';
        const path = `${userId}/profile.${ext}`;
        await supabase.storage.from('profile-images').upload(path, imgFile, { upsert: true });
        const { data: ud } = supabase.storage.from('profile-images').getPublicUrl(path);
        imgUrl = ud.publicUrl;
      }

      const { error: insertErr } = await supabase.from('builders').insert([
        {
          auth_user_id: userId,
          full_name: form.fullName.trim(),
          username: form.username.trim(),
          email: form.email.trim(),
          country: form.country.trim() || null,
          city: form.city.trim() || null,
          experience_level: form.experienceLevel || null,
          primary_skill: form.primarySkill || null,
          secondary_skills: form.secondarySkills.length ? form.secondarySkills : null,
          bio: form.bio.trim() || null,
          current_project: form.currentProject.trim() || null,
          availability: form.availability.length ? form.availability : null,
          portfolio_url: form.portfolioUrl.trim() || null,
          github_url: form.githubUrl.trim() || null,
          linkedin_url: form.linkedinUrl.trim() || null,
          x_url: form.xUrl.trim() || null,
          cv_url: cvUrl,
          profile_image_url: imgUrl,
          profile_status: 'pending',
          builder_score: 0,
        },
      ]);

      if (insertErr) throw new Error(insertErr.message);
      setSuccess(true);
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-[480px]">
        <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full border border-status-success/40 font-sans text-lg text-status-success">
          ✓
        </div>
        <h2 className="font-serif text-[32px] leading-[1.1] text-text-primary desktop:text-[40px]">
          Welcome to<br />The Builders <em className="italic text-accent">Network.</em>
        </h2>
        <p className="mt-4 max-w-[380px] font-sans text-sm leading-relaxed text-text-secondary">
          Your builder profile is being created. Here's what happens next.
        </p>
        <div className="mt-8 flex flex-col gap-2.5">
          {['Join the community', 'Complete your profile', 'Share your first project'].map((item, i) => (
            <div key={item} className="flex items-baseline gap-2.5 font-sans text-sm text-text-secondary">
              <span className="font-serif italic text-accent">{String(i + 1).padStart(2, '0')}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex max-w-[340px] flex-col gap-2.5">
          <a
            href="https://chat.whatsapp.com/DcmiH3z8h7QHIAY25Eu4Sw"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-md bg-[#25D366] px-5 py-3.5 font-sans text-sm font-medium text-black transition hover:bg-[#22c55e]"
          >
            Join WhatsApp Community <span>↗</span>
          </a>
          {[
            ['Follow on Instagram', 'https://www.instagram.com/thebuildersnet_/'],
            ['Follow on X', 'https://x.com/thebuildersnet_'],
            ['Follow on LinkedIn', 'https://www.linkedin.com/company/thebuildersnet/'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border border-border px-5 py-3.5 font-sans text-sm text-text-secondary transition hover:border-border-hover hover:text-text-primary"
            >
              {label} <span>↗</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[480px]">
      <div className="mb-10 flex gap-1.5">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <div
              key={n}
              className={`h-0.5 flex-1 origin-center transition-all duration-200 ${
                active
                  ? 'scale-y-[2.5] bg-accent shadow-[0_0_8px_rgba(199,217,255,0.5)]'
                  : done
                    ? 'bg-accent/40'
                    : 'bg-border'
              }`}
            />
          );
        })}
      </div>

      {error && (
        <div className="mb-4 border border-status-error/20 bg-status-error/5 px-3.5 py-2.5 font-sans text-xs text-status-error">
          {error}
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-accent">{meta.label}</span>
        <span className="font-sans text-[10px] tracking-[0.1em] text-text-muted">
          {String(step).padStart(2, '0')} / {String(TOTAL_STEPS).padStart(2, '0')}
        </span>
      </div>

      <h2 className="font-serif text-[28px] leading-[1.15] text-text-primary tablet:text-[32px]">{meta.headline}</h2>
      <p className="mb-9 mt-2 font-sans text-sm leading-relaxed text-text-secondary">{meta.sub}</p>

      {step === 1 && (
        <>
          <Field label="Full Name">
            <input className={inputClass} value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="Yusuff Abdullahi" />
          </Field>
          <Field label="Username">
            <input className={inputClass} value={form.username} onChange={(e) => update('username', e.target.value)} placeholder="yusuff_builds" />
          </Field>
          <Field label="Email">
            <input className={inputClass} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
          </Field>
          <Field label="Password">
            <input className={inputClass} type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Minimum 6 characters" />
          </Field>
        </>
      )}

      {step === 2 && (
        <>
          <div className="grid grid-cols-2 gap-6">
            <Field label="Country">
              <input className={inputClass} value={form.country} onChange={(e) => update('country', e.target.value)} />
            </Field>
            <Field label="City">
              <input className={inputClass} value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Lagos" />
            </Field>
          </div>
          <Field label="Experience Level">
            <select className={inputClass} value={form.experienceLevel} onChange={(e) => update('experienceLevel', e.target.value)}>
              <option value="">Select...</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="professional">Professional</option>
            </select>
          </Field>
        </>
      )}

      {step === 3 && (
        <>
          <Field label="Primary Skill">
            <select className={inputClass} value={form.primarySkill} onChange={(e) => update('primarySkill', e.target.value)}>
              <option value="">Select...</option>
              {PRIMARY_SKILLS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Secondary Skills — press Enter to add">
            <input
              className={inputClass}
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="e.g. React"
            />
            {form.secondarySkills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {form.secondarySkills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-2 rounded-full border border-accent/30 px-3 py-1 font-sans text-[11px] text-accent">
                    {s}
                    <button
                      type="button"
                      className="text-accent/60 hover:text-accent"
                      onClick={() => update('secondarySkills', form.secondarySkills.filter((x) => x !== s))}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>
          <Field label="Bio">
            <textarea className={`${inputClass} h-20 resize-none`} value={form.bio} onChange={(e) => update('bio', e.target.value)} placeholder="One or two sentences about you." />
          </Field>
          <Field label="What are you currently building?">
            <input className={inputClass} value={form.currentProject} onChange={(e) => update('currentProject', e.target.value)} placeholder="e.g. Expense Tracker, AI Resume Builder" />
          </Field>
          <Field label="Available For">
            <div className="mt-1 flex flex-wrap gap-2">
              {AVAILABILITY_OPTIONS.map((opt) => {
                const selected = form.availability.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleAvailability(opt)}
                    className={`rounded-full border px-4 py-2 font-sans text-xs transition ${
                      selected
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border text-text-secondary hover:border-border-hover hover:text-text-primary'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </Field>
        </>
      )}

      {step === 4 && (
        <>
          <Field label="Portfolio URL">
            <input className={inputClass} type="url" value={form.portfolioUrl} onChange={(e) => update('portfolioUrl', e.target.value)} placeholder="https://..." />
          </Field>
          <div className="grid grid-cols-2 gap-6">
            <Field label="GitHub">
              <input className={inputClass} type="url" value={form.githubUrl} onChange={(e) => update('githubUrl', e.target.value)} placeholder="https://github.com/..." />
            </Field>
            <Field label="LinkedIn">
              <input className={inputClass} type="url" value={form.linkedinUrl} onChange={(e) => update('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/..." />
            </Field>
          </div>
          <Field label="X (Twitter)">
            <input className={inputClass} type="url" value={form.xUrl} onChange={(e) => update('xUrl', e.target.value)} placeholder="https://x.com/..." />
          </Field>
          <Field label="CV / Resume — PDF, optional">
            <label className="mt-1 flex cursor-pointer flex-col items-center border border-border px-6 py-6 text-center transition hover:border-border-hover">
              <span className="mb-2 text-text-muted">↑</span>
              <span className="font-sans text-xs text-text-muted">{cvFile ? cvFile.name : 'Tap to upload'}</span>
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => setCvFile(e.target.files?.[0] || null)} />
            </label>
          </Field>
          <Field label="Profile Image — optional">
            <label className="mt-1 flex cursor-pointer flex-col items-center border border-border px-6 py-6 text-center transition hover:border-border-hover">
              <span className="mb-2 text-text-muted">↑</span>
              <span className="font-sans text-xs text-text-muted">{imgFile ? imgFile.name : 'Tap to upload'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImgFile(e.target.files?.[0] || null)} />
            </label>
          </Field>
        </>
      )}

      {step === 5 && (
        <div className="rounded-lg border border-border bg-surface px-6 py-5 font-sans text-sm leading-relaxed text-text-secondary">
          {reviewLines.map(([k, v]) => (
            <div key={k} className="flex gap-2 border-b border-hairline py-2 last:border-0">
              <span className="w-28 shrink-0 text-text-muted">{k}</span>
              <span className="text-text-primary">{v}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-9 flex items-center gap-5">
        {step < 5 ? (
          <Button variant="primary" type="button" onClick={goNext}>
            {step === 4 ? 'Review profile' : 'Continue'}
          </Button>
        ) : (
          <Button variant="primary" type="button" loading={submitting} onClick={submitProfile}>
            Create profile
          </Button>
        )}
        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            className="font-sans text-xs tracking-wide text-text-muted transition hover:text-text-primary"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
