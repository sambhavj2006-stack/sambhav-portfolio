/**
 * Generated cover art for works without an image: a small night-desert vignette — sky,
 * a moon or two, three dune ridges — fully determined by the work's id, so every card
 * is different but always the same card. Pure SVG, no runtime cost.
 */

function seeded(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const SKIES = [
  ["#0a0f1e", "#3a1a14"],
  ["#0d1226", "#5a2a16"],
  ["#120d1c", "#7e3218"],
  ["#081022", "#24304e"],
];

function ridge(rand: () => number, base: number, amp: number) {
  const pts: string[] = [`M0 ${base}`];
  let x = 0;
  while (x < 160) {
    const nx = x + 30 + rand() * 40;
    const crest = base - amp * (0.5 + rand() * 0.5);
    pts.push(`Q${x + (nx - x) * (0.55 + rand() * 0.3)} ${crest} ${nx} ${base - amp * rand() * 0.3}`);
    x = nx;
  }
  pts.push("L160 100 L0 100 Z");
  return pts.join(" ");
}

export default function DuneArt({ id, className = "" }: { id: string; className?: string }) {
  const rand = seeded(id);
  const [top, horizon] = SKIES[Math.floor(rand() * SKIES.length)];
  const mx = 30 + rand() * 100;
  const my = 18 + rand() * 22;
  const mr = 7 + rand() * 9;
  const twin = rand() > 0.4;
  const gid = `sky-${id}`;

  return (
    <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={horizon} />
        </linearGradient>
      </defs>
      <rect width="160" height="100" fill={`url(#${gid})`} />
      {Array.from({ length: 26 }, (_, i) => (
        <circle key={i} cx={rand() * 160} cy={rand() * 55} r={rand() * 0.45 + 0.15} fill="#f4ecdd" opacity={0.35 + rand() * 0.5} />
      ))}
      <circle cx={mx} cy={my} r={mr * 2.2} fill="#f4ecdd" opacity="0.05" />
      <circle cx={mx} cy={my} r={mr} fill="#e9dccb" opacity="0.9" />
      {twin && <circle cx={mx - mr * 1.7} cy={my + mr * 0.4} r={mr * 0.38} fill="#e9dccb" opacity="0.75" />}
      <path d={ridge(rand, 70, 14)} fill="#5a2c18" opacity="0.75" />
      <path d={ridge(rand, 82, 16)} fill="#3a1c10" />
      <path d={ridge(rand, 94, 14)} fill="#1b0f09" />
    </svg>
  );
}
