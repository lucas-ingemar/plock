import { Receipt } from "../components/Receipt"
import { RecipeSummary } from "../components/RecipeSummary"
import { DefaultPageLayout } from "../layouts/DefaultPageLayout"
import { PlockChip } from "../primitives/PlockChip"

interface WeekPageProps {
}

export const WeekPage: React.FC<WeekPageProps> = ({
}) => {
    return (
        <DefaultPageLayout className="flex gap-8">
            <div className="hidden flex-col w-1/3 h-full sm:flex">
                <Receipt/>
            </div>
            <div className="flex flex-col w-full">
                <p className="pb-1 text-muted">Vecka 36, 31 aug – 4 sep</p>
                <div className="flex gap-4 justify-between items-center mb-8">
                    <h1 className="flex-grow font-sans text-5xl font-black text-foreground">Catchigt namn likt kedjorna</h1>
                    <PlockChip className="hidden sm:flex">2 vuxna + 2-åring</PlockChip>
                    <PlockChip className="hidden sm:flex">4 portioner</PlockChip>
                    <PlockChip className="hidden sm:flex">Max 35 min</PlockChip>
                </div>
                <RecipeSummary/>
            </div>
        </DefaultPageLayout>
    )
}
