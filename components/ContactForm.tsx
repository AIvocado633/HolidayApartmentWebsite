'use client';

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import {
  Send,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

// Booking enquiries are delivered by Formspree, because the site is a static
// export and has no server of its own to post to. The ID is not a secret — it
// ships in the page HTML — and the address that receives the enquiries is set in
// the Formspree dashboard rather than here, so it can change without a redeploy.
//
// The submission below is a plain REST call. Do not switch Formspree's reCAPTCHA
// on for this form: the challenge assumes their redirect flow, and a JSON POST
// has nowhere to render it. The honeypot field near the end of the form guards
// against bots instead.
const FORMSPREE_FORM_ID: string = 'xwlenpbb';
const IS_FORM_CONFIGURED = FORMSPREE_FORM_ID !== 'REPLACE_WITH_FORMSPREE_ID';
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

const CONTACT_EMAIL = 'hallo@XYZ-ferien.de';
const CONTACT_PHONE = '+49 1234 567890';

type ContactDetail = {
  label: string;
  value: string;
};

const CONTACT_DETAILS: ContactDetail[] = [
  { label: 'E-Mail', value: CONTACT_EMAIL },
  { label: 'Telefon', value: CONTACT_PHONE },
  { label: 'Adresse', value: 'Sandroth 15, 36145 Hofbieber/Kleinsassen' },
  { label: 'Antwortzeit', value: 'Innerhalb von 24 Stunden' },
  { label: 'Check-in / Check-out', value: 'Ab 15:00 Uhr · bis 10:00 Uhr' },
  { label: 'Kaution', value: '100 € (wird nach Abreise zurücküberwiesen)' },
  { label: 'Kurtaxe', value: '1 € pro Person und Tag' },
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const INITIAL_FORM_STATE: FormState = {
  name: '',
  email: '',
  phone: '',
  checkIn: '',
  checkOut: '',
  guests: '2',
  message: '',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Dates are compared as ISO strings, so they have to be built from the local
// calendar day — toISOString() reports the UTC day and would roll over to
// tomorrow during the evening in German time zones.
const toIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const validate = (data: FormState, today: string): FieldErrors => {
  const errors: FieldErrors = {};

  if (data.name.trim().length < 2) {
    errors.name = 'Bitte tragt euren Namen ein.';
  }

  if (data.email.trim() === '') {
    errors.email = 'Bitte tragt eure E-Mail-Adresse ein.';
  } else if (!EMAIL_PATTERN.test(data.email.trim())) {
    errors.email = 'Diese E-Mail-Adresse sieht nicht vollständig aus.';
  }

  if (data.checkIn === '') {
    errors.checkIn = 'Bitte wählt ein Anreisedatum.';
  } else if (data.checkIn < today) {
    errors.checkIn = 'Das Anreisedatum liegt in der Vergangenheit.';
  }

  if (data.checkOut === '') {
    errors.checkOut = 'Bitte wählt ein Abreisedatum.';
  } else if (data.checkIn !== '' && data.checkOut <= data.checkIn) {
    errors.checkOut = 'Die Abreise muss nach der Anreise liegen.';
  }

  return errors;
};

type FieldErrorProps = {
  id: string;
  message?: string;
};

const FieldError = ({
  id,
  message,
}: FieldErrorProps): React.JSX.Element | null => {
  if (message === undefined) {
    return null;
  }

  return (
    <p id={id} className="font-body text-xs text-red-700">
      {message}
    </p>
  );
};

const ContactForm = (): React.JSX.Element => {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [honeypot, setHoneypot] = useState<string>('');
  // Resolved after mount so the prerendered HTML does not bake in the build date,
  // which would drift from the guest's today and trip a hydration mismatch.
  const [today, setToday] = useState<string>('');

  useEffect(() => {
    setToday(toIsoDate(new Date()));
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;
    const field = name as keyof FormState;

    setFormData((prev) => ({ ...prev, [field]: value }));

    // Drop the error as soon as the guest starts correcting the field.
    setErrors((prev) => {
      if (prev[field] === undefined) {
        return prev;
      }

      const next = { ...prev };
      delete next[field];

      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    // Bots fill in every field they find, including the one hidden from guests.
    // Show them the same confirmation and send nothing.
    if (honeypot !== '') {
      setSubmitStatus('success');
      return;
    }

    const validationErrors = validate(formData, today || toIsoDate(new Date()));
    setErrors(validationErrors);

    const firstInvalidField = Object.keys(validationErrors)[0];
    if (firstInvalidField !== undefined) {
      document.getElementById(firstInvalidField)?.focus();
      return;
    }

    if (!IS_FORM_CONFIGURED) {
      console.error(
        'Booking enquiries cannot be delivered: set FORMSPREE_FORM_ID in components/ContactForm.tsx to the ID of your Formspree form.'
      );
      setSubmitStatus('error');
      return;
    }

    setSubmitStatus('submitting');

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        // German keys so the notification mail reads properly. Formspree picks
        // up the lowercase `email` field and sets it as the Reply-To, so a reply
        // goes straight back to the guest.
        body: JSON.stringify({
          Name: formData.name.trim(),
          email: formData.email.trim(),
          Telefon: formData.phone.trim() || '—',
          Anreise: formData.checkIn,
          Abreise: formData.checkOut,
          Personen: formData.guests,
          Nachricht: formData.message.trim() || '—',
          _subject: `Buchungsanfrage ${formData.name.trim()} · ${formData.checkIn} bis ${formData.checkOut}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Formspree answered with status ${response.status}`);
      }

      setSubmitStatus('success');
      setFormData(INITIAL_FORM_STATE);
    } catch (error) {
      console.error('Booking enquiry could not be delivered:', error);
      setSubmitStatus('error');
    }
  };

  const isSubmitting = submitStatus === 'submitting';

  return (
    <section
      id="contact"
      className="py-20 md:py-28 bg-cream"
      aria-labelledby="contact-heading"
    >
      <div className="section-container section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Left column – copy */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-28">
            <header className="flex flex-col gap-4">
              <p className="label-overline">Kontakt aufnehmen</p>
              <h2 id="contact-heading" className="heading-lg">
                Euren Aufenthalt planen
              </h2>
              <p className="font-body text-base text-accent-muted leading-relaxed max-w-md">
                Ihr habt Fragen oder möchtet buchen? Schreibt uns einfach –
                wir melden uns in der Regel innerhalb von 24 Stunden mit
                Verfügbarkeit und allen Details.
              </p>
            </header>

            <dl className="flex flex-col gap-4 pt-2">
              {CONTACT_DETAILS.map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <dt className="font-body text-xs font-semibold uppercase tracking-widest text-warm-500">
                    {label}
                  </dt>
                  <dd className="font-body text-sm text-accent">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right column – form */}
          <div className="bg-white border border-beige p-8 sm:p-10">
            {submitStatus === 'success' ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="w-14 h-14 bg-warm-100 flex items-center justify-center">
                  <Send size={24} className="text-warm-600" aria-hidden="true" />
                </div>
                <h3 className="heading-sm text-accent">Nachricht gesendet!</h3>
                <p className="font-body text-sm text-accent-muted max-w-xs leading-relaxed">
                  Danke für eure Anfrage. Wir melden uns innerhalb von
                  24 Stunden bei euch.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Booking enquiry form"
                className="flex flex-col gap-5"
              >
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="name"
                      className="font-body text-xs font-semibold uppercase tracking-wider text-warm-600 flex items-center gap-1.5"
                    >
                      <User size={12} aria-hidden="true" />
                      Vor- und Nachname *
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Anna Müller"
                      className={`input-field ${errors.name ? 'border-red-600' : ''}`}
                      disabled={isSubmitting}
                      autoComplete="name"
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    <FieldError id="name-error" message={errors.name} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="email"
                      className="font-body text-xs font-semibold uppercase tracking-wider text-warm-600 flex items-center gap-1.5"
                    >
                      <Mail size={12} aria-hidden="true" />
                      E-Mail-Adresse *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="anna@example.com"
                      className={`input-field ${errors.email ? 'border-red-600' : ''}`}
                      disabled={isSubmitting}
                      autoComplete="email"
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    <FieldError id="email-error" message={errors.email} />
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="phone"
                    className="font-body text-xs font-semibold uppercase tracking-wider text-warm-600 flex items-center gap-1.5"
                  >
                    <Phone size={12} aria-hidden="true" />
                    Telefonnummer
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+49 89 …"
                    className="input-field"
                    disabled={isSubmitting}
                    autoComplete="tel"
                  />
                </div>

                {/* Check-in / Check-out row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="checkIn"
                      className="font-body text-xs font-semibold uppercase tracking-wider text-warm-600 flex items-center gap-1.5"
                    >
                      <Calendar size={12} aria-hidden="true" />
                      Anreise *
                    </label>
                    <input
                      id="checkIn"
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleChange}
                      required
                      min={today || undefined}
                      className={`input-field ${errors.checkIn ? 'border-red-600' : ''}`}
                      disabled={isSubmitting}
                      aria-invalid={errors.checkIn ? true : undefined}
                      aria-describedby={
                        errors.checkIn ? 'checkIn-error' : undefined
                      }
                    />
                    <FieldError id="checkIn-error" message={errors.checkIn} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="checkOut"
                      className="font-body text-xs font-semibold uppercase tracking-wider text-warm-600 flex items-center gap-1.5"
                    >
                      <Calendar size={12} aria-hidden="true" />
                      Abreise *
                    </label>
                    <input
                      id="checkOut"
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleChange}
                      required
                      min={formData.checkIn || today || undefined}
                      className={`input-field ${errors.checkOut ? 'border-red-600' : ''}`}
                      disabled={isSubmitting}
                      aria-invalid={errors.checkOut ? true : undefined}
                      aria-describedby={
                        errors.checkOut ? 'checkOut-error' : undefined
                      }
                    />
                    <FieldError id="checkOut-error" message={errors.checkOut} />
                  </div>
                </div>

                {/* Guests */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="guests"
                    className="font-body text-xs font-semibold uppercase tracking-wider text-warm-600 flex items-center gap-1.5"
                  >
                    <Users size={12} aria-hidden="true" />
                    Anzahl Personen *
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                    className="input-field"
                    disabled={isSubmitting}
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={String(n)}>
                        {n} {n === 1 ? 'Person' : 'Personen'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="message"
                    className="font-body text-xs font-semibold uppercase tracking-wider text-warm-600 flex items-center gap-1.5"
                  >
                    <MessageSquare size={12} aria-hidden="true" />
                    Nachricht oder besondere Wünsche
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Habt ihr besondere Wünsche, Fragen oder reist ihr mit Kindern an?"
                    className="input-field resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Spam trap – positioned off-screen rather than display:none so
                    that bots reading the markup still find it. */}
                <div className="absolute left-[-9999px]" aria-hidden="true">
                  <label htmlFor="website">
                    Dieses Feld bitte frei lassen
                  </label>
                  <input
                    id="website"
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(event) => setHoneypot(event.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {submitStatus === 'error' && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 border border-red-600 bg-red-50 p-4"
                  >
                    <AlertCircle
                      size={16}
                      className="mt-0.5 flex-shrink-0 text-red-700"
                      aria-hidden="true"
                    />
                    <p className="font-body text-sm text-red-800 leading-relaxed">
                      Das Senden hat leider nicht geklappt. Bitte versucht es
                      noch einmal – oder schreibt uns direkt an{' '}
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="underline underline-offset-2"
                      >
                        {CONTACT_EMAIL}
                      </a>{' '}
                      beziehungsweise ruft uns unter {CONTACT_PHONE} an.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full justify-center gap-2 py-4 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin"
                        aria-hidden="true"
                      />
                      Senden…
                    </>
                  ) : (
                    <>
                      <Send size={16} aria-hidden="true" />
                      Anfrage senden
                    </>
                  )}
                </button>

                <p className="font-body text-xs text-warm-400 text-center">
                  * Pflichtfelder. Eure Daten werden nicht an Dritte weitergegeben.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
