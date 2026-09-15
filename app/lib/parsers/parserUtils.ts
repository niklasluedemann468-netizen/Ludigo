export function normalizeParserText(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[.,!?;:()[\]{}"'`´]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function containsWholeTerm(
  source: string,
  term: string
): boolean {
  const normalizedSource = normalizeParserText(source);
  const normalizedTerm = normalizeParserText(term);

  const escapedTerm = normalizedTerm.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const regex = new RegExp(
    `(^|\\s)${escapedTerm}(?=\\s|$)`,
    "i"
  );

  return regex.test(normalizedSource);
}

export function containsAnyWholeTerm(
  source: string,
  terms: string[]
): boolean {
  return terms.some((term) =>
    containsWholeTerm(source, term)
  );
}

export function appendIfAnyWholeTerm(
  source: string,
  params: URLSearchParams,
  key: string,
  value: string,
  terms: string[]
) {
  if (containsAnyWholeTerm(source, terms)) {
    params.append(key, value);
  }
}