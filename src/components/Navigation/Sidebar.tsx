"use client";
import React, { useState } from "react";
import {
  ChevronRight,
  LayoutDashboard,
  ShoppingCart,
  UserRound,
  Settings,
  IndianRupee,
  FileClock,
} from "lucide-react";
import { Nav } from "../ui/nav";
import { Button } from "../ui/button";
import { useWindowWidth } from "@react-hook/window-size";

const Sidebar = () => {
  const [isCollapsed, setCollapsed] = useState(false);
  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768; // Mobile view condition

  const handleToggle = () => {
    setCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`relative bg-gray-900 text-white ${
        isCollapsed || mobileWidth ? "w-16" : "w-40"
      } fixed min-h-screen z-10 top-12  pt-20  flex flex-col transition-all duration-300 ease-in-out bg-[#1e2035] items-center text-white`}
    >
      {/* Show toggle button only on desktop/tablet screens */}
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
        isCollapsed={mobileWidth ? true : isCollapsed} // Collapse on mobile
        links={[
          {
            title: "Dashboard",
            href: "/",
            icon: LayoutDashboard,
            variant: "default",
          },
          {
            title: "Users",
            href: "/users",
            icon: UserRound,
            variant: "ghost",
          },
          {
            title: "Transactions",
            href: "/transections",
            icon: IndianRupee ,
            variant: "ghost",
          },
          {
            title: "Log Files",
            href: "/logfile",
            icon: FileClock,
            variant: "ghost",
          },
          {
            title: "Settings",
            href: "/settings",
            icon: Settings,
            variant: "ghost",
          },
        ]}
      />
    </div>
  );
};

export default Sidebar;
