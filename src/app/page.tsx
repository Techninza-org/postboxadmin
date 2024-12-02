"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import {
  BookCopy,
  CreditCard,
  DollarSign,
  User,
  LucideIcon,
} from "lucide-react"; // Import LucideIcon type
import { DashBoadCard } from "@/components/DashBoadCard";
import { NavigationBar } from "@/components/Navigation/NavigationBar";
import Loading from "@/components/loading";

// Define card data type
interface CardData {
  label: string;
  amount: string; // Ensure amount is a string
  descriptions: string;
  icons: LucideIcon; // Use LucideIcon type here
}

export default function Home() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = getCookie("authtoken") as string; // Ensure token is a string

  // Fetch user data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://postbox.biz/api/admin/totalData",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(response.data); // Set data from API response
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]); // Add token to dependency array

  // Prepare card data with amount converted to string
  const cardData: CardData[] = [
    {
      label: "Total User",
      amount: data.totalUsers?.toString() || "0", // Convert to string
      descriptions: "+ 20.1% from last month",
      icons: User, // This is a LucideIcon
    },
    {
      label: "Total Post",
      amount: data.totalPosts?.toString() || "0", // Convert to string
      descriptions: "+ 20.1% from last month",
      icons: BookCopy, // This is a LucideIcon
    },
    {
      label: "Total Adds Boots",
      amount: data.totalBoostedPosts?.toString() || "0", // Convert to string
      descriptions: "+ 20.1% from last month",
      icons: CreditCard, // This is a LucideIcon
    },
    {
      label: "Total Active Adds",
      amount: data.totalActiveBoostedPosts?.toString() || "0", // Convert to string
      descriptions: "+ 20.1% from last month",
      icons: DollarSign, // This is a LucideIcon
    },
  ];

  return (
    <NavigationBar>
      <div className="flex flex-col w-[90vw] gap-4 pt-20 px-10">
        {loading && <Loading />}
        {error && <p className="text-red-500">{error}</p>}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2 mt-5 transition-all h-[500px]">
          {cardData.map((card, index) => (
            <DashBoadCard key={index} {...card} />
          ))}
        </section>
      </div>
    </NavigationBar>
  );
}
