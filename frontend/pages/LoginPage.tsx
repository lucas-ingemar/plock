import loginIllustration from "@/assets/login-illustration.svg"
import plockIcon from '@/assets/plock-icon.svg'
import { PlockButton } from "../primitives/PlockButton"
import { Checkbox, Input, Label, TextField } from "@heroui/react"

export const LoginPage: React.FC = () => {

    return (
        <div className="flex flex-grow h-full">
            <div className="flex flex-col justify-between items-center px-6 w-full sm:px-0 sm:w-1/2">
                <div className="flex gap-3 items-center pt-10 w-full sm:pl-20">
                    <img src={plockIcon} className="w-14 h-14" alt="Plock logo" />
                    <h1 className="font-sans text-4xl font-bold text-accent">plock</h1>
                </div>
                <div className="w-full max-w-screen-sm">
                    <h1 className="text-6xl font-extrabold">Välkommen hem</h1>
                    <p className="mt-4 text-lg text-muted">Logga in för att se veckans plock och recept.</p>
                    <TextField name="username" variant="primary" className="mt-8">
                        <Label>Användarnamn</Label>
                        <Input className="w-full" />
                    </TextField>
                    <TextField name="password" type="password" variant="primary" className="mt-4">
                        <Label>Lösenord</Label>
                        <Input className="w-full" />
                    </TextField>
                    <Checkbox name="basic-terms">
                    <Checkbox.Content className="[&_[data-slot='checkbox-default-indicator--checkmark']]:size-4 mt-6">
                        <Checkbox.Control className="size-6">
                        <Checkbox.Indicator />
                        </Checkbox.Control>
                        Kom ihåg mig på den här enheten
                    </Checkbox.Content>
                    </Checkbox>
                    <PlockButton size="xl" className="mt-12 w-full">Logga in</PlockButton>
                </div>
                <div>
                </div>
            </div>
            <aside className="hidden overflow-hidden relative w-1/2 lg:block rounded-l-[32px]">
                <img src={loginIllustration} alt="" className="object-cover absolute inset-0 w-full h-full" />
                <h1 className="absolute bottom-20 left-20 text-5xl text-accent-foreground max-w-100">Från kassen till middagsbordet.</h1>
            </aside>
        </div>
    )
}
