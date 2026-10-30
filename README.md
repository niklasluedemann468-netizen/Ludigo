This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## LÜDIGO-Oberfläche und Reisewelten

Die Startseite verwendet die bestehende Suchlogik und `/api/accommodations` mit der überarbeiteten Oberfläche aus `app/components/AccommodationPage.tsx`. Die ursprünglichen Logodateien unter `public/images/` bleiben unverändert. Die Merkliste speichert ausgewählte Unterkünfte ausschließlich im Browser. Partnerpreise ohne bestätigte Preisbasis werden entsprechend gekennzeichnet und nicht als Nachtpreise oder zur Katalogpreis-Sortierung verwendet.

Die Seiten `/surprise`, `/bike` und `/bustouren-senioren` sind über die gemeinsame Navigation erreichbar. Surprise verwendet das bestehende Ideen- und Anfrageformular; es gibt weiterhin keine echte Reisevermittlung, Buchung oder Zahlung. Bike und Bustouren bieten lokale Wunschprofile zum Speichern und Kopieren, keine verfügbaren Routen oder Touren.

Prüfungen:

```sh
npx tsc --noEmit
node --experimental-strip-types --test tests/accommodation-view.test.mjs
npm run build
```

Der direkte TypeScript-Testaufruf benötigt Node.js 22.6 oder neuer. Der Build benötigt die bestehende serverseitige Umgebung, insbesondere `OPENAI_API_KEY`; Schlüssel gehören nicht ins Repository.
