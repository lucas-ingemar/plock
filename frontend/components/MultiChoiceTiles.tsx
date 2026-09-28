import { Checkbox, CheckboxGroup, Label, Text } from "react-aria-components"

export interface MultiChoiceOption<T extends string> {
    value: T
    label: string
    caption?: string
}

interface MultiChoiceTilesProps<T extends string> {
    label: string
    description?: string
    options: MultiChoiceOption<T>[]
    value: T[]
    onChange: (value: T[]) => void
    columns?: 2 | 3
}

export const MultiChoiceTiles = <T extends string>({
    label,
    description,
    options,
    value,
    onChange,
    columns = 2,
}: MultiChoiceTilesProps<T>) => {
    return (
        <CheckboxGroup
            value={value}
            onChange={(selected) => onChange(selected as T[])}
            className="flex flex-col gap-4 w-full max-w-md"
        >
            <Label className="sr-only">{label}</Label>
            <div className={columns === 3 ? "grid grid-cols-2 gap-3 sm:grid-cols-3" : "grid grid-cols-2 gap-3"}>
                {options.map((option) => (
                    <Checkbox
                        key={option.value}
                        value={option.value}
                        className="flex flex-col gap-0.5 justify-center items-center py-3 px-4 text-center rounded-md border-2 transition-colors cursor-pointer outline-none border-border bg-surface data-selected:border-accent data-selected:bg-accent data-selected:text-accent-foreground data-focus-visible:ring-2 data-focus-visible:ring-accent data-focus-visible:ring-offset-2 data-disabled:opacity-50 data-disabled:cursor-not-allowed hover:border-accent"
                    >
                        <span className="font-semibold">{option.label}</span>
                        {option.caption && <span className="text-xs opacity-80">{option.caption}</span>}
                    </Checkbox>
                ))}
            </div>
            {description && (
                <Text slot="description" className="text-sm text-center text-muted">
                    {description}
                </Text>
            )}
        </CheckboxGroup>
    )
}
