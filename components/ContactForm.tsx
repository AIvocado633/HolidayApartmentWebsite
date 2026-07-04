'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Send, User, Mail, Phone, Calendar, Users, MessageSquare } from 'lucide-react';

type FormState = {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  message: string;
};

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

const ContactForm = (): React.JSX.Element => {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSubmitStatus('submitting');

    // Simulate async submission (replace with real API call)
    await new Promise<void>((resolve) => setTimeout(resolve, 1200));

    console.info('Booking enquiry submitted:', formData);
    setSubmitStatus('success');
    setFormData(INITIAL_FORM_STATE);

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitStatus('idle'), 5000);
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
              {[
                { label: 'E-Mail', value: 'hallo@XYZ-ferien.de' },
                { label: 'Telefon', value: '+49 1234 567890' },
                { label: 'Adresse', value: 'Dorfstraße 7, 97795 Schondra' },
                { label: 'Antwortzeit', value: 'Innerhalb von 24 Stunden' },
                { label: 'Check-in / Check-out', value: 'Ab 15:00 Uhr · bis 10:00 Uhr' },
                { label: 'Kaution', value: '200 € (wird nach Abreise zurücküberwiesen)' },
                { label: 'Anzahlung', value: '50 % zur Buchungsbestätigung erforderlich' },
              ].map(({ label, value }) => (
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
                      className="input-field"
                      disabled={isSubmitting}
                      autoComplete="name"
                    />
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
                      className="input-field"
                      disabled={isSubmitting}
                      autoComplete="email"
                    />
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
                      className="input-field"
                      disabled={isSubmitting}
                    />
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
                      className="input-field"
                      disabled={isSubmitting}
                    />
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
