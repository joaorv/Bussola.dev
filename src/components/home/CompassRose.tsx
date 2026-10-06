// Marcações da rosa dos ventos: um traço a cada 30°, os quatro pontos
// cardeais mais longos e mais visíveis que os intermediários.
const TICKS = Array.from({ length: 12 }, (_, i) => i * 30);

const CARDINALS = [
  { label: "N", x: 200, y: 44 },
  { label: "L", x: 356, y: 206 },
  { label: "S", x: 200, y: 366 },
  { label: "O", x: 44, y: 206 },
];

// Todas as animações (classes compass-*) ficam em globals.css. Os elementos
// que giram em torno do centro usam transform-box: view-box com origem em
// 200px 200px, o centro do viewBox.
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

      {/* halo por trás do instrumento, "respirando" */}
      <circle
        cx="200"
        cy="200"
        r="200"
        fill="url(#compass-glow)"
        className="compass-halo"
      />

      {/* ondas que saem do centro, como um sinal sendo emitido */}
      <circle cx="200" cy="200" r="60" stroke="#4E7FCB" strokeWidth="1.5" className="compass-ripple" />
      <circle
        cx="200"
        cy="200"
        r="60"
        stroke="#4E7FCB"
        strokeWidth="1.5"
        className="compass-ripple compass-ripple-delay"
      />

      {/* aros */}
      <circle cx="200" cy="200" r="188" stroke="#2A3F66" strokeWidth="1" />
      <circle
        cx="200"
        cy="200"
        r="188"
        stroke="#4E7FCB"
        strokeWidth="2"
        strokeOpacity="0.6"
        strokeLinecap="round"
        strokeDasharray="1 14"
        className="compass-ring-outer"
      />
      <circle cx="200" cy="200" r="152" stroke="#2A3F66" strokeWidth="1" />
      <circle
        cx="200"
        cy="200"
        r="112"
        stroke="#4E7FCB"
        strokeOpacity="0.5"
        strokeWidth="1"
        strokeDasharray="4 8"
        className="compass-ring-inner"
      />

      {/* ponto luminoso percorrendo o aro externo: a rota sendo traçada */}
      <g className="compass-orbit">
        <circle cx="200" cy="12" r="12" fill="#E4572E" className="compass-beacon" />
        <circle cx="200" cy="12" r="6" fill="#E4572E" />
      </g>

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

      {/* pontos cardeais; o N brilha para onde a agulha aponta */}
      <g
        className="font-mono"
        fill="#8996AC"
        fontSize="16"
        letterSpacing="1"
        textAnchor="middle"
      >
        {CARDINALS.map(({ label, x, y }) => (
          <text
            key={label}
            x={x}
            y={y}
            className={label === "N" ? "compass-north" : undefined}
          >
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
        <circle cx="200" cy="200" r="5" fill="#E4572E" className="compass-pivot" />
      </g>
    </svg>
  );
}
