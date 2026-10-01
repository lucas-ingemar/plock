import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

interface LoadingQuipsProps {
    intervalMs?: number
}

const shuffle = <T,>(items: T[]) => {
    const result = [...items]
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
}

export const LoadingQuips: React.FC<LoadingQuipsProps> = ({ intervalMs = 2600 }) => {
    const { t, i18n } = useTranslation()
    const [index, setIndex] = useState(0)

    const quips = useMemo(() => {
        const list = t("processing.quips", { returnObjects: true })
        return Array.isArray(list) ? shuffle(list as string[]) : []
    }, [t, i18n.language])

    useEffect(() => {
        if (quips.length < 2) return
        const timer = window.setInterval(() => setIndex((current) => (current + 1) % quips.length), intervalMs)
        return () => window.clearInterval(timer)
    }, [quips, intervalMs])

    if (quips.length === 0) return null

    return (
        <p key={index} aria-hidden="true" className="max-w-xs text-center pl-text min-h-6 text-muted">
            {quips[index]}
        </p>
    )
}
