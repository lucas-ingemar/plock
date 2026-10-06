import { useTranslation } from "react-i18next"
import { PlockButton } from "../primitives/PlockButton"
import { SpilledBowl } from "./SpilledBowl"

interface ErrorStateProps {
    title?: string
    message?: string
    error?: unknown
    image?: React.ReactNode
    onRetry?: () => void
    action?: React.ReactNode
    className?: string
}

const errorDetails = (error: unknown) => {
    if (!error) return null
    return error instanceof Error ? error.message : String(error)
}

export const ErrorState: React.FC<ErrorStateProps> = ({
    title,
    message,
    error,
    image,
    onRetry,
    action,
    className = "",
}) => {
    const { t } = useTranslation()
    const details = import.meta.env.DEV ? errorDetails(error) : null

    return (
        <section
            role="alert"
            className={`flex flex-col flex-1 gap-6 justify-center items-center py-16 px-6 w-full text-center ${className}`}
        >
            {image ?? <SpilledBowl className="w-full max-w-xs" />}
            <div className="flex flex-col gap-2 items-center max-w-md">
                <h2 className="text-3xl font-bold tracking-tight font-heading">
                    {title ?? t("error.title")}
                </h2>
                <p className="text-muted">{message ?? t("error.message")}</p>
            </div>
            {details && (
                <pre className="overflow-x-auto py-2 px-3 max-w-md font-mono text-xs text-left whitespace-pre-wrap break-words rounded-lg bg-surface text-muted">
                    {details}
                </pre>
            )}
            {(onRetry || action) && (
                <div className="flex flex-col gap-3 items-center sm:flex-row">
                    {onRetry && (
                        <PlockButton variant="primary" size="lg" onPress={onRetry}>
                            {t("error.retry")}
                        </PlockButton>
                    )}
                    {action}
                </div>
            )}
        </section>
    )
}
