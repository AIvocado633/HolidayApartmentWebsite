import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type LegalPageProps = {
  title: string;
  intro?: string;
  children: React.ReactNode;
};

type LegalSectionProps = {
  heading: string;
  children: React.ReactNode;
};

type LegalParagraphProps = {
  children: React.ReactNode;
};

export const LegalSection = ({
  heading,
  children,
}: LegalSectionProps): React.JSX.Element => {
  return (
    <section aria-label={heading} className="flex flex-col gap-3">
      <h2 className="heading-sm text-accent">{heading}</h2>
      {children}
    </section>
  );
};

export const LegalParagraph = ({
  children,
}: LegalParagraphProps): React.JSX.Element => {
  return (
    <p className="font-body text-sm text-accent-muted leading-relaxed">
      {children}
    </p>
  );
};

const LegalPage = ({
  title,
  intro,
  children,
}: LegalPageProps): React.JSX.Element => {
  return (
    <div className="bg-cream">
      {/* The header is fixed, so the first block has to clear its height. */}
      <div className="section-container section-padding pt-32 pb-20 md:pb-28 max-w-3xl">
        <header className="flex flex-col gap-4 mb-12">
          <p className="label-overline">Rechtliches</p>
          <h1 className="heading-lg">{title}</h1>
          {intro !== undefined && (
            <p className="font-body text-base text-accent-muted leading-relaxed">
              {intro}
            </p>
          )}
        </header>

        <div className="flex flex-col gap-10">{children}</div>

        <div className="mt-14 pt-8 border-t border-beige">
          <Link href="/" className="btn-ghost gap-2 pl-0">
            <ArrowLeft size={16} aria-hidden="true" />
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
