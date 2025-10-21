// Ultra-simple French profanity list (client-side hint).
// Server-side validation happens in the API as well.
const BAD_WORDS = [
  "merde","con","connard","connasse","salope","pute","enculé","encule","batard","bâtard",
  "fdp","ntm","nique ta mère","putain","bordel","chiasse","ta gueule"
];

export function containsProfanity(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return BAD_WORDS.some(w => lower.includes(w));
}
