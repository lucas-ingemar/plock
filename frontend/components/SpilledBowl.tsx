interface SpilledBowlProps {
    className?: string
}

export const SpilledBowl: React.FC<SpilledBowlProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" className={className} aria-hidden="true">
        <ellipse cx="170" cy="188" rx="140" ry="12" fill="var(--spruce, #183D33)" opacity={.12} />
        <g transform="translate(104 120) rotate(68)">
            <path d="M-72,0 A72,72 0 0,0 72,0 Z" fill="#FFFFFF" stroke="var(--spruce, #183D33)" strokeWidth="4" strokeLinejoin="round" />
            <path d="M-50,24 A60,60 0 0,0 50,24" fill="none" stroke="#E3E8DF" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="0" cy="0" rx="72" ry="14" fill="#FBEBC0" stroke="var(--spruce, #183D33)" strokeWidth="4" />
        </g>
        <path d="M108,128 Q118,118 130,132 Q140,146 132,150" fill="none" stroke="var(--citrus, #F3B61F)" strokeWidth="7" strokeLinecap="round" />
        <path d="M118,150 Q126,146 132,150 Q160,140 176,160 T214,168 T252,176" fill="none" stroke="var(--citrus, #F3B61F)" strokeWidth="7" strokeLinecap="round" />
        <path d="M112,170 Q120,164 128,162 Q150,168 170,176 T210,182 T262,184" fill="none" stroke="var(--citrus, #F3B61F)" strokeWidth="7" strokeLinecap="round" />
        <path d="M114,136 Q126,132 140,140 Q170,126 196,146 T240,156" fill="none" stroke="var(--citrus, #F3B61F)" strokeWidth="7" strokeLinecap="round" opacity={.8} />
        <rect x="226" y="160" width="20" height="20" rx="5" fill="#FFFFFF" stroke="var(--citrus, #F3B61F)" strokeWidth="4" transform="rotate(14 236 170)" />
        <rect x="188" y="164" width="18" height="18" rx="5" fill="#FFFFFF" stroke="var(--citrus, #F3B61F)" strokeWidth="4" transform="rotate(-10 197 173)" />
        <rect x="270" y="168" width="14" height="14" rx="4" fill="#FFFFFF" stroke="var(--citrus, #F3B61F)" strokeWidth="3" transform="rotate(30 277 175)" />
        <path transform="translate(160 176) rotate(-15)" d="M0,0 Q14,-10 28,0 Q14,10 0,0 Z" fill="#7FB39C" />
        <path transform="translate(250 150) rotate(25)" d="M0,0 Q12,-9 24,0 Q12,9 0,0 Z" fill="#2C5A49" />
        <circle cx="290" cy="182" r="5" fill="var(--citrus, #F3B61F)" />
        <circle cx="218" cy="140" r="4" fill="var(--citrus, #F3B61F)" />
    </svg>
)
