import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Info } from '../ui/Icons';
import { ApiError, postJson } from '../../lib/api';
import { properties } from '../../data/properties';

const CONTACT_METHODS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Telephone' },
] as const;

interface FormState {
  name: string;
  email: string;
  phone: string;
  propertySlug: string;
  preferredDate: string;
  contactMethod: 'email' | 'phone';
  message: string;
  consent: boolean;
  company: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

interface EnquirySuccess {
  ok: true;
  reference: string;
  receivedAt: string;
}

const initialForm = (propertySlug: string): FormState => ({
  name: '',
  email: '',
  phone: '',
  propertySlug,
  preferredDate: '',
  contactMethod: 'email',
  message: '',
  consent: false,
  company: '',
});

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (form.name.trim().length < 2) errors.name = 'Please enter your full name.';
  if (form.name.trim().length > 100) errors.name = 'Please use 100 characters or fewer.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (form.email.trim().length > 200) errors.email = 'Please use a shorter email address.';
  if (form.phone.trim()) {
    if (form.phone.trim().length > 32 || !/^[+\d().\s-]{6,32}$/.test(form.phone.trim())) {
      errors.phone = 'Please enter a valid telephone number, or leave this blank.';
    }
    if (form.contactMethod === 'phone' && form.phone.trim().length < 6) {
      errors.phone = 'A telephone number is required for telephone contact.';
    }
  }
  if (form.preferredDate) {
    const chosen = new Date(`${form.preferredDate}T12:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(chosen.getTime()) || chosen < today) {
      errors.preferredDate = 'Please choose today or a future date.';
    }
  }
  if (form.message.length > 1200) errors.message = 'Please keep your message under 1,200 characters.';
  if (!form.consent) errors.consent = 'Please confirm you consent to us handling your enquiry.';
  return errors;
}

export function EnquiryForm({
  propertySlug = '',
  title = 'Request a private viewing',
  intro = 'Share a few details and a Vanguard property specialist will respond personally. This is a request, not a confirmed booking.',
  source = 'website',
}: {
  propertySlug?: string;
  title?: string;
  intro?: string;
  source?: string;
}) {
  const [form, setForm] = useState<FormState>(() => initialForm(propertySlug));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const [result, setResult] = useState<EnquirySuccess | null>(null);
  const startedAt = useRef(Date.now());
  const successRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setForm((current) => ({ ...current, propertySlug }));
  }, [propertySlug]);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'submitting') return;
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      first?.focus();
      return;
    }

    setStatus('submitting');
    setServerMessage('');
    try {
      const response = await postJson<EnquirySuccess>('/api/enquiries', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        propertySlug: form.propertySlug || undefined,
        preferredDate: form.preferredDate || undefined,
        contactMethod: form.contactMethod,
        message: form.message.trim() || undefined,
        consent: form.consent,
        company: form.company,
        elapsedMs: Date.now() - startedAt.current,
        source,
      });
      setResult(response);
      setStatus('success');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.fields) {
          setErrors(error.fields as FieldErrors);
        }
        setServerMessage(error.message);
      } else {
        setServerMessage(
          'We could not send your request just now. Please check your connection and try again, or email us directly.',
        );
      }
      setStatus('error');
    }
  };

  if (status === 'success' && result) {
    return (
      <div className="enquiry-card enquiry-card--success" role="status" aria-live="polite">
        <span className="enquiry-success__icon" aria-hidden="true">
          <Check size={20} />
        </span>
        <span className="eyebrow">Request received</span>
        <h2 ref={successRef} tabIndex={-1}>
          Thank you — your enquiry is with us.
        </h2>
        <p>
          A property specialist will respond using your preferred contact method. Please quote reference{' '}
          <strong>{result.reference}</strong>.
        </p>
        <div className="enquiry-success__note">
          <Info size={15} aria-hidden="true" />
          <p>
            This is a request, not a confirmed appointment. No calendar booking has been created. Any
            date you selected is indicative and will be confirmed with you directly.
          </p>
        </div>
        <div className="enquiry-success__actions">
          <Link to="/residences" className="btn btn--solid btn--small">
            Explore the residences
            <ArrowUpRight size={13} />
          </Link>
          <button
            type="button"
            className="link-arrow"
            onClick={() => {
              setForm(initialForm(propertySlug));
              setResult(null);
              setStatus('idle');
              startedAt.current = Date.now();
            }}
          >
            Send another enquiry
          </button>
        </div>
        <p className="enquiry-disclaimer">
          Demonstration environment: requests are stored for evaluation of this project only and are
          not sent to a real estate agency.
        </p>
      </div>
    );
  }

  return (
    <div className="enquiry-card">
      <div className="enquiry-card__head">
        <span className="eyebrow">Private enquiries</span>
        <h2>{title}</h2>
        <p>{intro}</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        {status === 'error' && (
          <div className="form-alert" role="alert">
            <Info size={16} aria-hidden="true" />
            <div>
              <strong>Your request was not sent.</strong>
              <p>{serverMessage}</p>
            </div>
          </div>
        )}

        <div className="field-row">
          <div className={`field${errors.name ? ' has-error' : ''}`}>
            <label htmlFor={`name-${source}`}>Full name</label>
            <input
              id={`name-${source}`}
              name="name"
              type="text"
              autoComplete="name"
              maxLength={100}
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `name-error-${source}` : undefined}
              required
            />
            {errors.name && (
              <span className="field__error" id={`name-error-${source}`}>
                {errors.name}
              </span>
            )}
          </div>

          <div className={`field${errors.email ? ' has-error' : ''}`}>
            <label htmlFor={`email-${source}`}>Email</label>
            <input
              id={`email-${source}`}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={200}
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? `email-error-${source}` : undefined}
              required
            />
            {errors.email && (
              <span className="field__error" id={`email-error-${source}`}>
                {errors.email}
              </span>
            )}
          </div>
        </div>

        <div className="field-row">
          <div className={`field${errors.phone ? ' has-error' : ''}`}>
            <label htmlFor={`phone-${source}`}>
              Telephone <span>Optional</span>
            </label>
            <input
              id={`phone-${source}`}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={32}
              value={form.phone}
              onChange={(event) => update('phone', event.target.value)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? `phone-error-${source}` : undefined}
            />
            {errors.phone && (
              <span className="field__error" id={`phone-error-${source}`}>
                {errors.phone}
              </span>
            )}
          </div>

          <div className={`field${errors.preferredDate ? ' has-error' : ''}`}>
            <label htmlFor={`date-${source}`}>
              Preferred date <span>Optional</span>
            </label>
            <input
              id={`date-${source}`}
              name="preferredDate"
              type="date"
              min={todayISO()}
              value={form.preferredDate}
              onChange={(event) => update('preferredDate', event.target.value)}
              aria-invalid={Boolean(errors.preferredDate)}
              aria-describedby={errors.preferredDate ? `date-error-${source}` : undefined}
            />
            {errors.preferredDate && (
              <span className="field__error" id={`date-error-${source}`}>
                {errors.preferredDate}
              </span>
            )}
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor={`property-${source}`}>Property of interest</label>
            <select
              id={`property-${source}`}
              name="propertySlug"
              value={form.propertySlug}
              onChange={(event) => update('propertySlug', event.target.value)}
            >
              <option value="">No preference yet</option>
              {properties.map((property) => (
                <option key={property.slug} value={property.slug}>
                  {property.name} — {property.location.city}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor={`contact-method-${source}`}>Preferred contact</label>
            <select
              id={`contact-method-${source}`}
              name="contactMethod"
              value={form.contactMethod}
              onChange={(event) => update('contactMethod', event.target.value as 'email' | 'phone')}
            >
              {CONTACT_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={`field${errors.message ? ' has-error' : ''}`}>
          <label htmlFor={`message-${source}`}>
            Message <span>Optional</span>
          </label>
          <textarea
            id={`message-${source}`}
            name="message"
            rows={4}
            maxLength={1200}
            value={form.message}
            onChange={(event) => update('message', event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={`message-hint-${source}${errors.message ? ` message-error-${source}` : ''}`}
            placeholder="Tell us what you are looking for, or when you would like to visit."
          />
          <span className="field__hint" id={`message-hint-${source}`}>
            {form.message.length} / 1,200 characters
          </span>
          {errors.message && (
            <span className="field__error" id={`message-error-${source}`}>
              {errors.message}
            </span>
          )}
        </div>

        <div className="honeypot" aria-hidden="true">
          <label htmlFor={`company-${source}`}>Company</label>
          <input
            id={`company-${source}`}
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={(event) => update('company', event.target.value)}
          />
        </div>

        <div className={`consent${errors.consent ? ' has-error' : ''}`}>
          <label htmlFor={`consent-${source}`}>
            <input
              id={`consent-${source}`}
              name="consent"
              type="checkbox"
              checked={form.consent}
              onChange={(event) => update('consent', event.target.checked)}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? `consent-error-${source}` : undefined}
            />
            <span>
              I consent to Vanguard Estates storing and using these details to respond to my enquiry. I
              understand this is a demonstration website and not a confirmed appointment.{' '}
              <Link to="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.consent && (
            <span className="field__error" id={`consent-error-${source}`}>
              {errors.consent}
            </span>
          )}
        </div>

        <div className="enquiry-card__actions">
          <button type="submit" className="btn btn--solid" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending request…' : 'Send private enquiry'}
            {status !== 'submitting' && <ArrowUpRight size={14} />}
          </button>
          <span className="enquiry-disclaimer">
            No financial, identification or sensitive information is requested. Requests are handled as
            confirmation-only enquiries.
          </span>
        </div>
      </form>
    </div>
  );
}
