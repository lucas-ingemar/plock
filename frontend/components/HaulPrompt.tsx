import { cn, TextArea } from "@heroui/react";
import { Convert, type Haul, type HaulResponse } from "../types/types";
import { useEffect, useState } from "react";
import { useApi } from "../api/ApiContext";
import { ArrowDown } from "lucide-react";
import { PlockButton } from "../primitives/PlockButton";
import { CopyButton } from "./CopyButton";

interface HaulPromptProps {
    haul: Haul,
}

export const HaulPrompt: React.FC<HaulPromptProps> = ({
    haul,
}) => {

    const [prompt, setPrompt] = useState("")
    const [canSubmit, setCanSubmit] = useState(false)
    const [validationError, setValidationError] = useState("")
    const [haulResponse, setHaulResponse] = useState<HaulResponse|undefined>()
    const api = useApi()

    useEffect(() => {
        api.getHaulPrompt(haul.id).then((h) => {setPrompt(h.prompt)})
    }, [api])

    const validateResponse = (resp: string) => {
        try {
            const hr = Convert.toHaulResponse(resp)
            setHaulResponse(hr)
            setValidationError("")
            setCanSubmit(true)
        } catch (e) {
            setValidationError(e instanceof Error ? e.message : String(e))
            setCanSubmit(false)
            setHaulResponse(undefined)
        }
    }

    const onSubmit = () => {
        if (haulResponse) {
            api.addHaulPromptResponse(haul.id, haulResponse)
        }
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="w-full text-5xl">Ditt plock som prompt</h1>
            <div className="flex flex-col items-center mt-16 max-w-screen-md">
                <h2 className="text-4xl">Steg 1</h2>
                <p className="mt-8 font-medium text-justify text-muted">Plock har generat en prompt till dig som du ska ge till din AI. Du ska kopiera texten nedan, antingen genom att markera allt eller klicka på kopiera-knappen. Du börjar med att bifoga kvittot till din AI och i samma prompt skickar du med texten nedan. Du ska inte ändra eller ta bort någonting i texten.</p>
                <div className="flex flex-col gap-2 items-end mt-8">
                    <CopyButton text={prompt}/>
                    <div className="overflow-y-scroll p-4 h-60 font-mono text-sm whitespace-pre-wrap rounded-md bg-surface border-1 border-border">
                        {prompt}
                    </div>
                </div>

                <ArrowDown className="mt-12 text-muted" size={60}/>

                <h2 className="mt-12 text-4xl">Steg 2</h2>
                <p className="mt-8 font-medium text-justify text-muted">Svaret som du får tillbaka från din AI ska du klistra in i rutan under. Det är den datan som kommer att användas för att sedan generera recpt. Datan kommer på ett strukturerat format så var säker på att kopierar och klistrar in precis allt som AI:n svarade. Annars kommer det inte att kunna analyseras.</p>

                <div className="flex relative flex-col gap-2 items-end mt-8 w-full">
                    <p className={
                        cn(validationError == "" ? "hidden" : "",
                        "absolute  bg-danger/85 rounded-md py-1 backdrop-blur-md text-danger-foreground px-8"
                    )}>{validationError}</p>
                    <TextArea className="w-full h-60 font-mono rounded-md shadow-none border-1 border-border" onChange={(e) => {validateResponse(e.target.value)}}/>
                </div>

                <ArrowDown className="mt-12 text-muted" size={60}/>

                <PlockButton isDisabled={!canSubmit} onClick={onSubmit} size="xl" className="mt-12 w-full sm:w-auto">Analysera</PlockButton>
            </div>
        </div>
    )
}
