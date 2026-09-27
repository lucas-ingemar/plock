import { PlockCheckCircle } from "../primitives/PlockCheckCircle"

interface ReceiptItemProps {
    item: string;
    price: number;
    usedInRecipe?: boolean;
}

export const ReceiptItem: React.FC<ReceiptItemProps> = ({
    item,
    price,
    usedInRecipe=false,
}) => {
    return (
        <div className="flex gap-3 items-center">
            <PlockCheckCircle checked={usedInRecipe}/>
            <p className="flex-grow">{item}</p>
            <p className="text-muted">{price.toFixed(2)}</p>
        </div>
    )
}
