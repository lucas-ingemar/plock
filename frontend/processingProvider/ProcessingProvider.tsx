import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { LoadingQuips } from "./LoadingQuips"
import { PlockLoader } from "./PlockLoader"

type Task<T> = Promise<T> | (() => Promise<T>)

export interface ProcessingApi {
    show: (message?: string) => void
    hide: () => void
    run: <T>(task: Task<T>, message?: string) => Promise<T>
}

const ProcessingContext = createContext<ProcessingApi | null>(null)

export const ProcessingProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [count, setCount] = useState(0)
    const [message, setMessage] = useState<string | undefined>()
    const messages = useRef<(string | undefined)[]>([])

    const show = useCallback((next?: string) => {
        messages.current.push(next)
        setMessage(next)
        setCount((current) => current + 1)
    }, [])

    const hide = useCallback(() => {
        messages.current.pop()
        setMessage(messages.current.at(-1))
        setCount((current) => Math.max(current - 1, 0))
    }, [])

    const run = useCallback(
        async <T,>(task: Task<T>, next?: string): Promise<T> => {
            show(next)
            try {
                return await (typeof task === "function" ? task() : task)
            } finally {
                hide()
            }
        },
        [show, hide],
    )

    const api = useMemo<ProcessingApi>(() => ({ show, hide, run }), [show, hide, run])
    const isVisible = count > 0

    return (
        <ProcessingContext.Provider value={api}>
            {children}
            {createPortal(
                <div
                    role="status"
                    aria-live="polite"
                    aria-hidden={!isVisible}
                    data-visible={isVisible}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background/80 backdrop-blur-md transition-opacity duration-300 opacity-0 pointer-events-none data-[visible=true]:opacity-100 data-[visible=true]:pointer-events-auto"
                >
                    {isVisible && (
                        <>
                            <PlockLoader width={220} />
                            <div className="flex flex-col gap-2 items-center">
                                {message && (
                                    <p className="max-w-xs text-lg font-semibold text-center font-heading text-foreground">
                                        {message}
                                    </p>
                                )}
                                <LoadingQuips />
                            </div>
                        </>
                    )}
                </div>,
                document.body,
            )}
        </ProcessingContext.Provider>
    )
}

export const useProcessing = () => {
    const context = useContext(ProcessingContext)
    if (!context) {
        throw new Error("useProcessing must be used within a ProcessingProvider")
    }
    return context
}
