export default function ImpressumPage() {
  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "60px 24px",
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.7,
      }}
    >
      <h1>Impressum</h1>

      <h2>Angaben gemäß § 5 DDG</h2>

      <p>
        [VOR- UND NACHNAME]
        <br />
        [STRASSE UND HAUSNUMMER]
        <br />
        [PLZ UND ORT]
        <br />
        Deutschland
      </p>

      <h2>Kontakt</h2>

      <p>
        E-Mail: [E-MAIL-ADRESSE]
      </p>

      <h2>Hinweis zu LÜDIGO</h2>

      <p>
        LÜDIGO ist eine Plattform zur Suche und Vermittlung von
        Reise- und Unterkunftsangeboten. Buchungen können über externe
        Anbieter erfolgen.
      </p>

      <p>
        <a href="/">← Zurück zu LÜDIGO</a>
      </p>
    </main>
  );
}