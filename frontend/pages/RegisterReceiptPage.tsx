import { useMemo, useState } from "react"
import { Label, Meter } from "@heroui/react"
import { DefaultPageLayout } from "../layouts/DefaultPageLayout"
import { PlockButton } from "../primitives/PlockButton"
import { createHaul } from "../api"
import { registrationSteps } from "../components/ReceiptRegistrationSteps"
import { initialRegistrationData, type RegistrationData } from "../types"

export const RegisterReceiptPage: React.FC = () => {
    const [data, setData] = useState<RegistrationData>(initialRegistrationData)
    const [stepIndex, setStepIndex] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const visibleSteps = useMemo(
        () => registrationSteps.filter((step) => step.isVisible?.(data) ?? true),
        [data],
    )

    const currentIndex = Math.min(stepIndex, visibleSteps.length - 1)
    const step = visibleSteps[currentIndex]
    const isFirstStep = currentIndex === 0
    const isLastStep = currentIndex === visibleSteps.length - 1
    const canContinue = step.isValid?.(data) ?? true
    const progress = ((currentIndex + 1) / visibleSteps.length) * 100

    const update = (patch: Partial<RegistrationData>) =>
        setData((previous) => ({ ...previous, ...patch }))

    const goBack = () => setStepIndex(Math.max(currentIndex - 1, 0))

    const goNext = async () => {
        if (!isLastStep) {
            setStepIndex(currentIndex + 1)
            return
        }

        setIsSubmitting(true)
        try {
            await createHaul(data)
        } finally {
            setIsSubmitting(false)
        }
    }

    const StepContent = step.Content

    return (
        <DefaultPageLayout className="flex flex-col flex-1 gap-8">
            <Meter
                aria-label="Registrering"
                className="w-full"
                value={progress}
                valueLabel={`Steg ${currentIndex + 1} av ${visibleSteps.length}`}
                size="sm"
            >
                <Label>Nytt plock</Label>
                <Meter.Output />
                <Meter.Track>
                    <Meter.Fill />
                </Meter.Track>
            </Meter>
            <div className="flex flex-1 sm:p-20">
                <div className="flex flex-col gap-10 justify-between w-full lg:w-1/2">
                    <div className="flex flex-col gap-2 pt-4">
                        <h2>{step.title}</h2>
                        <p>{step.subtitle}</p>
                    </div>
                    <div key={step.id} className="flex flex-col gap-8 items-center">
                        <StepContent data={data} update={update} />
                    </div>
                    <div className="flex flex-col-reverse gap-4 justify-center items-center sm:flex-row">
                        <PlockButton
                            variant="citrus"
                            size="lg"
                            isDisabled={isFirstStep || isSubmitting}
                            onPress={goBack}
                            className="w-full sm:w-auto"
                        >
                            Tillbaka
                        </PlockButton>
                        <PlockButton
                            variant="primary"
                            size="xl"
                            isDisabled={!canContinue}
                            isPending={isSubmitting}
                            onPress={goNext}
                            className="w-full sm:w-auto"
                        >
                            {isLastStep ? "Skapa plock" : "Nästa"}
                        </PlockButton>
                    </div>
                </div>
                <div className="hidden relative flex-1 w-1/2 min-w-0 lg:flex">
                    <div className="flex absolute inset-0 justify-center items-center">
                        <img
                            src={step.image}
                            className="max-w-full min-h-0 max-h-full rounded-2xl"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </DefaultPageLayout>
    )
}
