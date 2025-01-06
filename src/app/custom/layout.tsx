import { NavigationBar } from "@/components/Navigation/NavigationBar";


export default function CustomLayout({ children }: { children: React.ReactNode }) {
    return (
        <NavigationBar>
            <main>{children}</main>
        </NavigationBar>
    )
}