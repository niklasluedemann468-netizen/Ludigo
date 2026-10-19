"use client";

const worlds = [
  { icon: "🏨", title: "Unterkünfte", description: "Hotels, Ferienwohnungen und Campingplätze passend zu deinen Wünschen finden.", status: "active" },
  { icon: "🎁", title: "LÜDIGO Surprise", description: "Du bestimmst Budget und Interessen – wir entwickeln überraschende Kurztrip-Ideen.", status: "soon" },
  { icon: "🚲", title: "LÜDIGO Bike", description: "Radtouren, E-Bike-Ausflüge und mehrtägige Radreisen entdecken.", status: "soon" },
  { icon: "🚌", title: "Bustouren für Senioren", description: "Komfortable Busreisen mit Zustiegsorten in deiner Nähe finden.", status: "soon" },
] as const;

export default function TravelWorlds() {
  return (
    <section aria-labelledby="travel-worlds-title" style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 20px 72px" }}>
      <h2 id="travel-worlds-title" style={{ textAlign: "center", color: "#082f4f", fontSize: "clamp(26px, 4vw, 36px)", marginBottom: 12 }}>
        Wie möchtest du reisen?
      </h2>
      <p style={{ textAlign: "center", color: "#657986", marginBottom: 32 }}>
        Entdecke die Reisewelten von LÜDIGO – heute Unterkünfte, bald noch mehr Reiseideen.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 235px), 1fr))", gap: 18 }}>
        {worlds.map((world) => (
          <article key={world.title} style={{ background: "#fff", border: "1px solid #dce8ef", borderRadius: 20, padding: 24, boxShadow: "0 8px 24px rgba(8,47,79,.05)" }}>
            <div aria-hidden="true" style={{ fontSize: 34, marginBottom: 14 }}>{world.icon}</div>
            <h3 style={{ color: "#082f4f", fontSize: 20, margin: "0 0 12px" }}>{world.title}</h3>
            <p style={{ color: "#657986", lineHeight: 1.6, minHeight: 78 }}>{world.description}</p>
            {world.status === "active" ? (
              <a href="#suche" style={{ display: "inline-block", color: "#0788d1", fontWeight: 700, marginTop: 12 }}>Unterkunft finden →</a>
            ) : (
              <span style={{ display: "inline-block", marginTop: 12, color: "#657986", fontWeight: 700 }}>Demnächst</span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
