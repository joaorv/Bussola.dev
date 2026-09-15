// Marcações da rosa dos ventos: um traço a cada 30°, os quatro pontos
// cardeais mais longos e mais visíveis que os intermediários.
const TICKS = Array.from({ length: 12 }, (_, i) => i * 30);

const CARDINALS = [
  { label: "N", x: 200, y: 44 },
  { label: "L", x: 356, y: 206 },
  { label: "S", x: 200, y: 366 },
  { label: "O", x: 44, y: 206 },
];

export function CompassRose({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="compass-glow">
          <stop offset="0%" stopColor="#4E7FCB" stopOpacity="0.35" />
          <stop offset="65%" stopColor="#4E7FCB" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#4E7FCB" stopOpacity="0" />
        </radialGradient>

        <linearGradient
          id="compass-needle-north"
          x1="200"
          y1="52"
          x2="200"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F27F52" />
          <stop offset="1" stopColor="#E4572E" />
        </linearGradient>

        <linearGradient
          id="compass-needle-south"
          x1="200"
          y1="348"
          x2="200"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6D9AE0" />
          <stop offset="1" stopColor="#2E5AA0" />
        </linearGradient>
      </defs>

      {/* halo por trás do instrumento */}
      <circle cx="200" cy="200" r="200" fill="url(#compass-glow)" />

      {/* aros */}
      <circle cx="200" cy="200" r="188" stroke="#2A3F66" strokeWidth="1" />
      <circle
        cx="200"
        cy="200"
        r="188"
        stroke="#4E7FCB"
        strokeWidth="2"
        strokeOpacity="0.45"
        strokeLinecap="round"
        strokeDasharray="1 14"
      />
      <circle cx="200" cy="200" r="152" stroke="#2A3F66" strokeWidth="1" />
      <circle
        cx="200"
        cy="200"
        r="112"
        stroke="#2A3F66"
        strokeWidth="1"
        strokeDasharray="4 8"
      />

      {/* ponto luminoso sobre o aro externo, a rota já traçada */}
      <circle cx="310" cy="43" r="6" fill="#E4572E" />
      <circle cx="310" cy="43" r="12" fill="#E4572E" fillOpacity="0.2" />

      {/* graduação */}
      <g stroke="#4E7FCB">
        {TICKS.map((angle) => {
          const cardinal = angle % 90 === 0;
          return (
            <line
              key={angle}
              x1="200"
              y1={cardinal ? 136 : 142}
              x2="200"
              y2="152"
              strokeWidth={cardinal ? 2 : 1}
              strokeOpacity={cardinal ? 0.9 : 0.4}
              strokeLinecap="round"
              transform={`rotate(${angle} 200 200)`}
            />
          );
        })}
      </g>

      {/* pontos cardeais */}
      <g
        className="font-mono"
        fill="#8996AC"
        fontSize="16"
        letterSpacing="1"
        textAnchor="middle"
      >
        {CARDINALS.map(({ label, x, y }) => (
          <text key={label} x={x} y={y}>
            {label}
          </text>
        ))}
      </g>

      {/* agulha */}
      <g className="compass-needle">
        <path d="M200 52 189 200h22L200 52Z" fill="url(#compass-needle-north)" />
        <path
          d="M200 52 189 200h11V52Z"
          fill="#0C1428"
          fillOpacity="0.22"
        />
        <path
          d="M200 348 189 200h22l-11 148Z"
          fill="url(#compass-needle-south)"
        />
        <path d="M200 348 211 200h-11v148Z" fill="#0C1428" fillOpacity="0.25" />

        <circle cx="200" cy="200" r="15" fill="#14213D" stroke="#4E7FCB" />
        <circle cx="200" cy="200" r="5" fill="#E4572E" />
      </g>
    </svg>
  );
}
