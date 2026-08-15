import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { LegalParagraph, LegalSection } from '@/components/LegalPage';
import {
  ADDRESS_LINES,
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  OPERATOR_NAME,
  PROPERTY_NAME,
} from '@/lib/site';

export const metadata: Metadata = {
  title: `Datenschutzerklärung | ${PROPERTY_NAME}`,
  description: `Wie die ${PROPERTY_NAME} mit personenbezogenen Daten umgeht: Hosting, Kontaktformular, Speicherdauer und eure Rechte nach DSGVO.`,
};

// Wording is deliberately concrete rather than generic: the site sets no
// cookies, self-hosts its fonts and contacts exactly one external service, so
// the declaration says that instead of hedging with boilerplate.
const LAST_UPDATED = 'August 2026';

type DataSubjectRight = {
  label: string;
  article: string;
  description: string;
};

const DATA_SUBJECT_RIGHTS: DataSubjectRight[] = [
  {
    label: 'Auskunft',
    article: 'Art. 15 DSGVO',
    description:
      'Ihr könnt erfahren, welche Daten wir zu euch gespeichert haben und wie wir sie verarbeiten.',
  },
  {
    label: 'Berichtigung',
    article: 'Art. 16 DSGVO',
    description:
      'Unrichtige Daten müssen wir korrigieren, unvollständige ergänzen.',
  },
  {
    label: 'Löschung',
    article: 'Art. 17 DSGVO',
    description:
      'Ihr könnt die Löschung eurer Daten verlangen, soweit keine gesetzliche Aufbewahrungspflicht entgegensteht.',
  },
  {
    label: 'Einschränkung der Verarbeitung',
    article: 'Art. 18 DSGVO',
    description:
      'In bestimmten Fällen dürfen wir eure Daten nur noch speichern, aber nicht weiter nutzen.',
  },
  {
    label: 'Datenübertragbarkeit',
    article: 'Art. 20 DSGVO',
    description:
      'Ihr könnt die Daten, die ihr uns gegeben habt, in einem gängigen Format erhalten.',
  },
  {
    label: 'Widerspruch',
    article: 'Art. 21 DSGVO',
    description:
      'Ihr könnt einer Verarbeitung widersprechen, die wir auf ein berechtigtes Interesse stützen.',
  },
];

const DatenschutzPage = (): React.JSX.Element => {
  return (
    <LegalPage
      title="Datenschutzerklärung"
      intro="Diese Website ist bewusst schlank gebaut. Sie setzt keine Cookies, misst keine Reichweite und bindet keine Werbe- oder Social-Media-Dienste ein. Personenbezogene Daten verarbeiten wir nur dort, wo es technisch nötig ist oder wo ihr uns von euch aus schreibt."
    >
      <LegalSection heading="Verantwortlicher">
        <LegalParagraph>
          Verantwortlich für die Datenverarbeitung auf dieser Website ist:
        </LegalParagraph>
        <address className="not-italic font-body text-sm text-accent leading-relaxed">
          <span className="block font-semibold">{OPERATOR_NAME}</span>
          <span className="block">{PROPERTY_NAME}</span>
          {ADDRESS_LINES.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          <span className="block mt-2">
            Telefon:{' '}
            <a
              href={CONTACT_PHONE_HREF}
              className="hover:text-warm-600 transition-colors duration-200"
            >
              {CONTACT_PHONE}
            </a>
          </span>
          <span className="block">
            E-Mail:{' '}
            <a
              href={CONTACT_EMAIL_HREF}
              className="hover:text-warm-600 transition-colors duration-200"
            >
              {CONTACT_EMAIL}
            </a>
          </span>
        </address>
      </LegalSection>

      <LegalSection heading="Keine Cookies, kein Tracking">
        <LegalParagraph>
          Beim Besuch dieser Website werden keine Cookies gesetzt und keine
          Daten in eurem Browser gespeichert. Es gibt keine Reichweitenmessung,
          keine Analyse-Werkzeuge, keine Werbenetzwerke und keine
          Social-Media-Plugins. Aus diesem Grund braucht diese Seite auch kein
          Einwilligungsbanner.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Hosting und Server-Logfiles">
        <LegalParagraph>
          Diese Website wird bei GitHub Pages gehostet, einem Dienst der GitHub,
          Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA.
        </LegalParagraph>
        <LegalParagraph>
          Beim Aufruf der Seite überträgt euer Browser technisch notwendige
          Daten, die beim Anbieter in Server-Logfiles verarbeitet werden. Dazu
          gehören insbesondere die IP-Adresse, Datum und Uhrzeit des Zugriffs,
          die abgerufene Datei sowie Angaben zu Browser und Betriebssystem.
          Diese Verarbeitung ist erforderlich, um die Website auszuliefern und
          ihren sicheren Betrieb zu gewährleisten. Rechtsgrundlage ist Art. 6
          Abs. 1 lit. f DSGVO. Wir selbst haben keinen Zugriff auf diese
          Logfiles. Eine Verarbeitung in den USA lässt sich dabei nicht
          ausschließen.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Schriftarten">
        <LegalParagraph>
          Die Schriftarten dieser Website werden beim Erstellen der Seite fest
          eingebunden und zusammen mit ihr ausgeliefert. Beim Aufruf der Seite
          wird keine Verbindung zu Servern von Google aufgebaut, und es werden
          keine Daten dorthin übertragen.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Kontaktformular">
        <LegalParagraph>
          Über das Kontaktformular könnt ihr uns eine Buchungsanfrage schicken.
          Dabei verarbeiten wir euren Namen, eure E-Mail-Adresse, auf Wunsch
          eure Telefonnummer sowie den gewünschten An- und Abreisetag, die
          Anzahl der Personen und eure Nachricht.
        </LegalParagraph>
        <LegalParagraph>
          Zweck der Verarbeitung ist die Bearbeitung eurer Anfrage und die
          Vorbereitung einer möglichen Buchung. Rechtsgrundlage ist Art. 6 Abs.
          1 lit. b DSGVO, da die Verarbeitung der Durchführung vorvertraglicher
          Maßnahmen dient.
        </LegalParagraph>
        <LegalParagraph>
          Für die Zustellung nutzen wir den Dienst Formhook. Formhook
          verarbeitet die Formulardaten in unserem Auftrag als
          Auftragsverarbeiter nach Art. 28 DSGVO und leitet sie an unser
          E-Mail-Postfach weiter.
        </LegalParagraph>
        <LegalParagraph>
          Die Formulardaten werden auf Servern der Hetzner Online GmbH in
          Deutschland gespeichert. Für die verschlüsselte Übertragung setzt
          Formhook Cloudflare ein, für den Versand der Benachrichtigungen den
          Dienst Resend mit Verarbeitung in der EU.
        </LegalParagraph>
        <LegalParagraph>
          Das Formular enthält zusätzlich ein für euch unsichtbares Feld, das
          automatisierte Einsendungen abfangen soll. Es wird nicht ausgewertet
          und speichert keine personenbezogenen Daten.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Kontakt per E-Mail oder Telefon">
        <LegalParagraph>
          Wenn ihr uns direkt schreibt oder anruft, verarbeiten wir eure Angaben
          ausschließlich, um euer Anliegen zu bearbeiten. Rechtsgrundlage ist
          Art. 6 Abs. 1 lit. b DSGVO bei einem Bezug zu einer Buchung,
          ansonsten Art. 6 Abs. 1 lit. f DSGVO.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Speicherdauer">
        <LegalParagraph>
          Anfragen, aus denen keine Buchung wird, löschen wir spätestens sechs
          Monate nach dem letzten Kontakt. Kommt eine Buchung zustande, bewahren
          wir die dazugehörigen Unterlagen so lange auf, wie es die gesetzlichen
          Aufbewahrungsfristen des Handels- und Steuerrechts vorschreiben.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Verschlüsselung">
        <LegalParagraph>
          Diese Website wird ausschließlich über eine verschlüsselte
          HTTPS-Verbindung ausgeliefert. Auch die Daten, die ihr über das
          Kontaktformular sendet, werden verschlüsselt übertragen.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Eure Rechte">
        <LegalParagraph>
          Ihr habt jederzeit die folgenden Rechte in Bezug auf eure
          personenbezogenen Daten:
        </LegalParagraph>
        <dl className="flex flex-col gap-3">
          {DATA_SUBJECT_RIGHTS.map((right) => (
            <div key={right.label} className="flex flex-col gap-0.5">
              <dt className="font-body text-sm font-semibold text-accent">
                {right.label}{' '}
                <span className="font-normal text-warm-500">
                  ({right.article})
                </span>
              </dt>
              <dd className="font-body text-sm text-accent-muted leading-relaxed">
                {right.description}
              </dd>
            </div>
          ))}
        </dl>
        <LegalParagraph>
          Für alle diese Anliegen genügt eine formlose Nachricht an{' '}
          <a
            href={CONTACT_EMAIL_HREF}
            className="underline underline-offset-2 hover:text-warm-600 transition-colors duration-200"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Beschwerderecht bei einer Aufsichtsbehörde">
        <LegalParagraph>
          Wenn ihr der Ansicht seid, dass wir eure Daten nicht rechtmäßig
          verarbeiten, könnt ihr euch bei einer Datenschutz-Aufsichtsbehörde
          beschweren. Für uns zuständig ist der Hessische Beauftragte für
          Datenschutz und Informationsfreiheit in Wiesbaden.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Änderungen dieser Erklärung">
        <LegalParagraph>
          Wir passen diese Datenschutzerklärung an, sobald sich die Website oder
          die Rechtslage ändert. Die Anbieterangaben findet ihr im{' '}
          <Link
            href="/impressum"
            className="underline underline-offset-2 hover:text-warm-600 transition-colors duration-200"
          >
            Impressum
          </Link>
          .
        </LegalParagraph>
        <LegalParagraph>Stand: {LAST_UPDATED}</LegalParagraph>
      </LegalSection>
    </LegalPage>
  );
};

export default DatenschutzPage;
