import { DefaultPageLayout } from "../layouts/DefaultPageLayout"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Status, type Haul } from "../types/types";
import { useApi } from "../api/ApiContext";
import { HaulPrompt } from "../components/HaulPrompt";
import { HaulView } from "../components/HaulView";

export const HaulPage: React.FC = () => {
    const [haul, setHaul] = useState<Haul|undefined>()
    const api = useApi();
    const params = useParams();

    useEffect(() => {
        api.getHaul(params.haulID as string).then(setHaul)
    }, [api])

    let content = (<>hej</>)

    switch (haul?.status) {
        case Status.Draft:
            content = (
            <DefaultPageLayout className="self-center max-w-screen-2xl">
                <HaulPrompt haul={haul}/>
            </DefaultPageLayout>
            )
            break
        case Status.Ready:
            content = <HaulView haul={haul}/>
            break
    }

    return (
        <>
        {content}
        </>
    )
}
