import { Description, Label, Meter, NumberField } from "@heroui/react"
import { DefaultPageLayout } from "../layouts/DefaultPageLayout"
import step1 from '@/assets/receipt-registration/step1.svg'
import { PlockButton } from "../primitives/PlockButton"

interface RegisterReceiptPageProps {
}

export const RegisterReceiptPage: React.FC<RegisterReceiptPageProps> = ({
}) => {
    return (
        <DefaultPageLayout className="flex flex-col flex-1 gap-8">
            <Meter aria-label="Storage" className="w-full" value={60} valueLabel={"Step 2/7"} size="sm">
                <Label>Registration progress</Label>
                <Meter.Output />
                <Meter.Track>
                    <Meter.Fill />
                </Meter.Track>
            </Meter>
            <div className="flex flex-1 sm:p-20">
                <div className="flex flex-col justify-between w-full lg:w-1/2">
                    <div className="flex flex-col gap-2 pt-4">
                        <h2>Hur många ska äta?</h2>
                        <p>Ange antal personer som ska äta varje rätt</p>
                    </div>
                    <div className="flex flex-col gap-8 items-center">
                        <NumberField defaultValue={2} minValue={1} name="primary-width" variant="primary" className={"w-40"}>
                            <Label>Antal vuxna</Label>
                            <NumberField.Group>
                                <NumberField.DecrementButton />
                                <NumberField.Input className="" />
                                <NumberField.IncrementButton />
                            </NumberField.Group>
                        </NumberField>
                        <NumberField defaultValue={0} minValue={0} name="primary-width" variant="primary" className={"w-40"}>
                            <Label>Antal barn</Label>
                            <NumberField.Group>
                                <NumberField.DecrementButton />
                                <NumberField.Input className="" />
                                <NumberField.IncrementButton />
                            </NumberField.Group>
                            <Description>Under 12 år</Description>
                        </NumberField>
                    </div>
                    <div className="flex flex-col-reverse gap-4 justify-center items-center sm:flex-row">
                        <PlockButton variant='citrus' size='lg' onPress={() => console.log("Button pressed")} className="w-full sm:w-auto">
                           Tillbaka
                        </PlockButton>
                        <PlockButton variant='primary' size='xl' onPress={() => console.log("Button pressed")} className="w-full sm:w-auto" >
                            Nästa
                        </PlockButton>
                    </div>
                </div>
                <div className="hidden relative flex-1 w-1/2 min-w-0 lg:flex">
                    <div className="flex absolute inset-0 justify-center items-center">
                        <img
                            src={step1}
                            className="max-w-full min-h-0 max-h-full rounded-2xl"
                            alt="Steg 1"
                        />
                    </div>
                </div>
            </div>
        </DefaultPageLayout>
    )
}
