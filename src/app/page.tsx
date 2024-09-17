"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { BookCopy, CreditCard, DollarSign, User } from "lucide-react";
import { CardContent, CardProps, DashBoadCard } from "@/components/DashBoadCard";
import BarChart from "@/components/ui/barChart";
import SalesCard from "@/components/SalesCard";
import { NavigationBar } from "@/components/Navigation/NavigationBar";
import Loading from "@/components/loading";

// Define card data type for better TypeScript support
interface CardData {
  label: string;
  amount: number;
  descriptions: string;
  icons: React.ComponentType<any>; // Use a more specific type if possible
}

export default function Home() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = getCookie("authtoken") as string; // Ensure token is a string

  // Fetch user data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://103.119.171.226:4000/admin/totalData", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data); // Set data from API response
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]); // Add token to dependency array

  const cardData: CardData[] = [
    {
      label: "Total User",
      amount: data.totalUsers || 0,
      descriptions: "+ 20.1% from last month",
      icons: User,
    },
    {
      label: "Total Post",
      amount: data.totalPosts || 0,
      descriptions: "+ 20.1% from last month",
      icons: BookCopy,
    },
    {
      label: "Total Adds Boots",
      amount: data.totalBoostedPosts || 0,
      descriptions: "+ 20.1% from last month",
      icons: CreditCard,
    },
    {
      label: "Total Active Adds",
      amount: data.totalActiveBoostedPosts || 0,
      descriptions: "+ 20.1% from last month",
      icons: DollarSign,
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
        {/* Commented out section, uncomment and adjust as needed
        <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-2">
          <CardContent>
            <p className="p-4 font-semibold">Overview</p>
            <BarChart />
          </CardContent>
          <CardContent>
            <p className="font-semibold">Recent Account</p>
            <p className="text-gray-400 text-sm">
              you got 265 post this month
            </p>
            {salesData.map((d, i) => (
              <SalesCard key={i} {...d} />
            ))}
          </CardContent>
        </section>
        */}
      </div>
    </NavigationBar>
  );
}
