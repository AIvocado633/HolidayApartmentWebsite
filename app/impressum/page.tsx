import type { Metadata } from 'next';
import LegalPage, { LegalParagraph, LegalSection } from '@/components/LegalPage';
import {
  ADDRESS,
  ADDRESS_LINES,
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  OPERATOR_NAME,
  PROPERTY_NAME,
} from '@/lib/site';

export const metadata: Metadata = {
  title: `Impressum | ${PROPERTY_NAME}`,
  description: `Anbieterkennzeichnung nach § 5 DDG für die ${PROPERTY_NAME} in ${ADDRESS.city}.`,
};

const ImpressumPage = (): React.JSX.Element => {
  return (
    <LegalPage title="Impressum">
      <LegalSection heading="Angaben gemäß § 5 DDG">
        <address className="not-italic font-body text-sm text-accent leading-relaxed">
          <span className="block font-semibold">{OPERATOR_NAME}</span>
          <span className="block">{PROPERTY_NAME}</span>
          {ADDRESS_LINES.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
      </LegalSection>

      <LegalSection heading="Kontakt">
        <dl className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <dt className="font-body text-xs font-semibold uppercase tracking-widest text-warm-500">
              Telefon
            </dt>
            <dd className="font-body text-sm text-accent">
              <a
                href={CONTACT_PHONE_HREF}
                className="hover:text-warm-600 transition-colors duration-200"
              >
                {CONTACT_PHONE}
              </a>
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="font-body text-xs font-semibold uppercase tracking-widest text-warm-500">
              E-Mail
            </dt>
            <dd className="font-body text-sm text-accent">
              <a
                href={CONTACT_EMAIL_HREF}
                className="hover:text-warm-600 transition-colors duration-200"
              >
                {CONTACT_EMAIL}
              </a>
            </dd>
          </div>
        </dl>
      </LegalSection>

      <LegalSection heading="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
        <LegalParagraph>{OPERATOR_NAME}, Anschrift wie oben.</LegalParagraph>
      </LegalSection>

      <LegalSection heading="Verbraucherstreitbeilegung">
        <LegalParagraph>
          Wir sind nicht bereit und nicht verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Haftung für Inhalte">
        <LegalParagraph>
          Die Inhalte dieser Website haben wir mit Sorgfalt erstellt. Für ihre
          Richtigkeit, Vollständigkeit und Aktualität können wir jedoch keine
          Gewähr übernehmen. Als Diensteanbieter sind wir nach den allgemeinen
          Gesetzen für eigene Inhalte auf diesen Seiten verantwortlich.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Haftung für Links">
        <LegalParagraph>
          Diese Website verweist an einzelnen Stellen auf externe Websites
          Dritter, auf deren Inhalte wir keinen Einfluss haben. Für diese
          Inhalte ist stets der jeweilige Anbieter verantwortlich. Zum Zeitpunkt
          der Verlinkung waren keine Rechtsverstöße erkennbar. Sobald uns
          Rechtsverletzungen bekannt werden, entfernen wir solche Links
          umgehend.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Urheberrecht">
        <LegalParagraph>
          Die Texte und Fotos auf dieser Website sind urheberrechtlich
          geschützt. Eine Verwendung außerhalb der Grenzen des Urheberrechts
          bedarf unserer vorherigen schriftlichen Zustimmung.
        </LegalParagraph>
      </LegalSection>
    </LegalPage>
  );
};

export default ImpressumPage;
