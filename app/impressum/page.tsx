export default function ImpressumPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #eefbff 0%, #ffffff 45%, #f7fbfc 100%)",
        padding: "70px 20px",
        color: "#16323f",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.94)",
          borderRadius: "24px",
          padding: "clamp(28px, 5vw, 60px)",
          boxShadow: "0 18px 55px rgba(20, 70, 90, 0.10)",
          border: "1px solid rgba(40, 130, 160, 0.10)",
        }}
      >
        <p
          style={{
            color: "#1686a5",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          LÜDIGO
        </p>

        <h1
          style={{
            fontSize: "clamp(36px, 6vw, 54px)",
            margin: "0 0 12px",
            lineHeight: 1.1,
          }}
        >
          Impressum
        </h1>

        <p
          style={{
            color: "#61727a",
            fontSize: "17px",
            marginBottom: "45px",
          }}
        >
          Anbieterinformationen zu LÜDIGO – Urlaub auf deine Art.
        </p>

        <section style={{ marginBottom: "38px" }}>
          <h2>Angaben gemäß § 5 DDG</h2>

          <p>
            <strong>LÜDIGO</strong>
            <br />
            Inhaber: Niklas Lüdemann
            <br />
            Zum Grunewald 7B
            <br />
            28857 Syke
            <br />
            Deutschland
          </p>
        </section>

        <section style={{ marginBottom: "38px" }}>
          <h2>Kontakt</h2>

          <p>
            E-Mail:{" "}
            <a
              href="mailto:Niklasluedemann468@googlemail.com"
              style={{ color: "#1686a5" }}
            >
              Niklasluedemann468@googlemail.com
            </a>
          </p>
        </section>

        <section style={{ marginBottom: "38px" }}>
          <h2>Über LÜDIGO</h2>

          <p>
            LÜDIGO ist eine Such- und Empfehlungsplattform für
            Reiseunterkünfte. Nutzer können anhand ihrer individuellen
            Wünsche nach passenden Unterkünften suchen.
          </p>

          <p>
            LÜDIGO ist grundsätzlich nicht selbst Anbieter der dargestellten
            Unterkünfte oder Reiseleistungen. Sofern Nutzer über einen Link
            zu einem externen Anbieter weitergeleitet werden, kommt ein
            etwaiger Vertrag über die jeweilige Leistung ausschließlich
            zwischen dem Nutzer und dem jeweiligen Anbieter zustande.
          </p>
        </section>

        <section style={{ marginBottom: "38px" }}>
          <h2>Haftung für externe Links</h2>

          <p>
            Diese Website kann Links zu externen Websites Dritter enthalten,
            auf deren Inhalte LÜDIGO keinen unmittelbaren Einfluss hat. Für
            die Inhalte der verlinkten Seiten ist grundsätzlich der jeweilige
            Anbieter oder Betreiber verantwortlich.
          </p>
        </section>

        <section style={{ marginBottom: "38px" }}>
          <h2>Urheberrecht</h2>

          <p>
            Die auf dieser Website erstellten eigenen Inhalte und Werke
            unterliegen dem deutschen Urheberrecht. Inhalte Dritter werden,
            soweit erforderlich, entsprechend gekennzeichnet. Eine
            Vervielfältigung, Bearbeitung oder Verwertung außerhalb der
            gesetzlichen Grenzen bedarf der Zustimmung des jeweiligen
            Rechteinhabers.
          </p>
        </section>

        <div
          style={{
            marginTop: "50px",
            paddingTop: "25px",
            borderTop: "1px solid #dce9ed",
          }}
        >
          <a
            href="/"
            style={{
              color: "#1686a5",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            ← Zurück zu LÜDIGO
          </a>
        </div>
      </div>
    </main>
  );
}