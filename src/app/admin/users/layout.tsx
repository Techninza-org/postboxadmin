import { NavigationBar } from "@/components/Navigation/NavigationBar";


export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <NavigationBar>
            <main>{children}</main>
        </NavigationBar>
    )
}