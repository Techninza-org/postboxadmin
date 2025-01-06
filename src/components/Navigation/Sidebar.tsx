"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  LayoutDashboard,
  UserRound,
  Settings,
  IndianRupee,
  FileClock,
  Zap,
  Pen
} from "lucide-react";
import { Nav } from "../ui/nav";
import { Button } from "../ui/button";
import { useWindowWidth } from "@react-hook/window-size";

const Sidebar = () => {
  const [isCollapsed, setCollapsed] = useState(false);
  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768; // Mobile view condition
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true); // Indicates client-side rendering
  }, []);

  if (!hasMounted) {
    // Render a fallback until the component mounts
    return null;
  }

  const handleToggle = () => {
    setCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`relative bg-gray-900 text-white ${
        isCollapsed || mobileWidth ? "w-16" : "w-40"
      } fixed min-h-screen z-10 top-12  pt-20  flex flex-col transition-all duration-300 ease-in-out bg-[#1e2035] items-center text-white`}
    >
      {!mobileWidth && (
        <div
          className={`absolute -right-3 top-7 transform ${
            isCollapsed ? "" : "rotate-180"
          } transition-transform duration-300 ease-in-out`}
        >
          <Button
            onClick={handleToggle}
            variant="default"
            className="rounded-full p-2 shadow"
          >
            <ChevronRight />
          </Button>
        </div>
      )}

      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
        links={[
          {
            title: "Dashboard",
            href: "/admin/",
            icon: LayoutDashboard,
            variant: "default",
          },
          {
            title: "Users",
            href: "/admin/users",
            icon: UserRound,
            variant: "ghost",
          },
          {
            title: "Transactions",
            href: "/admin/transections",
            icon: IndianRupee,
            variant: "ghost",
          },
          {
            title: "Log Files",
            href: "/admin/logfile",
            icon: FileClock,
            variant: "ghost",
          },
          {
            title: "Boosted Posts",
            href: "/admin/boosted-post",
            icon: Zap,
            variant: "ghost",
          },
          {
            title: "Custom Inputs",
            href: "/admin/custom",
            icon: Pen,
            variant: "ghost",
          },
        ]}
      />
    </div>
  );
};

export default Sidebar;
