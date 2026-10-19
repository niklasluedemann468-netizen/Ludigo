import SurpriseSearchBox from "../components/SurpriseSearchBox";

export default function SurprisePage() {
  return (
    <main style={{ minHeight: "100vh", padding: "48px 20px", background: "#f2f6fa", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <a href="/" style={{ color: "#143b67", textDecoration: "none" }}>← Zurück zur Startseite</a>
        <h1 style={{ marginTop: 28, color: "#143b67" }}>LÜDIGO Surprise 🎁</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6 }}>Du bestimmst den Rahmen. Das Reiseziel bleibt eine Überraschung.</p>
        <SurpriseSearchBox />
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 18 }}>Testversion: Noch keine echte Reisevermittlung, Buchung oder Zahlung.</p>
      </div>
    </main>
  );
}
