import { cn } from "@heroui/styles"
import { Status, type HaulSummary } from "../types/types"
import { useTranslation } from "react-i18next"
import { PlockChip } from "../primitives/PlockChip"
import { useNavigate } from "react-router-dom"
import { ChevronRight } from "lucide-react"

interface HaulStatusCardProps {
    haul: HaulSummary,
}

export const HaulStatusCard: React.FC<HaulStatusCardProps> = ({
    haul,
}) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()

    let content = (<></>)

    switch (haul.status) {
        case Status.Draft:
            content = (
                <div className="flex flex-col gap-6 justify-between w-full sm:flex-row sm:gap-0">
                    <div className="">
                        <p className="text-lg font-semibold">{t("haulCard.draft.title")}</p>
                        <p className="text-muted">{`
                            ${t("haulCard.meal_count", {meal_count: haul.meal_count})},
                            ${t("haulCard.portions", {portions: haul.servings_per_meal})},
                            ${t("haulCard.max_cooking_minutes", {max_cooking_minutes: haul.max_cooking_minutes})}
                            `}
                        </p>
                    </div>
                    <PlockChip variant="filterSelected">
                        {t("haulCard.draft.addReceipt")}
                    </PlockChip>
                </div>
            )
            break

        case Status.Ready:
            content = (
                <div className="flex flex-col gap-6 justify-between w-full max-w-full sm:flex-row sm:gap-0 sm:items-center">
                    <div className="">
                        <p className="text-lg font-semibold">{haul.title}</p>
                        <p className="text-muted">{`
                            ${t("haulCard.meal_count", {meal_count: haul.meal_count})},
                            ${t("haulCard.portions", {portions: haul.servings_per_meal})},
                            ${t("haulCard.max_cooking_minutes", {max_cooking_minutes: haul.max_cooking_minutes})}
                            `}
                        </p>
                        <div className="hidden gap-2 mt-4 lg:flex">
                        {haul.recipes?.map((r) => (
                            <PlockChip variant="recipeSummaryTitle" key={r.id}>
                                <p className="truncate">{r.title}</p>
                            </PlockChip>
                        ))}
                        </div>
                    </div>
                    <ChevronRight size={30}/>
                </div>
            )
            break

    }

    return (
        <div
            key={haul.id}
            className={cn(
                "p-6 rounded-xl flex flex-col sm:flex-row sm:pl-12 gap-1 sm:gap-8 sm:items-center cursor-pointer select-none",
                haul.status == Status.Draft ? "border-2 border-border border-dashed hover:bg-accent/10" :  "bg-surface hover:bg-accent hover:text-accent-foreground/80"
            )}
            onClick={() => {
                navigate("/hauls/" + haul.id)
            }}
        >
            <div className="flex gap-1 sm:flex-col sm:gap-0 sm:items-center">
                <h2>{haul.created_at.getDate().toString()}</h2>
                <p>{haul.created_at.toLocaleDateString(i18n.language, { month: "short" })}</p>
            </div>
            {content}
        </div>
    )
}
