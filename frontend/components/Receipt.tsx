import { Separator } from "@heroui/react"
import { PlockCheckCircle } from "../primitives/PlockCheckCircle"
import { ReceiptItem } from "./ReceiptItem"
import type { Receipt as ReceiptType } from "../types/types"
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ReceiptProps {
    receipt: ReceiptType;
}

export const Receipt: React.FC<ReceiptProps> = ({
    receipt,
}) => {
    const [showAll, setShowAll] = useState(false)

    const { t, i18n } = useTranslation()

    const filteredItems = showAll ? receipt.items : receipt.items.slice(0, 10)

    return (
        <div className="p-6 rounded-t-2xl receipt bg-surface w-100">
            <div className="flex justify-between items-center">
                <p className="text-xl font-bold">{receipt.store}</p>
            <p className="text-muted">{`${receipt.date.getDate().toString()} ${receipt.date.toLocaleDateString(i18n.language, { month: "short" })} ${receipt.date.getFullYear()}`}</p>
            </div>
            <div className="flex gap-6 items-center mt-8">
                <div className="flex flex-col">
                    <p className="text-3xl font-extrabold">{receipt.item_count}</p>
                    <p className="text-muted">{t("receipt.items")}</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-3xl font-extrabold">{`${Math.round(receipt.total)} ${receipt.currency}`}</p>
                    <p className="text-muted">{t("receipt.total")}</p>
                </div>
            </div>
            <div className="flex gap-3 items-center mt-6">
                <PlockCheckCircle checked/>
                <p className="text-muted">{t("receipt.food_products")}</p>
            </div>
            <Separator variant="tertiary" className="my-6"/>
            <div className="flex flex-col gap-2">
                {filteredItems.map((item) => (
                    <ReceiptItem item={item.name} price={item.price} usedInRecipe={item.is_food}/>
                ))}
            </div>

            <p className="mt-8 font-bold cursor-pointer select-none hover:underline text-accent" onClick={()=>{setShowAll(!showAll)}}>
                {showAll ? t("receipt.show_less") : t("receipt.show_all_products", {count: receipt.item_count})}
            </p>

        </div>
    )
}
