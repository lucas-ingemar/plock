
interface PlockChipProps {
    variant?: "haulTag" | "haulIngredient" | "haulPantry" | "recipeTag" | "filterSelected" | "recipeSummaryTitle"
    className?: string;
    children: React.ReactNode;
}

export const PlockChip: React.FC<PlockChipProps> = ({
    variant="haulTag",
    className="",
    children,
}) => {

    let cn = ""

    switch (variant) {
        case "haulTag":
            cn = "bg-surface text-foreground py-3 px-6 border-border border-1"
            break

        case "haulIngredient":
            cn = "bg-citrus text-foreground rounded-md py-2 px-3 text-sm"
            break

        case "haulPantry":
            cn = "border-border/50 border-1 text-accent-foreground rounded-md py-2 px-3 text-sm"
            break

        case "recipeTag":
            cn = "bg-accent-foreground/10 text-accent-foreground py-2 px-4"
            break

        case "filterSelected":
            cn = "bg-accent text-accent-foreground py-2 px-6"
            break

        case "recipeSummaryTitle":
            cn = "bg-accent/90 text-accent-foreground py-2 px-3 max-w-50 text-sm"
            break
    }

    return (
        <div className={"rounded-full flex items-center font-sans font-medium text-nowrap " + " " + cn + " " + className}>
            {children}
        </div>
    )
}
