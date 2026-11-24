import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDialog } from '../../hooks/useUi';
import { postJson, ApiError } from '../../lib/api';
import { properties } from '../../data/properties';
import { ArrowUpRight, Close, Send, Sparkle } from '../ui/Icons';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  source?: 'gemini' | 'knowledge-base';
}

interface ConciergeResponse {
  reply: string;
  source: 'gemini' | 'knowledge-base';
  suggestViewing?: boolean;
  limited?: boolean;
}

interface EnquirySuccess {
  ok: true;
  reference: string;
  receivedAt: string;
}

const WELCOME =
  'Welcome to Vanguard Estates. How may I help you discover your next residence?';

const SUGGESTIONS = [
  'Explore the featured residences.',
  'What makes this property unique?',
  'How many bedrooms are available?',
  'Can I arrange a private viewing?',
  'Compare the properties.',
];

const CONTACT_METHODS = ['email', 'phone'] as const;

function newMessage(role: ChatMessage['role'], content: string, source?: ChatMessage['source']): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    source,
  };
}

export function Concierge() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    newMessage('assistant', WELCOME),
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestViewing, setSuggestViewing] = useState(false);
  const [lastSource, setLastSource] = useState<'gemini' | 'knowledge-base' | null>(null);
  const [showLead, setShowLead] = useState(false);
  const [sessionId] = useState(() => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
    return `session-${Date.now()}`;
  });
  const panelRef = useDialog(open, () => setOpen(false));
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading, showLead]);

  useEffect(() => {
    return () => requestRef.current?.abort();
  }, []);

  const buildHistory = (all: ChatMessage[]) =>
    all
      .filter((message) => message.content !== WELCOME)
      .slice(-8)
      .map((message) => ({ role: message.role, content: message.content }));

  const requestReply = async (conversation: ChatMessage[], prompt: string) => {
    setLoading(true);
    setError('');
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 25000);

    try {
      const data = await postJson<ConciergeResponse>(
        '/api/concierge',
        {
          sessionId,
          messages: [...buildHistory(conversation), { role: 'user', content: prompt }],
        },
        { signal: controller.signal },
      );
      setMessages((current) => [...current, newMessage('assistant', data.reply, data.source)]);
      setSuggestViewing(Boolean(data.suggestViewing));
      setLastSource(data.source);
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === 'AbortError') {
        setError('The concierge took too long to respond. Please try again, or use the enquiry form.');
      } else if (caught instanceof ApiError) {
        setError(caught.message);
      } else {
        setError(
          'The concierge is unavailable right now. Your private enquiry form remains available and is the most reliable way to reach a specialist.',
        );
      }
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
      requestRef.current = null;
    }
  };

  const send = async (text: string) => {
    const prompt = text.trim();
    if (!prompt || loading) return;
    if (prompt.length > 800) return;
    const userMessage = newMessage('user', prompt);
    setMessages([...messages, userMessage]);
    setInput('');
    setSuggestViewing(false);
    await requestReply(messages, prompt);
  };

  const retry = () => {
    const lastUser = [...messages].reverse().find((message) => message.role === 'user');
    if (!lastUser || loading) return;
    const conversation = messages.filter((message) => message.id !== lastUser.id);
    setMessages(conversation);
    setMessages((current) => [...current, lastUser]);
    void requestReply(conversation, lastUser.content);
  };

  const reset = () => {
    setMessages([newMessage('assistant', WELCOME)]);
    setError('');
    setSuggestViewing(false);
    setShowLead(false);
    setLastSource(null);
    setInput('');
  };

  return (
    <>
      <button
        type="button"
        className={`concierge-launcher${open ? ' is-open' : ''}`}
        aria-expanded={open}
        aria-controls="vanguard-concierge"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="concierge-launcher__mark" aria-hidden="true">
          <Sparkle size={18} />
        </span>
        <span className="concierge-launcher__text">
          <strong>Private Concierge</strong>
          <small>Ask about a residence</small>
        </span>
        <span className="concierge-launcher__dot" aria-hidden="true" />
      </button>

      {open && (
        <section
          id="vanguard-concierge"
          ref={panelRef}
          className="concierge-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="concierge-title"
        >
          <header className="concierge-head">
            <div className="concierge-head__brand">
              <span className="concierge-head__mark" aria-hidden="true">
                <Sparkle size={16} />
              </span>
              <div>
                <h2 id="concierge-title">Vanguard Private Concierge</h2>
                <p>
                  <span className="concierge-head__status" aria-hidden="true" />
                  Property guidance · demonstration
                </p>
              </div>
            </div>
            <div className="concierge-head__actions">
              <button type="button" className="concierge-head__clear" onClick={reset}>
                Clear
              </button>
              <button
                type="button"
                className="concierge-head__close"
                onClick={() => setOpen(false)}
                aria-label="Close the private concierge"
              >
                <Close size={17} />
              </button>
            </div>
          </header>

          <div className="concierge-messages" ref={scrollRef}>
            <p className="concierge-disclaimer">
              AI-assisted guidance from a fixed demonstration knowledge base. Not legal, financial or
              availability advice.
            </p>

            {messages.map((message) => (
              <div key={message.id} className={`concierge-msg concierge-msg--${message.role}`}>
                <span className="concierge-msg__author">
                  {message.role === 'assistant' ? 'Concierge' : 'You'}
                </span>
                <div className="concierge-msg__bubble">{message.content}</div>
                {message.role === 'assistant' && message.source === 'knowledge-base' && (
                  <span className="concierge-msg__source">Answered from the trusted knowledge base</span>
                )}
              </div>
            ))}

            {loading && (
              <div className="concierge-msg concierge-msg--assistant">
                <span className="concierge-msg__author">Concierge</span>
                <div className="concierge-typing" role="status" aria-label="Concierge is responding">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            {error && (
              <div className="concierge-error" role="alert">
                <p>{error}</p>
                <div className="concierge-error__actions">
                  <button type="button" onClick={retry} disabled={loading}>
                    Retry
                  </button>
                  <Link to="/contact#enquiry" onClick={() => setOpen(false)}>
                    Use the enquiry form
                  </Link>
                </div>
              </div>
            )}

            {messages.length <= 2 && !loading && (
              <div className="concierge-suggestions" aria-label="Suggested questions">
                {SUGGESTIONS.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => void send(suggestion)}>
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {suggestViewing && !showLead && (
              <div className="concierge-viewing">
                <span className="meta">Next step</span>
                <p>Would you like to request a private viewing? It takes less than a minute.</p>
                <button type="button" className="btn btn--solid btn--small" onClick={() => setShowLead(true)}>
                  Arrange a private viewing
                  <ArrowUpRight size={13} />
                </button>
              </div>
            )}

            {showLead && (
              <ConciergeLeadForm
                onCancel={() => setShowLead(false)}
                onSuccess={() => {
                  setSuggestViewing(false);
                }}
              />
            )}

            {lastSource === 'knowledge-base' && !error && (
              <p className="concierge-source-note">
                AI generation is not configured in this environment, so answers come directly from the
                property knowledge base.
              </p>
            )}
          </div>

          <form
            className="concierge-composer"
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
          >
            <label className="sr-only" htmlFor="concierge-input">
              Ask the Vanguard Private Concierge
            </label>
            <textarea
              id="concierge-input"
              ref={inputRef}
              rows={2}
              maxLength={800}
              value={input}
              placeholder="Ask about architecture, floors, materials or viewings…"
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void send(input);
                }
              }}
              disabled={loading}
            />
            <button
              type="submit"
              className="concierge-send"
              disabled={loading || input.trim().length === 0}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
            <div className="concierge-composer__meta">
              <span>Enter to send · Shift + Enter for a new line</span>
              <span>{input.length}/800</span>
            </div>
          </form>

          <p className="concierge-foot">
            Demonstration assistant. No booking is created. See{' '}
            <Link to="/privacy" onClick={() => setOpen(false)}>
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      )}
    </>
  );
}

function ConciergeLeadForm({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [propertySlug, setPropertySlug] = useState('');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [reference, setReference] = useState('');
  const startedAt = useRef(Date.now());

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'loading') return;
    if (name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError('Please enter your name and a valid email address.');
      return;
    }
    if (!consent) {
      setError('Please confirm consent so we can respond to your request.');
      return;
    }
    setError('');
    setStatus('loading');
    try {
      const response = await postJson<EnquirySuccess>('/api/enquiries', {
        name: name.trim(),
        email: email.trim(),
        propertySlug: propertySlug || undefined,
        contactMethod,
        message: 'Private viewing requested via the Vanguard Private Concierge.',
        consent: true,
        company: '',
        elapsedMs: Date.now() - startedAt.current,
        source: 'concierge',
      });
      setReference(response.reference);
      setStatus('success');
      onSuccess();
    } catch (caught) {
      setStatus('idle');
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'The request could not be sent. Please use the full enquiry form or try again.',
      );
    }
  };

  if (status === 'success') {
    return (
      <div className="concierge-lead concierge-lead--success" role="status">
        <span className="eyebrow">Request received</span>
        <h3>Thank you, {name.split(' ')[0]}.</h3>
        <p>
          Reference <strong>{reference}</strong>. This is a request, not a confirmed appointment. A
          specialist would normally respond using your preferred contact method.
        </p>
        <button type="button" className="link-arrow" onClick={onCancel}>
          Close request
        </button>
      </div>
    );
  }

  return (
    <form className="concierge-lead" onSubmit={submit} noValidate>
      <span className="meta">Private viewing request</span>
      <div className="concierge-lead__row">
        <label htmlFor="concierge-name">Full name</label>
        <input
          id="concierge-name"
          name="name"
          autoComplete="name"
          maxLength={100}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <div className="concierge-lead__row">
        <label htmlFor="concierge-email">Email</label>
        <input
          id="concierge-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={200}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div className="concierge-lead__row">
        <label htmlFor="concierge-property">Residence</label>
        <select
          id="concierge-property"
          value={propertySlug}
          onChange={(event) => setPropertySlug(event.target.value)}
        >
          <option value="">No preference yet</option>
          {properties.map((property) => (
            <option key={property.slug} value={property.slug}>
              {property.name}
            </option>
          ))}
        </select>
      </div>
      <div className="concierge-lead__row">
        <label htmlFor="concierge-contact">Preferred contact</label>
        <select
          id="concierge-contact"
          value={contactMethod}
          onChange={(event) => setContactMethod(event.target.value as 'email' | 'phone')}
        >
          {CONTACT_METHODS.map((method) => (
            <option key={method} value={method}>
              {method === 'email' ? 'Email' : 'Telephone'}
            </option>
          ))}
        </select>
      </div>
      <label className="concierge-lead__consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
        />
        <span>
          I consent to my details being stored to respond to this enquiry.{' '}
          <Link to="/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {error && (
        <p className="concierge-lead__error" role="alert">
          {error}
        </p>
      )}
      <div className="concierge-lead__actions">
        <button type="submit" className="btn btn--solid btn--small" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending…' : 'Send request'}
        </button>
        <button type="button" className="link-arrow" onClick={onCancel}>
          Back
        </button>
      </div>
      <p className="concierge-lead__note">
        No confirmed appointment is created. Demonstration enquiries are stored for project evaluation.
      </p>
    </form>
  );
}
