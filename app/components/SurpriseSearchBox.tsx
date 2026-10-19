"use client";
import { useState } from "react";
import {
  matchSurprises,
  type SurprisePreference,
  type SurpriseRequest,
  type SurpriseMatches,
  type SurpriseIdea,
} from "../lib/surpriseMatcher";
const preferences: SurprisePreference[] = [
  "Strand & Meer",
  "Natur",
  "Städtereise",
  "Wellness",
  "Aktivurlaub",
];
type ContactData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  wishes: string;
  privacyAccepted: boolean;
};
const emptyContact: ContactData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  wishes: "",
  privacyAccepted: false,
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px",
  border: "1px solid #d5dfeb",
  borderRadius: 10,
  fontSize: 16,
  boxSizing: "border-box",
  background: "#ffffff",
};
const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "15px",
  border: "none",
  borderRadius: 10,
  background: "#173b67",
  color: "#ffffff",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
};
function formatDate(value: string) {
  if (!value) return "Nicht angegeben";
  const [year, month, day] = value.split("-");
  return `${day}.${month}.${year}`;
}
export default function SurpriseSearchBox() {
  const [departure, setDeparture] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState("");
  const [selectedPreferences, setSelectedPreferences] =
    useState<SurprisePreference[]>([]);
  const [request, setRequest] =
    useState<SurpriseRequest | null>(null);
  const [matches, setMatches] =
    useState<SurpriseMatches | null>(null);
  const [selectedIdeaId, setSelectedIdeaId] =
    useState<string | null>(null);
  const [showContactForm, setShowContactForm] =
    useState(false);
  const [contact, setContact] =
    useState<ContactData>(emptyContact);
  const [showPreview, setShowPreview] =
    useState(false);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sentRequestId, setSentRequestId] = useState<string | null>(null);
  const [sendError, setSendError] = useState("");

  function resetResults() {
    setRequest(null);
    setMatches(null);
    setSelectedIdeaId(null);
    setShowContactForm(false);
    setShowPreview(false);
    setError("");
    setSentRequestId(null);
    setSendError("");
  }
  function togglePreference(
    preference: SurprisePreference
  ) {
    setSelectedPreferences((current) =>
      current.includes(preference)
        ? current.filter((item) => item !== preference)
        : [...current, preference]
    );
    resetResults();
  }
  function handleSearch(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    if (!departure.trim()) {
      setError("Bitte gib einen Abfahrtsort ein.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Bitte wähle einen Reisezeitraum.");
      return;
    }
    if (endDate < startDate) {
      setError(
        "Die Rückreise darf nicht vor der Abreise liegen."
      );
      return;
    }
    if (!Number.isInteger(travelers) || travelers < 1) {
      setError(
        "Bitte gib eine gültige Personenzahl ein."
      );
      return;
    }
    if (
      budget.trim() !== "" &&
      (!Number.isFinite(Number(budget)) ||
        Number(budget) <= 0)
    ) {
      setError(
        "Bitte gib ein gültiges Gesamtbudget ein."
      );
      return;
    }
    const nextRequest: SurpriseRequest = {
      departure: departure.trim(),
      startDate,
      endDate,
      travelers,
      budget,
      preferences: selectedPreferences,
    };
    const nextMatches = matchSurprises(nextRequest);
    setRequest(nextRequest);
    setMatches(nextMatches);
    setSelectedIdeaId(
      nextMatches.ideas[0]?.id ?? null
    );
    setShowContactForm(false);
    setShowPreview(false);
    setContact(emptyContact);
    setSentRequestId(null);
    setSendError("");
  }
  function selectIdea(id: string) {
    setSelectedIdeaId(id);
    setShowContactForm(false);
    setShowPreview(false);
    setContact(emptyContact);
    setSentRequestId(null);
    setSendError("");
  }
  function prepareRequest(id: string) {
    setSelectedIdeaId(id);
    setShowContactForm(true);
    setShowPreview(false);
    setContact(emptyContact);
    setError("");
    setSentRequestId(null);
    setSendError("");
    window.setTimeout(() => {
      document
        .getElementById("surprise-contact")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }
  function updateContact(
    field: keyof ContactData,
    value: string | boolean
  ) {
    setContact((current) => ({
      ...current,
      [field]: value,
    }));
    setShowPreview(false);
    setError("");
    setSendError("");
  }
  function handleContactSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    if (
      !contact.firstName.trim() ||
      !contact.lastName.trim()
    ) {
      setError(
        "Bitte gib deinen Vor- und Nachnamen ein."
      );
      return;
    }
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        contact.email.trim()
      )
    ) {
      setError(
        "Bitte gib eine gültige E-Mail-Adresse ein."
      );
      return;
    }
    if (!contact.privacyAccepted) {
      setError(
        "Bitte bestätige, dass du die Datenschutzhinweise gelesen hast."
      );
      return;
    }
    setError("");
    setShowPreview(true);
  }
  async function sendSurpriseRequest() {
    if (!request || !selectedIdeaId || !showPreview || isSending || sentRequestId) return;
    setIsSending(true);
    setSendError("");
    try {
      const response = await fetch("/api/surprise/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: contact.firstName.trim(),
          lastName: contact.lastName.trim(),
          email: contact.email.trim(),
          phone: contact.phone.trim() || null,
          departure: request.departure,
          startDate: request.startDate,
          endDate: request.endDate,
          travelers: request.travelers,
          budget: request.budget.trim() === "" ? null : Number(request.budget),
          preferences: request.preferences,
          selectedIdea: selectedIdeaId,
          additionalWishes: contact.wishes.trim() || null,
          privacyAccepted: contact.privacyAccepted,
          website: "",
        }),
      });
      const result: { success?: boolean; requestId?: string; error?: string } =
        await response.json();
      if (!response.ok || !result.success || !result.requestId) {
        throw new Error(result.error || "Die Anfrage konnte nicht gespeichert werden.");
      }
      setSentRequestId(result.requestId);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten.");
    } finally {
      setIsSending(false);
    }
  }

  const orderedIdeas = matches
    ? [
        ...matches.ideas.filter(
          (idea) => idea.id === selectedIdeaId
        ),
        ...matches.ideas.filter(
          (idea) => idea.id !== selectedIdeaId
        ),
      ]
    : [];
  const selectedIdea: SurpriseIdea | undefined =
    matches?.ideas.find(
      (idea) => idea.id === selectedIdeaId
    );
  return (
    <div
      style={{
        width: "100%",
        color: "#173b67",
      }}
    >
      <form
        onSubmit={handleSearch}
        style={{
          background: "#ffffff",
          borderRadius: 20,
          padding: 24,
          boxShadow:
            "0 8px 30px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="surprise-departure"
            style={{ fontWeight: 700 }}
          >
            Abfahrtsort
          </label>
          <input
            id="surprise-departure"
            style={{
              ...inputStyle,
              marginTop: 8,
            }}
            placeholder="z. B. Bremen"
            value={departure}
            onChange={(event) => {
              setDeparture(event.target.value);
              resetResults();
            }}
            required
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <label
              htmlFor="surprise-start"
              style={{ fontWeight: 700 }}
            >
              Früheste Abreise
            </label>
            <input
              id="surprise-start"
              type="date"
              style={{
                ...inputStyle,
                marginTop: 8,
              }}
              value={startDate}
              onChange={(event) => {
                setStartDate(event.target.value);
                resetResults();
              }}
              required
            />
          </div>
          <div>
            <label
              htmlFor="surprise-end"
              style={{ fontWeight: 700 }}
            >
              Späteste Rückreise
            </label>
            <input
              id="surprise-end"
              type="date"
              min={startDate || undefined}
              style={{
                ...inputStyle,
                marginTop: 8,
              }}
              value={endDate}
              onChange={(event) => {
                setEndDate(event.target.value);
                resetResults();
              }}
              required
            />
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <label
              htmlFor="surprise-travelers"
              style={{ fontWeight: 700 }}
            >
              Reisende
            </label>
            <input
              id="surprise-travelers"
              type="number"
              min={1}
              step={1}
              style={{
                ...inputStyle,
                marginTop: 8,
              }}
              value={travelers}
              onChange={(event) => {
                setTravelers(
                  Number(event.target.value)
                );
                resetResults();
              }}
              required
            />
          </div>
          <div>
            <label
              htmlFor="surprise-budget"
              style={{ fontWeight: 700 }}
            >
              Gesamtbudget in € (optional)
            </label>
            <input
              id="surprise-budget"
              type="number"
              min={1}
              step="0.01"
              style={{
                ...inputStyle,
                marginTop: 8,
              }}
              placeholder="z. B. 800"
              value={budget}
              onChange={(event) => {
                setBudget(event.target.value);
                resetResults();
              }}
            />
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontWeight: 700 }}>
            Was magst du? (Mehrfachauswahl)
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {preferences.map((preference) => {
              const active =
                selectedPreferences.includes(
                  preference
                );
              return (
                <button
                  key={preference}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    togglePreference(preference)
                  }
                  style={{
                    padding: "12px 16px",
                    borderRadius: 25,
                    border: active
                      ? "2px solid #d9a000"
                      : "1px solid #d5dfeb",
                    background: active
                      ? "#fff3c4"
                      : "#f8fafc",
                    color: "#173b67",
                    cursor: "pointer",
                    fontSize: 15,
                  }}
                >
                  {active ? "✓ " : ""}
                  {preference}
                </button>
              );
            })}
          </div>
        </div>
        <button
          type="submit"
          style={buttonStyle}
        >
          Überraschungsreise entdecken
        </button>
      </form>
      {request && matches && (
        <section
          style={{
            marginTop: 24,
            padding: 24,
            background: "#edf5ff",
            border: "1px solid #c7ddff",
            borderRadius: 18,
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            🎁 Dein LÜDIGO Surprise-Profil
          </h2>
          <p>
            Deine Wünsche stehen fest – das
            Reiseziel bleibt geheim!
          </p>
          <p>
            <strong>Abfahrtsort:</strong>{" "}
            {request.departure}
          </p>
          <p>
            <strong>Reisezeitraum:</strong>{" "}
            {formatDate(request.startDate)} bis{" "}
            {formatDate(request.endDate)}
          </p>
          <p>
            <strong>Reisende:</strong>{" "}
            {request.travelers}
          </p>
          <p>
            <strong>Gesamtbudget:</strong>{" "}
            {request.budget
              ? `${Number(
                  request.budget
                ).toLocaleString("de-DE")} €`
              : "Noch offen"}
          </p>
          <p>
            <strong>Vorlieben:</strong>{" "}
            {request.preferences.length
              ? request.preferences.join(", ")
              : "Offen für Überraschungen"}
          </p>
          <p>
            <strong>Reiseziel:</strong>{" "}
            🔒 Bleibt eine Überraschung
          </p>
          <hr
            style={{
              border: 0,
              borderTop:
                "1px solid #c7ddff",
              margin: "24px 0",
            }}
          />
          <h2>
            🎁{" "}
            {matches.ideas.length === 1
              ? "Deine Überraschungsidee"
              : "Deine Überraschungsideen"}
          </h2>
          <p>
            Dein mögliches Reisefenster
            umfasst {matches.windowDays}{" "}
            Kalendertage.
          </p>
          {matches.budgetPerPerson !== null && (
            <p>
              Rechnerisches Budget:{" "}
              {matches.budgetPerPerson.toLocaleString(
                "de-DE",
                {
                  maximumFractionDigits: 2,
                }
              )}{" "}
              € pro Person insgesamt.
            </p>
          )}
          <p>
            Klicke auf eine Kachel, um sie
            nach vorne zu holen.
          </p>
          <div
            style={{
              display: "grid",
              gap: 16,
              marginTop: 18,
            }}
          >
            {orderedIdeas.map((idea) => {
              const selected =
                idea.id === selectedIdeaId;
              return (
                <article
                  key={idea.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selected}
                  onClick={() =>
                    selectIdea(idea.id)
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      selectIdea(idea.id);
                    }
                  }}
                  style={{
                    background: selected
                      ? "#fffdf5"
                      : "#ffffff",
                    border: selected
                      ? "3px solid #dfa800"
                      : "2px solid #d5dfeb",
                    borderRadius: 16,
                    padding: 20,
                    cursor: "pointer",
                  }}
                >
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      marginTop: 0,
                    }}
                  >
                    {selected
                      ? "✓ DEINE AUSGEWÄHLTE IDEE"
                      : "WEITERE REISEIDEE"}
                  </p>
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 500,
                    }}
                  >
                    🎁 {idea.title}
                  </h3>
                  <p>{idea.teaser}</p>
                  <ul>
                    {idea.highlights.map(
                      (highlight) => (
                        <li key={highlight}>
                          {highlight}
                        </li>
                      )
                    )}
                  </ul>
                  <p style={{ fontSize: 14 }}>
                    <strong>
                      Warum diese Idee?
                    </strong>{" "}
                    {idea.reason}
                  </p>
                  {selected && (
                    <>
                      <p
                        style={{
                          display: "inline-block",
                          background: "#fff2bd",
                          borderRadius: 10,
                          padding: 12,
                          fontWeight: 700,
                        }}
                      >
                        ✓ Ausgewählt – oben angezeigt
                      </p>
                      <button
                        type="button"
                        style={buttonStyle}
                        onClick={(event) => {
                          event.stopPropagation();
                          prepareRequest(idea.id);
                        }}
                      >
                        Anfrage für diese Idee
                        vorbereiten →
                      </button>
                    </>
                  )}
                </article>
              );
            })}
          </div>
          <p
            style={{
              marginTop: 22,
              fontSize: 13,
            }}
          >
            {matches.note}
          </p>
        </section>
      )}
      {showContactForm &&
        request &&
        selectedIdea && (
          <section
            id="surprise-contact"
            style={{
              marginTop: 24,
              background: "#ffffff",
              border: "2px solid #dfa800",
              borderRadius: 18,
              padding: 24,
            }}
          >
            <h2>
              ✉️ Deine unverbindliche
              Surprise-Anfrage
            </h2>
            <p>
              <strong>Gewählte Idee:</strong>{" "}
              {selectedIdea.title}
            </p>
            <p>
              <strong>Abfahrtsort:</strong>{" "}
              {request.departure}
            </p>
            <p>
              <strong>Reisefenster:</strong>{" "}
              {formatDate(request.startDate)}{" "}
              bis{" "}
              {formatDate(request.endDate)}
            </p>
            <p>
              <strong>Reisende:</strong>{" "}
              {request.travelers}
            </p>
            <p>
              <strong>Gesamtbudget:</strong>{" "}
              {request.budget
                ? `${Number(
                    request.budget
                  ).toLocaleString("de-DE")} €`
                : "Noch offen"}
            </p>
            <p>
              <strong>Vorlieben:</strong>{" "}
              {request.preferences.length
                ? request.preferences.join(", ")
                : "Offen"}
            </p>
            <p>
              <strong>Reiseziel:</strong>{" "}
              🔒 Noch geheim
            </p>
            <h3 style={{ marginTop: 30 }}>
              Deine Kontaktdaten
            </h3>
            <form
              onSubmit={handleContactSubmit}
              style={{
                display: "grid",
                gap: 16,
              }}
            >
              <div>
                <label
                  htmlFor="contact-first"
                  style={{ fontWeight: 700 }}
                >
                  Vorname *
                </label>
                <input
                  id="contact-first"
                  style={inputStyle}
                  value={contact.firstName}
                  onChange={(event) =>
                    updateContact(
                      "firstName",
                      event.target.value
                    )
                  }
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="contact-last"
                  style={{ fontWeight: 700 }}
                >
                  Nachname *
                </label>
                <input
                  id="contact-last"
                  style={inputStyle}
                  value={contact.lastName}
                  onChange={(event) =>
                    updateContact(
                      "lastName",
                      event.target.value
                    )
                  }
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  style={{ fontWeight: 700 }}
                >
                  E-Mail-Adresse *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  style={inputStyle}
                  value={contact.email}
                  onChange={(event) =>
                    updateContact(
                      "email",
                      event.target.value
                    )
                  }
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="contact-phone"
                  style={{ fontWeight: 700 }}
                >
                  Telefonnummer (optional)
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  style={inputStyle}
                  value={contact.phone}
                  onChange={(event) =>
                    updateContact(
                      "phone",
                      event.target.value
                    )
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="contact-wishes"
                  style={{ fontWeight: 700 }}
                >
                  Zusätzliche Reisewünsche
                  (optional)
                </label>
                <textarea
                  id="contact-wishes"
                  rows={4}
                  style={inputStyle}
                  placeholder="z. B. keine Flugreise, besondere Bedürfnisse ..."
                  value={contact.wishes}
                  onChange={(event) =>
                    updateContact(
                      "wishes",
                      event.target.value
                    )
                  }
                />
              </div>
              <label
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  lineHeight: 1.6,
                }}
              >
                <input
                  type="checkbox"
                  checked={
                    contact.privacyAccepted
                  }
                  onChange={(event) =>
                    updateContact(
                      "privacyAccepted",
                      event.target.checked
                    )
                  }
                  style={{
                    marginTop: 6,
                  }}
                  required
                />
<span>
  Ich habe die{" "}
  <a
    href="/datenschutz"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: "#173b67",
      fontWeight: 700,
      textDecoration: "underline",
    }}
  >
    Datenschutzerklärung
  </a>{" "}
  gelesen und möchte meine Anfragevorschau erstellen.
  Es werden noch keine Daten versendet.
</span>
              </label>
              {error && (
                <p
                  role="alert"
                  style={{
                    color: "#b42318",
                    fontWeight: 700,
                  }}
                >
                  {error}
                </p>
              )}
              <button
                type="submit"
                style={buttonStyle}
              >
                Anfragevorschau erstellen →
              </button>
            </form>
            {showPreview && (
              <div
                style={{
                  marginTop: 24,
                  padding: 20,
                  background: "#edf8ef",
                  border:
                    "1px solid #a6d6b0",
                  borderRadius: 14,
                }}
              >
                <h3>
                  ✓ Deine Anfragevorschau
                  ist fertig
                </h3>
                <p>
                  <strong>Name:</strong>{" "}
                  {contact.firstName}{" "}
                  {contact.lastName}
                </p>
                <p>
                  <strong>E-Mail:</strong>{" "}
                  {contact.email}
                </p>
                {contact.phone && (
                  <p>
                    <strong>Telefon:</strong>{" "}
                    {contact.phone}
                  </p>
                )}
                <p>
                  <strong>Reiseidee:</strong>{" "}
                  {selectedIdea.title}
                </p>
                <p>
                  <strong>Abfahrtsort:</strong>{" "}
                  {request.departure}
                </p>
                <p>
                  <strong>Reisezeitraum:</strong>{" "}
                  {formatDate(
                    request.startDate
                  )}{" "}
                  bis{" "}
                  {formatDate(
                    request.endDate
                  )}
                </p>
                <p>
                  <strong>Reisende:</strong>{" "}
                  {request.travelers}
                </p>
                <p>
                  <strong>Budget:</strong>{" "}
                  {request.budget
                    ? `${Number(
                        request.budget
                      ).toLocaleString(
                        "de-DE"
                      )} €`
                    : "Noch offen"}
                </p>
                {contact.wishes && (
                  <p>
                    <strong>
                      Zusatzwünsche:
                    </strong>{" "}
                    {contact.wishes}
                  </p>
                )}
                <p>
                  <strong>Reiseziel:</strong>{" "}
                  🔒 Bleibt geheim
                </p>
                <p
                  style={{
                    marginTop: 20,
                    fontWeight: 700,
                  }}
                >
                  Die Vorschau ist unverbindlich. Erst mit dem folgenden Button
                  wird deine Anfrage gespeichert. Es erfolgt keine Reisebuchung.
                </p>
                {sentRequestId ? (
                  <div role="status" style={{ padding: 16, background: "#d7f4df", borderRadius: 10 }}>
                    <strong>✓ Deine Anfrage wurde erfolgreich gespeichert.</strong>
                    <p>Deine Anfrage-ID: <strong>{sentRequestId}</strong></p>
                    <p>Dies ist noch keine Reisebuchung. Eine E-Mail-Benachrichtigung ist noch nicht eingerichtet.</p>
                  </div>
                ) : (
                  <>
                    {sendError && <p role="alert" style={{ color: "#b42318", fontWeight: 700 }}>{sendError}</p>}
                    <button
                      type="button"
                      onClick={sendSurpriseRequest}
                      disabled={isSending}
                      style={{ ...buttonStyle, opacity: isSending ? 0.65 : 1 }}
                    >
                      {isSending ? "Anfrage wird gespeichert …" : "Unverbindliche Anfrage absenden →"}
                    </button>
                    <p style={{ fontSize: 13 }}>Mit dem Absenden übermittelst du deine Angaben zur Bearbeitung deiner Anfrage. Es wird keine Reise gebucht.</p>
                  </>
                )}
              </div>
            )}
          </section>
        )}
      <p
        style={{
          marginTop: 18,
          color: "#64748b",
          fontSize: 13,
        }}
      >
        Testversion: Noch keine echte
        Reisevermittlung, Buchung
        oder Zahlung.
      </p>
    </div>
  );
}
