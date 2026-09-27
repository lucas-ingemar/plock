import { Separator } from "@heroui/react"
import { PlockCheckCircle } from "../primitives/PlockCheckCircle"
import { ReceiptItem } from "./ReceiptItem"

interface ReceiptProps {
}

export const Receipt: React.FC<ReceiptProps> = ({
}) => {
    return (
        <div className="p-6 rounded-t-2xl receipt bg-surface">
            <div className="flex justify-between items-center">
                <p className="text-xl font-bold">Willys</p>
                <p className="text-muted">31 aug 2026</p>
            </div>
            <div className="flex gap-6 items-center mt-8">
                <div className="flex flex-col">
                    <p className="text-3xl font-extrabold">109</p>
                    <p className="text-muted">varor</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-3xl font-extrabold">3153 kr</p>
                    <p className="text-muted">totalt</p>
                </div>
            </div>
            <div className="flex gap-3 items-center mt-6">
                <PlockCheckCircle checked/>
                <p className="text-muted">Används i veckans recept</p>
            </div>
            <Separator variant="tertiary" className="my-6"/>
            <div className="flex flex-col gap-2">
                <ReceiptItem item="Tofu fast 2st" price={51.8} usedInRecipe/>
                <ReceiptItem item="Blandfärs 1.02 kg" price={115.49} />
            </div>

        </div>
    )
}
