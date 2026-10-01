interface PlockLoaderProps {
    width?: number
    className?: string
}

const styles = `
.k-knife { transform-box: view-box; transform-origin: 34px 109px; animation: k-rock .8s cubic-bezier(.55,0,.45,1) infinite; }
.k-bit { transform-box: fill-box; transform-origin: center; }
.k-a { animation: k-hop-a .8s ease-out infinite; }
.k-b { animation: k-hop-b .8s ease-out infinite; }
.k-c { animation: k-hop-c .8s ease-out infinite; }
@keyframes k-rock {
  0% { transform: rotate(-13deg) }
  42%, 50% { transform: rotate(0deg) }
  100% { transform: rotate(-13deg) }
}
@keyframes k-hop-a {
  0%, 44% { transform: translate(0,0) rotate(0) }
  60% { transform: translate(-4px,-16px) rotate(-25deg) }
  78%, 100% { transform: translate(0,0) rotate(0) }
}
@keyframes k-hop-b {
  0%, 46% { transform: translate(0,0) rotate(0) }
  62% { transform: translate(5px,-22px) rotate(30deg) }
  82%, 100% { transform: translate(0,0) rotate(0) }
}
@keyframes k-hop-c {
  0%, 45% { transform: translate(0,0) rotate(0) }
  58% { transform: translate(2px,-11px) rotate(15deg) }
  74%, 100% { transform: translate(0,0) rotate(0) }
}
@media (prefers-reduced-motion: reduce) { .k-knife, .k-a, .k-b, .k-c { animation: none; } }

@keyframes pl-text { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
.pl-text { animation: pl-text .4s ease-out; }
@media (prefers-reduced-motion: reduce) { .pl-text { animation: none; } }
`

export const PlockLoader: React.FC<PlockLoaderProps> = ({ width = 220, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 260 150"
        width={width}
        height={(width * 150) / 260}
        className={className}
        aria-hidden="true"
    >
        <style>{styles}</style>
        <rect x="12" y="116" width="236" height="18" rx="9" fill="var(--spruce, #183D33)" />
        <rect x="222" y="121" width="16" height="8" rx="4" fill="#22503F" />
        <g className="k-knife">
            <path d="M34,109 Q52,90 100,84 L170,80 L170,115.5 L112,115.5 Q62,115.5 34,109 Z" fill="#FFFFFF" stroke="var(--spruce, #183D33)" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M166,109 L112,109 Q70,109 48,104" fill="none" stroke="#DCE2D8" strokeWidth="3" strokeLinecap="round" />
            <rect x="169" y="78" width="10" height="38" rx="3" fill="#9AA89F" />
            <path d="M179,83 L236,85 Q247,86 247,96 L247,102 Q247,112 236,112 L179,114 Z" fill="var(--spruce, #183D33)" />
            <circle cx="197" cy="98.5" r="3" fill="#FBEBC0" />
            <circle cx="215" cy="98.5" r="3" fill="#FBEBC0" />
            <circle cx="233" cy="98.5" r="3" fill="#FBEBC0" />
        </g>
        <g className="k-bit k-c"><rect x="70" y="105" width="11" height="11" rx="3" fill="var(--citrus, #F3B61F)" /></g>
        <g className="k-bit k-a"><path d="M82,116 Q90,100 104,108 Q94,119 82,116 Z" fill="#7FB39C" /></g>
        <g className="k-bit k-b"><rect x="100" y="103" width="12" height="12" rx="3" fill="var(--citrus, #F3B61F)" transform="rotate(12 106 109)" /></g>
        <g className="k-bit k-c"><path d="M112,116 Q121,101 134,109 Q123,119 112,116 Z" fill="#2C5A49" /></g>
        <g className="k-bit k-a"><rect x="130" y="106" width="10" height="10" rx="3" fill="#FBEBC0" /></g>
        <g className="k-bit k-b"><path d="M92,116 Q99,106 110,112 Z" fill="#7FB39C" /></g>
        <g className="k-bit k-c"><rect x="142" y="104" width="12" height="12" rx="3" fill="var(--citrus, #F3B61F)" transform="rotate(-10 148 110)" /></g>
        <g className="k-bit k-b"><path d="M150,116 Q158,104 168,111 Q159,119 150,116 Z" fill="#7FB39C" /></g>
        <g className="k-bit k-a"><rect x="122" y="96" width="9" height="9" rx="2.5" fill="var(--citrus, #F3B61F)" /></g>
    </svg>
)
