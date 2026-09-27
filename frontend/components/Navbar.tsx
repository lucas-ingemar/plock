import plockIcon from '@/assets/plock-icon.svg'
import { Avatar, Button, Label, SearchField } from '@heroui/react'
import { PlockButton } from '../primitives/PlockButton'
import { useTranslation } from "react-i18next";
import { useEffect } from 'react';
import { ScanText } from 'lucide-react';

interface NavbarProps {
}

export const Navbar: React.FC<NavbarProps> = ({
}) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage("sv")
    }, [])

    return (
        <div className="flex gap-8 justify-between items-center py-4 px-8 w-full border-b-2 bg-background border-border">
            <div className="flex gap-2 items-center">
                <img src={plockIcon} className="w-14 h-14" alt="Plock logo" />
                <h1 className="font-sans text-4xl font-bold text-accent">plock</h1>
            </div>
            <div className="hidden flex-grow gap-4 items-center px-24 sm:flex">
                <Button variant='primary' size='lg' onPress={() => console.log("Button pressed")}>
                    {t("navbar.week")}
                </Button>
                <Button variant='ghost' size='lg' onPress={() => console.log("Button pressed")}>
                    {t("navbar.receipts")}
                </Button>
                <PlockButton variant='ghost' size='lg' onPress={() => console.log("Button pressed")}>
                    {t("navbar.recipes")}
                </PlockButton>
            </div>
            <div className="hidden gap-20 items-center md:flex">
                <SearchField name="search" className="hidden xl:flex">
                <SearchField.Group className="h-10">
                    <SearchField.SearchIcon />
                    <SearchField.Input className="w-[280px]" placeholder={t("navbar.search.placeholder")} />
                    <SearchField.ClearButton />
                </SearchField.Group>
                </SearchField>
                <PlockButton variant='citrus' size='lg' onPress={() => console.log("Button pressed")}>
                    <ScanText size={20}/>
                    {t("navbar.scanReceipt")}
                </PlockButton>
            </div>
            <Avatar size='lg'>
                <Avatar.Image alt="John Doe" src="https://HEJimg.heroui.chat/image/avatar?w=400&h=400&u=3" />
                <Avatar.Fallback>JD</Avatar.Fallback>
            </Avatar>
        </div>
    )
}
