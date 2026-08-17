import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { LegalParagraph, LegalSection } from '@/components/LegalPage';
import {
  ADDRESS_INLINE,
  AGB_LAST_UPDATED,
  CANCELLATION_TIERS,
  CHECK_IN_FROM,
  CHECK_OUT_UNTIL,
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  EXTRA_GUEST_PER_NIGHT_EUR,
  GUESTS_INCLUDED_IN_BASE_PRICE,
  KURTAXE_PER_PERSON_PER_DAY_EUR,
  MAX_GUESTS,
  MAX_PRICE_PER_NIGHT_EUR,
  OPERATOR_NAME,
  PAYMENT_METHODS,
  PRICE_PER_NIGHT_EUR,
  PROPERTY_NAME,
} from '@/lib/site';
import { formatEuros, formatGermanMonthYear } from '@/lib/dates';

export const metadata: Metadata = {
  title: `AGB | ${PROPERTY_NAME}`,
  description: `Buchungs- und Stornierungsbedingungen der ${PROPERTY_NAME}: wie ein Vertrag zustande kommt, was im Preis enthalten ist und was bei einer Absage gilt.`,
};

// Bumped whenever a clause changes, not whenever the file is touched. Lives in
// lib/site.ts because the sitemap publishes the same day as <lastmod>.
const LAST_UPDATED = formatGermanMonthYear(AGB_LAST_UPDATED);

const AgbPage = (): React.JSX.Element => {
  return (
    <LegalPage
      title="Allgemeine Geschäftsbedingungen"
      intro="Diese Bedingungen regeln, wie eine Buchung bei uns zustande kommt, was der Aufenthalt kostet und was gilt, wenn ihr eure Reise doch absagen müsst. Wir haben sie so kurz gehalten, wie es geht – bei Fragen dazu schreibt uns einfach."
    >
      <LegalSection heading="1. Geltungsbereich und Vertragspartner">
        <LegalParagraph>
          Diese Bedingungen gelten für die Vermietung der {PROPERTY_NAME},{' '}
          {ADDRESS_INLINE}, an Feriengäste. Vertragspartner sind{' '}
          {OPERATOR_NAME} als Vermieter und die Person, die die Buchung vornimmt
          – im Folgenden „Gast“.
        </LegalParagraph>
        <LegalParagraph>
          Der Gast haftet für die Verpflichtungen aller mitreisenden Personen
          wie für eigene.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="2. Zustandekommen des Vertrags">
        <LegalParagraph>
          Die Darstellung der Wohnung auf dieser Website, die Angaben im
          Belegungskalender und der dort errechnete Preis sind kein bindendes
          Angebot, sondern eine unverbindliche Einladung zur Anfrage.
        </LegalParagraph>
        <LegalParagraph>
          Mit dem Absenden des Anfrageformulars, einer E-Mail oder einem Anruf
          gebt ihr eine Buchungsanfrage ab. Ein Vertrag kommt erst zustande,
          wenn wir die Buchung in Textform – in der Regel per E-Mail –
          bestätigen. Erst mit dieser Bestätigung ist der Zeitraum verbindlich
          für euch reserviert.
        </LegalParagraph>
        <LegalParagraph>
          Der Belegungskalender wird regelmäßig aktualisiert, bildet aber nicht
          jede eingehende Anfrage in Echtzeit ab. Aus einem als frei angezeigten
          Zeitraum folgt deshalb kein Anspruch auf eine Buchung.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="3. Preise und Leistungen">
        <LegalParagraph>
          Der Übernachtungspreis beträgt ganzjährig{' '}
          {formatEuros(PRICE_PER_NIGHT_EUR)} pro Nacht für die gesamte Wohnung
          mit bis zu {GUESTS_INCLUDED_IN_BASE_PRICE} Personen. Für jede weitere
          Person berechnen wir {formatEuros(EXTRA_GUEST_PER_NIGHT_EUR)} pro
          Nacht. Bei voller Belegung mit {MAX_GUESTS} Personen ergibt das{' '}
          {formatEuros(MAX_PRICE_PER_NIGHT_EUR)} pro Nacht.
        </LegalParagraph>
        <LegalParagraph>
          Maßgeblich ist die Personenzahl, die ihr bei der Buchung angebt. Reist
          ihr zu mehr Personen an, berechnen wir den Aufpreis für die
          zusätzlichen Personen nach.
        </LegalParagraph>
        <LegalParagraph>
          Im Preis enthalten sind die Endreinigung, Bettwäsche und Handtücher,
          Strom, Wasser, Heizung sowie die Nutzung des WLAN. Eine gesonderte
          Reinigungsgebühr fällt nicht an.
        </LegalParagraph>
        <LegalParagraph>
          Nicht im Preis enthalten ist die Kurtaxe. Sie wird von der Gemeinde
          Hofbieber erhoben, beträgt{' '}
          {formatEuros(KURTAXE_PER_PERSON_PER_DAY_EUR)} pro Person und Tag und
          wird von uns im Namen der Gemeinde eingezogen und dorthin abgeführt.
        </LegalParagraph>
        <LegalParagraph>
          Wir sind Kleinunternehmer im Sinne des § 19 UStG. Die genannten Preise
          sind Endpreise; Umsatzsteuer wird nicht berechnet und in der Rechnung
          nicht ausgewiesen.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="4. Zahlung">
        <LegalParagraph>
          Mit der Buchungsbestätigung schicken wir euch eine Rechnung über den
          Übernachtungspreis und die Kurtaxe. Für die Zahlung habt ihr die Wahl
          zwischen zwei Wegen:
        </LegalParagraph>
        <dl className="flex flex-col gap-3">
          {PAYMENT_METHODS.map((method) => (
            <div key={method.id} className="flex flex-col gap-0.5">
              <dt className="font-body text-sm font-semibold text-accent">
                {method.label}
              </dt>
              <dd className="font-body text-sm text-accent-muted leading-relaxed">
                {method.description}
              </dd>
            </div>
          ))}
        </dl>
        <LegalParagraph>
          Welchen der beiden Wege ihr nutzen möchtet, könnt ihr schon im
          Anfrageformular auswählen – oder uns einfach schreiben. Bis zur
          Buchungsbestätigung lässt sich die Wahl jederzeit ändern. Eine
          Anzahlung verlangen wir nicht.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="5. Anreise und Abreise">
        <LegalParagraph>
          Die Wohnung steht euch am Anreisetag ab {CHECK_IN_FROM} zur Verfügung.
          Am Abreisetag bitten wir euch, sie bis {CHECK_OUT_UNTIL} zu verlassen.
          Abweichende Zeiten sind nach Absprache häufig möglich – fragt uns
          einfach.
        </LegalParagraph>
        <LegalParagraph>
          Die Schlüsselübergabe erfolgt persönlich. Sagt uns bitte rechtzeitig
          Bescheid, wenn ihr voraussichtlich am späten Abend eintrefft, damit
          wir die Übergabe abstimmen können.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="6. Stornierung durch euch">
        <LegalParagraph>
          Ihr könnt die Buchung jederzeit stornieren. Maßgeblich ist der Tag, an
          dem uns eure Stornierung in Textform erreicht – eine E-Mail an{' '}
          <a
            href={CONTACT_EMAIL_HREF}
            className="underline underline-offset-2 hover:text-warm-600 transition-colors duration-200"
          >
            {CONTACT_EMAIL}
          </a>{' '}
          genügt. Es gelten die folgenden Sätze, jeweils bezogen auf den
          Übernachtungspreis:
        </LegalParagraph>
        <dl className="flex flex-col gap-3">
          {CANCELLATION_TIERS.map((tier) => (
            <div
              key={tier.label}
              className="flex items-baseline justify-between gap-6 border-b border-beige pb-3 last:border-b-0 last:pb-0"
            >
              <dt className="font-body text-sm text-accent-muted leading-relaxed">
                {tier.label}
              </dt>
              <dd className="font-body text-sm font-semibold text-accent whitespace-nowrap">
                {tier.sharePercent === 0
                  ? 'kostenfrei'
                  : `${tier.sharePercent} %`}
              </dd>
            </div>
          ))}
        </dl>
        <LegalParagraph>
          Kurtaxe fällt für einen nicht angetretenen Aufenthalt nicht an und
          bleibt bei der Berechnung außer Betracht.
        </LegalParagraph>
        <LegalParagraph>
          Können wir die Wohnung im stornierten Zeitraum anderweitig vermieten,
          verringert sich die Stornogebühr um die dabei erzielten Einnahmen.
        </LegalParagraph>
        <LegalParagraph>
          Es steht euch frei nachzuweisen, dass uns durch die Stornierung kein
          oder ein wesentlich geringerer Schaden entstanden ist. In diesem Fall
          schuldet ihr nur den tatsächlich entstandenen Betrag.
        </LegalParagraph>
        <LegalParagraph>
          Die Stornogebühr wird unabhängig vom gewählten Zahlungsweg fällig.
          Hattet ihr Barzahlung bei Anreise vereinbart, stellen wir sie euch in
          Rechnung.
        </LegalParagraph>
        <LegalParagraph>
          Für den Fall einer kurzfristigen Absage empfehlen wir den Abschluss
          einer Reiserücktrittsversicherung.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="7. Rücktritt durch uns">
        <LegalParagraph>
          In Ausnahmefällen können wir vom Vertrag zurücktreten, etwa wenn die
          Wohnung durch höhere Gewalt, einen Wasserschaden oder einen ähnlichen
          unvorhersehbaren Umstand unbewohnbar geworden ist. In diesem Fall
          erstatten wir alle bereits geleisteten Zahlungen unverzüglich und in
          voller Höhe. Weitergehende Ansprüche bestehen nicht, es sei denn, wir
          haben den Umstand vorsätzlich oder grob fahrlässig zu vertreten.
        </LegalParagraph>
        <LegalParagraph>
          Dasselbe gilt, wenn die Buchung auf erkennbar falschen Angaben zur
          Personenzahl oder zum Zweck des Aufenthalts beruht.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="8. Nutzung der Wohnung">
        <LegalParagraph>
          Die Wohnung ist für höchstens {MAX_GUESTS} Personen ausgelegt und darf
          nur mit der bei der Buchung angegebenen Personenzahl belegt werden.
          Eine Untervermietung oder das Überlassen an Dritte ist nicht
          gestattet.
        </LegalParagraph>
        <LegalParagraph>
          Die Wohnung ist eine Nichtraucherwohnung. Haustiere können wir leider
          nicht aufnehmen. Bitte beachtet außerdem die ortsübliche Nachtruhe
          zwischen 22:00 und 7:00 Uhr.
        </LegalParagraph>
        <LegalParagraph>
          Die Endreinigung übernehmen wir – es genügt, wenn ihr die Wohnung
          besenrein und mit abgeräumtem Geschirr hinterlasst.
        </LegalParagraph>
        <LegalParagraph>
          Für Schäden, die ihr oder eure Mitreisenden schuldhaft verursacht,
          haftet ihr nach den gesetzlichen Bestimmungen. Sagt uns bitte
          Bescheid, sobald etwas zu Bruch geht oder nicht funktioniert – auch,
          damit wir es beheben können.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="9. Haftung">
        <LegalParagraph>
          Wir haften uneingeschränkt für Schäden aus der Verletzung des Lebens,
          des Körpers oder der Gesundheit sowie für Schäden, die auf Vorsatz
          oder grober Fahrlässigkeit beruhen.
        </LegalParagraph>
        <LegalParagraph>
          Im Übrigen haften wir nur für die Verletzung wesentlicher
          Vertragspflichten – also solcher Pflichten, deren Erfüllung die
          ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht und
          auf deren Einhaltung ihr regelmäßig vertrauen dürft. In diesem Fall
          ist die Haftung auf den vertragstypischen, vorhersehbaren Schaden
          begrenzt.
        </LegalParagraph>
        <LegalParagraph>
          Für Wertgegenstände steht in der Wohnung kein abschließbares Behältnis
          zur Verfügung. Eine Haftung für abhandengekommene Sachen richtet sich
          nach den gesetzlichen Vorschriften; die vorstehenden
          Haftungsbeschränkungen gelten entsprechend.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="10. Kein Widerrufsrecht">
        <LegalParagraph>
          Bei Verträgen über die Vermietung von Ferienwohnungen zu einem
          bestimmten Termin oder Zeitraum besteht nach § 312g Abs. 2 Nr. 9 BGB
          kein gesetzliches Widerrufsrecht. Das gilt auch dann, wenn die Buchung
          per Formular, E-Mail oder Telefon zustande gekommen ist.
        </LegalParagraph>
        <LegalParagraph>
          An die Stelle eines Widerrufs treten die Stornierungsbedingungen unter
          Ziffer 6.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="11. Schlussbestimmungen">
        <LegalParagraph>
          Änderungen und Ergänzungen des Vertrags bedürfen der Textform.
        </LegalParagraph>
        <LegalParagraph>
          Wir sind nicht bereit und nicht verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </LegalParagraph>
        <LegalParagraph>
          Sollte eine Bestimmung dieser Bedingungen unwirksam sein, bleibt der
          Vertrag im Übrigen wirksam; an die Stelle der unwirksamen Bestimmung
          treten die gesetzlichen Vorschriften.
        </LegalParagraph>
        <LegalParagraph>
          Es gilt deutsches Recht. Zwingende verbraucherschützende Vorschriften
          des Staates, in dem ihr euren gewöhnlichen Aufenthalt habt, bleiben
          davon unberührt.
        </LegalParagraph>
        <LegalParagraph>
          Die Anbieterangaben findet ihr im{' '}
          <Link
            href="/impressum"
            className="underline underline-offset-2 hover:text-warm-600 transition-colors duration-200"
          >
            Impressum
          </Link>
          , den Umgang mit euren Daten in der{' '}
          <Link
            href="/datenschutz"
            className="underline underline-offset-2 hover:text-warm-600 transition-colors duration-200"
          >
            Datenschutzerklärung
          </Link>
          .
        </LegalParagraph>
        <LegalParagraph>Stand: {LAST_UPDATED}</LegalParagraph>
      </LegalSection>
    </LegalPage>
  );
};

export default AgbPage;
