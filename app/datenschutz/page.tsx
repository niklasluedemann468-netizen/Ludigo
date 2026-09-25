export default function DatenschutzPage() {
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
          Datenschutzerklärung
        </h1>

        <p
          style={{
            color: "#61727a",
            fontSize: "17px",
            marginBottom: "45px",
          }}
        >
          Informationen über die Verarbeitung personenbezogener Daten
          bei der Nutzung von LÜDIGO.
        </p>

        <section style={{ marginBottom: "38px" }}>
          <h2>1. Verantwortlicher</h2>

          <p>
            Mandy Lüdemann
            <br />
            LÜDIGO
            <br />
            Zum Grunewald 7B
            <br />
            28857 Syke
            <br />
            Deutschland
          </p>

          <p>
            E-Mail:{" "}
            <a
              href="mailto:info@ludigo-travel.com"
              style={{ color: "#1686a5" }}
            >
              info@ludigo-travel.com
            </a>
          </p>
        </section>

        <section style={{ marginBottom: "38px" }}>
          <h2>2. Allgemeine Hinweise</h2>

          <p>
            Personenbezogene Daten sind Informationen, mit denen eine
            natürliche Person direkt oder indirekt identifiziert werden
            kann. LÜDIGO verarbeitet personenbezogene Daten nur soweit
            dies für den Betrieb der Website und die Bereitstellung der
            angebotenen Funktionen erforderlich ist oder eine sonstige
            Rechtsgrundlage besteht.
          </p>
        </section>

        <section style={{ marginBottom: "38px" }}>
          <h2>3. Hosting über Vercel</h2>

          <p>
            Diese Website wird über Vercel bereitgestellt. Anbieter ist
            Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.
          </p>

          <p>
            Beim Aufruf der Website können technisch erforderliche
            Informationen verarbeitet werden. Dazu können insbesondere
            IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seiten,
            Browser- und Geräteinformationen sowie technische Protokoll-
            und Diagnosedaten gehören.
          </p>

          <p>
            Die Verarbeitung erfolgt zur sicheren, stabilen und
            funktionsfähigen Bereitstellung dieser Website. Soweit die
            Verarbeitung auf unseren berechtigten Interessen beruht, ist
            Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes
            Interesse liegt insbesondere im sicheren und zuverlässigen
            Betrieb unseres Online-Angebots.
          </p>
        </section>

        <section style={{ marginBottom: "38px" }}>
          <h2>4. Datenbank und Infrastruktur über Supabase</h2>

          <p>
            LÜDIGO verwendet Supabase als technische Datenbank- und
            Backend-Infrastruktur. Dabei werden insbesondere Daten
            verarbeitet, die für die Bereitstellung und Durchführung der
            Unterkunftssuche erforderlich sind.
          </p>

          <p>
            Welche Daten im Einzelfall verarbeitet werden, hängt von der
            Nutzung der angebotenen Funktionen ab. Die Verarbeitung dient
            insbesondere der Bereitstellung von Unterkunftsdaten und
            Suchergebnissen.
          </p>

          <p>
            Soweit personenbezogene Daten verarbeitet werden und keine
            speziellere Rechtsgrundlage eingreift, erfolgt die Verarbeitung
            auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes
            Interesse besteht in der technischen Bereitstellung einer
            funktionsfähigen Unterkunftssuche.
          </p>
        </section>

        <section style={{ marginBottom: "38px" }}>
          <h2>5. KI-gestützte Verarbeitung von Suchanfragen</h2>

          <p>
            LÜDIGO verwendet für bestimmte Suchanfragen Dienste von OpenAI.
            Anbieter ist OpenAI.
          </p>

          <p>
            Die KI-Unterstützung wird insbesondere eingesetzt, wenn eine
            frei formulierte Suchanfrage durch die lokale Suchlogik nicht
            ausreichend strukturiert werden kann. In diesem Fall kann der
            eingegebene Suchtext an die OpenAI API übermittelt und dort
            verarbeitet werden, um Suchkriterien zu erkennen und passende
            Suchparameter zu erzeugen.
          </p>

          <p>
            Nutzer sollten in das Suchfeld keine sensiblen oder für die
            Unterkunftssuche nicht erforderlichen personenbezogenen Daten
            eingeben.
          </p>

          <p>
            Nach Angaben von OpenAI werden Daten, die über die API
            verarbeitet werden, standardmäßig nicht zum Training oder zur
            Verbesserung der Modelle verwendet. Abhängig von der
            verwendeten API-Funktion und den für das Konto eingerichteten
            Datenkontrollen können Daten für einen begrenzten Zeitraum
            gespeichert werden, insbesondere zur Missbrauchserkennung und
            Sicherheit.
          </p>

          <p>
            Soweit die Verarbeitung auf unseren berechtigten Interessen
            beruht, erfolgt sie gemäß Art. 6 Abs. 1 lit. f DSGVO. Unser
            berechtigtes Interesse besteht darin, natürlich formulierte
            Suchanfragen in für die Unterkunftssuche geeignete Kriterien
            umzuwandeln und dadurch die Suchfunktion bereitzustellen.
          </p>
        </section>

        <section style={{ marginBottom: "38px" }}>
          <h2>6. Weiterleitung zu externen Anbietern</h2>

          <p>
            LÜDIGO kann Links zu externen Unterkunfts-, Reise- oder
            Buchungsanbietern enthalten. Wenn ein Nutzer einen solchen
            Link aufruft, verlässt er LÜDIGO. Für die anschließende
            Verarbeitung personenbezogener Daten ist grundsätzlich der
            jeweilige externe Anbieter nach Maßgabe seiner eigenen
            Datenschutzerklärung verantwortlich.
          </p>

          <p>
            Sofern künftig Affiliate- oder Tracking-Technologien eingesetzt
            werden, wird diese Datenschutzerklärung entsprechend ergänzt.
            Soweit hierfür eine Einwilligung erforderlich ist, werden solche
            Technologien erst nach Erteilung der erforderlichen Einwilligung
            eingesetzt.
          </p>
        </section>

        <section style={{ marginBottom: "38px" }}>
          <h2>7. Speicherdauer</h2>

          <p>
            Personenbezogene Daten werden grundsätzlich nur so lange
            verarbeitet, wie dies für den jeweiligen Zweck erforderlich ist.
            Gesetzliche Aufbewahrungspflichten bleiben unberührt.
          </p>
        </section>

        <section style={{ marginBottom: "38px" }}>
          <h2>8. Rechte betroffener Personen</h2>

          <p>
            Betroffene Personen haben nach Maßgabe der gesetzlichen
            Voraussetzungen insbesondere das Recht auf Auskunft über ihre
            personenbezogenen Daten sowie auf Berichtigung, Löschung oder
            Einschränkung der Verarbeitung. Außerdem können Rechte auf
            Datenübertragbarkeit und Widerspruch bestehen.
          </p>

          <p>
            Soweit eine Verarbeitung auf einer Einwilligung beruht, kann
            diese Einwilligung grundsätzlich mit Wirkung für die Zukunft
            widerrufen werden.
          </p>
        </section>

        <section style={{ marginBottom: "38px" }}>
          <h2>9. Beschwerderecht</h2>

          <p>
            Betroffene Personen haben das Recht, sich bei einer zuständigen
            Datenschutzaufsichtsbehörde über die Verarbeitung ihrer
            personenbezogenen Daten zu beschweren.
          </p>
        </section>

        <section>
          <h2>10. Aktualisierung dieser Datenschutzerklärung</h2>

          <p>
            Diese Datenschutzerklärung wird angepasst, wenn sich die
            eingesetzten Dienste, Funktionen oder gesetzlichen Anforderungen
            ändern.
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