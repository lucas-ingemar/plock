import { PlockButton } from "../primitives/PlockButton"
import { PlockCheckCircle } from "../primitives/PlockCheckCircle"
import { PlockChip } from "../primitives/PlockChip"

interface RecipeSummaryProps {
}

export const RecipeSummary: React.FC<RecipeSummaryProps> = ({
}) => {
    return (
        <div className="flex gap-4 justify-between p-8 font-sans rounded-xl bg-accent text-accent-foreground">
            <div className="flex flex-col">
                <div className="flex gap-3 items-center">
                    <PlockCheckCircle checked/>
                    <p className="text-accent-foreground/70">Recept 1</p>
                </div>
                <h2 className="mt-4 text-4xl font-black">Krispig sesamtofu med risnudlar</h2>
                <div className="flex flex-wrap gap-4 mt-6">
                    <PlockChip variant="recipeTag">25 min</PlockChip>
                    <PlockChip variant="recipeTag" className="hidden sm:flex">Kina och Östasien</PlockChip>
                    <PlockChip variant="recipeTag">Vegetarisk</PlockChip>
                    <PlockChip variant="recipeTag" className="hidden sm:flex">Barnvänlig</PlockChip>
                </div>
                <div className="flex-grow"/>
                <div className="flex gap-3 items-center">
                <PlockButton className="mt-8 w-full sm:w-auto" variant="citrus" size="xl">Börja laga</PlockButton>
                </div>
            </div>
            <div className="hidden flex-col p-6 w-2/5 rounded-xl sm:flex bg-accent-foreground/10">
                <div className="flex justify-between items-center">
                    <p className="text-lg font-bold">Från kassen</p>
                    <p>7 av 16 ingredienser</p>
                </div>
                <div className="flex flex-wrap gap-3 mt-4 max-w-full">
                    <PlockChip variant="haulIngredient">Tofu 400g</PlockChip>
                    <PlockChip variant="haulIngredient">Risnudlar</PlockChip>
                    <PlockChip variant="haulIngredient">Spetskål</PlockChip>
                    <PlockChip variant="haulIngredient">Babymajs</PlockChip>
                    <PlockChip variant="haulIngredient">Bambuskott</PlockChip>
                    <PlockChip variant="haulIngredient">Vattenkastanjer</PlockChip>
                    <PlockChip variant="haulIngredient">Sesamolja</PlockChip>
                </div>
                <p className="mt-6">Skafferi</p>
                <div className="flex flex-wrap gap-3 mt-4 max-w-full">
                    <PlockChip variant="haulPantry">Soja</PlockChip>
                    <PlockChip variant="haulPantry">Vitlök</PlockChip>
                    <PlockChip variant="haulPantry">Honung</PlockChip>
                    <PlockChip variant="haulPantry">Maizena</PlockChip>
                </div>
            </div>
        </div>
    )
}
