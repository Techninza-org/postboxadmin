import { NavigationBar } from "@/components/Navigation/NavigationBar";
import { Suspense } from "react";


export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense>

        <NavigationBar>
            <main>{children}</main>
        </NavigationBar>
        </Suspense>
    )
}