import NavBar from "./NavBar";
import Sidebar from "./Sidebar";

export function NavigationBar({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>
        <NavBar />
      </div>
        <div className="flex">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
