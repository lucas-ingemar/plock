import { Label, Radio, RadioGroup, Text } from "react-aria-components"

export interface ChoiceOption {
    value: number
    label: string
    caption?: string
}

interface ChoiceTilesProps {
    label: string
    description?: string
    options: ChoiceOption[]
    value: number
    onChange: (value: number) => void
}

export const ChoiceTiles: React.FC<ChoiceTilesProps> = ({
    label,
    description,
    options,
    value,
    onChange,
}) => {
    return (
        <RadioGroup
            value={String(value)}
            onChange={(selected) => onChange(Number(selected))}
            className="flex flex-col gap-4 w-full max-w-md"
        >
            <Label className="sr-only">{label}</Label>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {options.map((option) => (
                    <Radio
                        key={option.value}
                        value={String(option.value)}
                        className="flex flex-col gap-0.5 justify-center items-center py-4 px-3 text-center rounded-md border-2 transition-colors cursor-pointer outline-none border-border bg-surface data-selected:border-accent data-selected:bg-accent data-selected:text-accent-foreground data-focus-visible:ring-2 data-focus-visible:ring-accent data-focus-visible:ring-offset-2 data-disabled:opacity-50 data-disabled:cursor-not-allowed hover:border-accent"
                    >
                        <span className="text-2xl font-bold font-heading">{option.label}</span>
                        {option.caption && <span className="text-xs opacity-80">{option.caption}</span>}
                    </Radio>
                ))}
            </div>
            {description && (
                <Text slot="description" className="text-sm text-center text-muted">
                    {description}
                </Text>
            )}
        </RadioGroup>
    )
}
