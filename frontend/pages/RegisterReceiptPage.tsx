import { useMemo, useState } from "react"
import { Label, Meter } from "@heroui/react"
import { DefaultPageLayout } from "../layouts/DefaultPageLayout"
import { PlockButton } from "../primitives/PlockButton"
import { createHaul } from "../api"
import { registrationSteps } from "../components/ReceiptRegistrationSteps"
import { type HaulRequest, ProteinPreferenceElement } from "../types/haulrequest"
import { useTranslation } from "react-i18next"

const initialHaulRequest: HaulRequest = {
    household: {
        adults: 2,
        children: [],
    },
    servings_per_meal: 2,
    meal_count: 5,
    max_cooking_minutes: 30,
    protein_preferences: [
        ProteinPreferenceElement.Chicken,
        ProteinPreferenceElement.Beef,
        ProteinPreferenceElement.Pork,
        ProteinPreferenceElement.Fish,
        ProteinPreferenceElement.Vegetarian,
    ],
    cuisine_preferences: [],
}

export const RegisterReceiptPage: React.FC = () => {
    const [data, setData] = useState<HaulRequest>(initialHaulRequest)
    const [stepIndex, setStepIndex] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)


    const { t } = useTranslation();

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

    const update = (patch: Partial<HaulRequest>) =>
        setData((previous) => ({ ...previous, ...patch }))

    const goBack = () => setStepIndex(Math.max(currentIndex - 1, 0))

    const goNext = async () => {
        if (!isLastStep) {
            setStepIndex(currentIndex + 1)
            return
        }
        console.log(data)
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
                aria-label="Registration"
                className="w-full"
                value={progress}
                valueLabel={t("registerReceipt.meter.stepLabel", {step: currentIndex + 1, totalSteps: visibleSteps.length})}
                size="sm"
            >
                <Label>{t("registerReceipt.meter.label")}</Label>
                <Meter.Output />
                <Meter.Track>
                    <Meter.Fill />
                </Meter.Track>
            </Meter>
            <div className="flex flex-1 sm:p-20">
                <div className="flex flex-col gap-10 justify-between w-full lg:w-1/2">
                    <div className="flex flex-col gap-2 pt-4">
                        <h2>{t("registerReceipt.steps." + step.id + ".title")}</h2>
                        <p>{t("registerReceipt.steps." + step.id + ".subtitle")}</p>
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
                           {t("registerReceipt.buttonBack")}
                        </PlockButton>
                        <PlockButton
                            variant="primary"
                            size="xl"
                            isDisabled={!canContinue}
                            isPending={isSubmitting}
                            onPress={goNext}
                            className="w-full sm:w-auto"
                        >
                            {isLastStep ? t("registerReceipt.buttonSubmit") : t("registerReceipt.buttonNext")}
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
