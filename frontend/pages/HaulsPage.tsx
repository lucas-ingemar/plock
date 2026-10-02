import { useTranslation } from "react-i18next";
import { DefaultPageLayout } from "../layouts/DefaultPageLayout"
import { PlockButton } from "../primitives/PlockButton";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Haul } from "../types/types";
import { PlockChip } from "../primitives/PlockChip";
import { useApi } from "../api/ApiContext";
import { HaulStatusCard } from "../components/HaulStatusCard";

export const HaulsPage: React.FC = () => {
    const [hauls, setHauls] = useState<Haul[]>([])
    const { t } = useTranslation();
    const navigate = useNavigate();
    const api = useApi();

    useEffect(() => {
        api.listHauls().then(setHauls)
    }, [api])

    return (
        <DefaultPageLayout className="self-center max-w-screen-2xl">
            <div className="flex justify-between items-end w-full">
                <div>
                    <h1 className="flex-grow font-sans text-5xl font-black text-foreground">{t("haulsPage.title")}</h1>
                    <p className="pt-3 text-muted">{t("haulsPage.subtitle")}</p>
                </div>
                <PlockButton variant="citrus" size="xl" className="hidden sm:flex" onPress={() => navigate("/register-receipt")}>
                    <Plus />
                    {t("haulsPage.newHaul")}
                </PlockButton>
            </div>

            <div className="flex mt-8">
                <PlockChip variant="filterSelected" className="gap-2">
                    <p>{t("haulsPage.filters.all")}</p>
                    <p className="text-sm text-accent-foreground/70">{hauls.length}</p>
                </PlockChip>
            </div>
            <div className="flex flex-col gap-4 mt-8">
            {hauls.map((haul: Haul) => (
                <HaulStatusCard haul={haul} />
            ))}
            </div>
        </DefaultPageLayout>
    )
}
