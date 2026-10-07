import { Button, cn } from "@heroui/react";
import { t } from "i18next";
import { FaceAngry, FaceSlightlySmiling, Heart, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface RatingButtonGroupProps {
    className?: string;
    defaultRating?: number;
    variant?: "all" | "children";
    onChange: (rating: number) => void;
}

export const RatingButtonGroup: React.FC<RatingButtonGroupProps> = ({
    className="",
    defaultRating=2,
    variant="all",
    onChange,
}) => {
    const [rating, setRating] = useState(defaultRating)

    useEffect(() => {
        onChange(rating)
    }, [rating])

    return (
        <div className={
            cn(
                `flex gap-2 sm:gap-4 max-w-full`,
                variant == "children" ? "flex-wrap sm:flex-row" : "",
                className
            )}
        >
            <RatingButton onClick={setRating} rating={3} isSelected={rating==3} variant={variant} icon={Heart} title={t(`rating_button_group.${variant}.3`)}/>
            <RatingButton onClick={setRating} rating={2} isSelected={rating==2} variant={variant} icon={FaceSlightlySmiling} title={t(`rating_button_group.${variant}.2`)}/>
            <RatingButton onClick={setRating} rating={1} isSelected={rating==1} variant={variant} icon={FaceAngry} title={t(`rating_button_group.${variant}.1`)}/>
        </div>
    )
}

interface RatingButtonProps {
    isSelected: boolean;
    title: string;
    rating: number;
    variant: "all" | "children";
    onClick: (rating: number) => void;
    icon: LucideIcon;
}

const RatingButton: React.FC<RatingButtonProps> = ({
    isSelected,
    title,
    rating,
    variant,
    onClick,
    icon: Icon,
}) => {
    return (
        <Button
            className={cn(
                "",
                isSelected && variant == "all" ? "bg-accent" : "bg-none",
                isSelected && variant == "children" ? "bg-citrus text-foreground" : "bg-none",
                variant == "all" ? "rounded-lg w-full py-8 sm:py-10 sm:gap-4 text-xs sm:text-lg flex-col sm:flex-row" : "",
                variant == "children" ? "text-base p-6" : "",

            )}
            variant={isSelected ? "primary" : "outline"}
            onClick={() => {onClick(rating)}}
        >
            { variant == "all" &&
                <Icon className={cn("sm:!size-6", isSelected ? "text-citrus" : "")}/>
            }
            {title}
        </Button>
    )
}
