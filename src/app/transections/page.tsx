// app/transections/page.tsx
"use client";
import { DataTable } from '@/components/DataTable';
import Title from '@/components/Title';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';

// Define the Payment type
type Payment = {
  name: string;
  date: string;
  status: "pending" | "processing" | "success" | "failed";
  amount: string;
};

// Helper function to get a random status
const getRandomStatus = (): "pending" | "processing" | "success" | "failed" => {
  const statuses: ("pending" | "processing" | "success" | "failed")[] = ["pending", "processing", "success", "failed"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Example data for the orders
const data: Payment[] = [
  { name: "EFTRGVR78596", status: getRandomStatus(), date: "12-11-2024", amount: "credit" },
  { name: "DEFV566", status: getRandomStatus(), date: "12-11-2024", amount: "credit" },
  { name: "FRGF86+", status: getRandomStatus(), date: "12-11-2024", amount: "credit" },
  { name: "FRGTY785", status: getRandomStatus(), date: "12-11-2024", amount: "credit" },
  { name: "FERTR78", status: getRandomStatus(), date: "12-11-2024", amount: "credit" },
  { name: "SFT555820", status: getRandomStatus(), date: "12-11-2024", amount: "credit" },
  { name: "GT87526", status: getRandomStatus(), date: "12-11-2024", amount: "credit" },
  { name: "EFREG88", status: getRandomStatus(), date: "12-11-2024", amount: "credit" },
  { name: "EFRY6YU856", status: getRandomStatus(), date: "12-11-2024", amount: "credit" },
  { name: "FETR7995", status: getRandomStatus(), date: "12-11-2024", amount: "credit" },
  { name: "DERF47856", status: getRandomStatus(), date: "12-11-2024", amount: "credit" },
  { name: "DERVRG785", status: getRandomStatus(), date: "12-11-2024", amount: "credit" },
  { name: "RMGTPRMG856", status: getRandomStatus(), date: "12-11-2024", amount: "credit" },
];



// Define the columns for the table
const columns: ColumnDef<Payment>[] = [
  {
    
    accessorKey: "_id",
    header: "Transaction Id",
  },
  {
    header: "Razor Transaction Id",
    accessorKey: "razorpayOrderId",
  },
  {
    header: "Status",
    accessorKey: "paymentStatus",
    cell: ({ row }) => {

      let status = '';
      switch (Number(row.getValue('paymentStatus'))) {
        case 0:
          status = "pending"
          break;
        case 1:
          status = "success"
          break;
        case 2:
          status = "failed"
          break;
      }
      return (
        <div className={cn("font-medium text-xs text-white w-20 text-center py-1 px-2 rounded-lg capitalize", {
          "bg-red-800": row.getValue('paymentStatus') === 0, //failed
          "bg-orange-800": row.getValue('paymentStatus') === 2, //pending
          "bg-green-800": row.getValue('paymentStatus') === 1, //success
        })}>
          {status}
        </div>
      );
    }
  },
  {
    header: "date",
    accessorKey: "createdAt",
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
  },
];

// Create the OrderPage component
const OrderPage: React.FC = () => {

  const [data, setData] = useState<any>()
  const token = getCookie("authtoken");

  const fetchTxnData = async () => {
    try {
      const res = (await axios.get('https://postbox.biz/api/admin/allOrders', {
        headers: { Authorization: `Bearer ${token}` },
      })).data
      setData(res.orders)
    } catch (error) {
      console.log(error, "Error [fetchTxnData]")
    }
  }

  useEffect(() => {
    fetchTxnData()
  }, [token])


  return (
    <div className='flex flex-col gap-5 w-[85vw] pt-16 px-10'>
      <Title title="Orders" />
      <DataTable columns={columns} data={data || []} />
    </div>
  );
};

export default OrderPage;
