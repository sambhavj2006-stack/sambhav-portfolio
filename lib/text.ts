const STOPWORDS = new Set(["and", "of", "the", "for", "at", "in", "on", "&"]);

/**
 * Derives a short (2-4 char) monogram from an organization/person name — prefers an
 * existing acronym in the name (e.g. "CEEW", "SSCBS", "HDFC") over computed initials.
 */
export function getInitials(name: string, maxChars = 2): string {
  const cleaned = name.replace(/[()]/g, "");
  const words = cleaned.split(/[\s,/-]+/).filter(Boolean);

  const acronym = words.find((word) => /^[A-Z]{2,5}$/.test(word));
  if (acronym) return acronym;

  const meaningful = words.filter(
    (word) => !STOPWORDS.has(word.toLowerCase())
  );
  const source = meaningful.length > 0 ? meaningful : words;
  const letters = source
    .map((word) => word[0])
    .filter((char) => /[A-Za-z]/.test(char));

  return letters.slice(0, maxChars).join("").toUpperCase();
}
