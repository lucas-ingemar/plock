import { useTranslation } from "react-i18next"
import type { Unit } from "../types/types"

export const useFormatAmount = () => {
    const { t, i18n } = useTranslation()

    return (quantity?: number, unit?: Unit) => {
        if (quantity === undefined) return ""
        const amount = quantity.toLocaleString(i18n.language, { maximumFractionDigits: 2 })
        if (!unit) return amount
        const label = t(`units.${unit}`, { count: quantity })
        return label ? `${amount} ${label}` : amount
    }
}
