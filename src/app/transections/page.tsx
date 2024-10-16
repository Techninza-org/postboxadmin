// app/transections/page.tsx
"use client";
import { DataTable } from '@/components/DataTable';
import Title from '@/components/Title';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className={cn("font-medium text-xs text-white w-20 text-center py-1 px-2 rounded-lg", {
          "bg-red-800": row.getValue('status') === "failed",
          "bg-orange-800": row.getValue('status') === "pending",
          "bg-yellow-800": row.getValue('status') === "processing",
          "bg-green-800": row.getValue('status') === "success"
        })}>
          {row.getValue('status')}
        </div>
      );
    }
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];

// Create the OrderPage component
const OrderPage: React.FC = () => {
  return (
    <div className='flex flex-col gap-5 w-[85vw] pt-16 px-10'>
      <Title title="Orders" />
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default OrderPage;
