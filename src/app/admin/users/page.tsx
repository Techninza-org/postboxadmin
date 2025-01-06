"use client";

import { DataTable } from "@/components/DataTable";
import Title from "@/components/Title";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { format } from "date-fns";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the user type (adjust according to your API response)
type Payment = {
  _id: string;
  name: string;
  email: string;
  CreateAt: string;
  isBlocked: boolean; // isBlocked field from the API response
};

const UserPage = () => {
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const token = getCookie("authtoken"); // Token from cookies
  const [selectedUser, setSelectedUser] = useState<Payment | null>(null); // Selected user state

  // Fetch user data from the API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://postbox.biz/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data.users); // Set data from API response
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle block/unblock user using the same API
  // Handle block/unblock user with proper toggling
  const handleBlockToggle = async (id: string, currentStatus: boolean) => {
    const action = currentStatus ? "unblock" : "block";
    const isConfirmed = window.confirm(
      `Are you sure you want to ${action} this user?`
    );

    if (!isConfirmed) return;

    setLoading(true);

    try {
      // Call the API endpoint to toggle the block/unblock status
      await axios.post(
        `https://postbox.biz/api/admin/blockUser/${id}`,
        {}, // No request body needed
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the user's `isBlocked` status in the local state
      setData((prevData) =>
        prevData.map((user) =>
          user._id === id ? { ...user, isBlocked: !currentStatus } : user
        )
      );

      alert(`User successfully ${action}ed.`);
    } catch (err) {
      setError(`Failed to ${action} user. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Define columns for the data table
  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "username",
      header: "UserName",
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "dob",
      header: "Date of Birth",
      cell: ({ getValue }) => {
        const dob = getValue();
        return dob && (typeof dob === "string" || typeof dob === "number")
          ? format(new Date(dob), "dd/MM/yyyy")
          : ""; // Format the date
      },
    },
    {
      accessorKey: "Actions",
      cell: ({ row }) => {
        const { _id, isBlocked } = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/user-post/${_id}`}>
                <DropdownMenuItem>View User</DropdownMenuItem>
              </Link>
              <Link href={`edit-user/${_id}`}>
                <DropdownMenuItem>View User Details</DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() => handleBlockToggle(_id, isBlocked)}
              >
                {isBlocked ? "Unblock User" : "Block User"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col gap-5 w-[85vw] pt-16 px-10">
      <Title title="User" />
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default UserPage;
