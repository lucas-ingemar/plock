interface PlockCheckCircleProps {
    checked: boolean,
}

export const PlockCheckCircle: React.FC<PlockCheckCircleProps> = ({
    checked,
}) => {
    if (checked) {
        return <div className="w-3 h-3 rounded-full bg-citrus"/>
    } else {
        return <div className="w-3 h-3 rounded-full border-1 border-muted"/>
    }
}
