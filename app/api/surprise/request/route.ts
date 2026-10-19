
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const allowedPreferences = [
  "Strand & Meer",
  "Natur",
  "Städtereise",
  "Wellness",
  "Aktivurlaub",
];

const allowedIdeas = [
  "meer",
  "natur",
  "city",
  "wellness",
  "aktiv",
];

const ideaPreferences: Record<string, string> = {
  meer: "Strand & Meer",
  natur: "Natur",
  city: "Städtereise",
  wellness: "Wellness",
  aktiv: "Aktivurlaub",
};

function isText(value: unknown, maxLength: number) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
}

function isDate(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const parsed = new Date(`${value}T12:00:00Z`);

  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

export async function POST(request: NextRequest) {
  try {
    // Kleine Größenbegrenzung für das Anfrageformular.
    const raw = await request.text();

    if (raw.length > 12000) {
      return NextResponse.json(
        { error: "Die Anfrage ist zu groß." },
        { status: 413 }
      );
    }

    let body: Record<string, unknown>;

    try {
      const parsed: unknown = JSON.parse(raw);

      if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        throw new Error("Invalid JSON");
      }

      body = parsed as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: "Ungültige Anfragedaten." },
        { status: 400 }
      );
    }

    // Honeypot: Das spätere Formular lässt dieses
    // Feld unsichtbar und leer.
    if (body.website) {
      return NextResponse.json(
        { error: "Anfrage konnte nicht verarbeitet werden." },
        { status: 400 }
      );
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      departure,
      startDate,
      endDate,
      travelers,
      budget,
      preferences,
      selectedIdea,
      additionalWishes,
      privacyAccepted,
    } = body;

    const validPreferences =
      Array.isArray(preferences) &&
      preferences.length <= allowedPreferences.length &&
      preferences.every(
        (value) =>
          typeof value === "string" &&
          allowedPreferences.includes(value)
      ) &&
      new Set(preferences).size === preferences.length;

    const validIdea =
      typeof selectedIdea === "string" &&
      allowedIdeas.includes(selectedIdea);

    const validBudget =
      budget === null ||
      (typeof budget === "number" &&
        Number.isFinite(budget) &&
        budget > 0 &&
        budget <= 1000000);

    const validTravelers =
      typeof travelers === "number" &&
      Number.isInteger(travelers) &&
      travelers >= 1 &&
      travelers <= 30;

    const validEmail =
      isText(email, 254) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email as string);

    if (
      !isText(firstName, 100) ||
      !isText(lastName, 100) ||
      !validEmail ||
      !isText(departure, 150) ||
      !isDate(startDate) ||
      !isDate(endDate) ||
      endDate < startDate ||
      !validTravelers ||
      !validBudget ||
      !validPreferences ||
      !validIdea ||
      (phone !== null &&
        phone !== undefined &&
        (typeof phone !== "string" ||
          phone.length > 50)) ||
      (additionalWishes !== null &&
        additionalWishes !== undefined &&
        (typeof additionalWishes !== "string" ||
          additionalWishes.length > 2000)) ||
      privacyAccepted !== true
    ) {
      return NextResponse.json(
        {
          error:
            "Bitte überprüfe deine Angaben und die Datenschutzbestätigung.",
        },
        { status: 400 }
      );
    }

    // Die ausgewählte Idee muss zu den Vorlieben passen.
    if (
      preferences.length > 0 &&
      !preferences.includes(
        ideaPreferences[selectedIdea as string]
      )
    ) {
      return NextResponse.json(
        { error: "Die Reiseidee passt nicht zur Auswahl." },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const secretKey =
      process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
      console.error(
        "Surprise API: Supabase-Konfiguration fehlt."
      );

      return NextResponse.json(
        { error: "Der Anfrageservice ist nicht verfügbar." },
        { status: 503 }
      );
    }

    // Nur auf dem Server: niemals im Browser verwenden.
    const supabase = createClient(
      supabaseUrl,
      secretKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const { data, error } = await supabase
      .from("surprise_requests")
      .insert({
        first_name: (firstName as string).trim(),
        last_name: (lastName as string).trim(),
        email: (email as string).trim(),
        phone:
          typeof phone === "string" && phone.trim()
            ? phone.trim()
            : null,
        departure: (departure as string).trim(),
        start_date: startDate,
        end_date: endDate,
        travelers,
        budget,
        preferences,
        selected_idea: selectedIdea,
        additional_wishes:
          typeof additionalWishes === "string" &&
          additionalWishes.trim()
            ? additionalWishes.trim()
            : null,
        status: "neu",
      })
      .select("id")
      .single();

    if (error) {
      // Keine personenbezogenen Daten protokollieren.
      console.error(
        "Surprise API: Speichern fehlgeschlagen.",
        error.code
      );

      return NextResponse.json(
        { error: "Die Anfrage konnte nicht gespeichert werden." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        requestId: data.id,
        message: "Die Anfrage wurde gespeichert.",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Die Anfrage konnte nicht verarbeitet werden." },
      { status: 500 }
    );
  }
}
