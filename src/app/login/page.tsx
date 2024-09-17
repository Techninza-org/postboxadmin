import { Metadata } from "next";
import { UserAuthForm } from "@/components/UserAuthForm";
import { CardContent } from "@/components/DashBoadCard";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <div className="grid place-content-center h-[100vh]">
      <CardContent className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
        </div>
        <UserAuthForm />
      </CardContent>
    </div>
  );
}
