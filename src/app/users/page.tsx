"use client";

import { DataTable } from "@/components/DataTable";
import Title from "@/components/Title";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, ShieldCheck, ShieldBan, UserRoundPen,MoreHorizontal, ArrowUpDown } from "lucide-react";


import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { format } from "date-fns";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
      const response = await axios.get(
        "http://103.119.171.226:4000/admin/users",
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

  useEffect(() => {
    fetchData();
  }, []);

  // Handle block/unblock user using the same API
  const handleBlockToggle = async (id: string, isBlocked: boolean) => {
    const action = isBlocked ? "unblock" : "block"; // Determine action based on current state
    const isConfirmed = window.confirm(
      `Are you sure you want to ${action} this user?`
    );
    if (!isConfirmed) {
      return; // Exit the function if user cancels the action
    }

    setLoading(true);

    try {
      // Call the same API endpoint regardless of action
      const response = await axios.post(
        `http://103.119.171.226:4000/admin/blockUser/${id}`,
        {}, // No request body required
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the specific user's isBlocked status in the state after successful response
      const updatedUser = response.data; // Assume response contains the updated user object with isBlocked
      setData((prevData) =>
        prevData.map((user) =>
          user._id === id ? { ...user, isBlocked: updatedUser.isBlocked } : user
        )
      );

      alert(
        `User successfully ${updatedUser.isBlocked ? "blocked" : "unblocked"}`
      );
    } catch (err) {
      setError(`Failed to ${action} user`);
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
        )
      },
    },
    {
      accessorKey: "dob", // The key for the data from the API
      header: "Date of Birth",
      cell: ({ getValue }) => {
        const dob = getValue();
        return dob ? format(new Date(dob), "dd/MM/yyyy") : ""; // Format the date, or leave empty if dob is null/undefined
      },
    },
    // {
    //   accessorKey: "actions",
    //   header: "Actions",
    //   cell: ({ row }) => {
    //     const { _id, isBlocked } = row.original;
    //     return (
    //       <div className="flex gap-2">
    //         <Link href={`/user-post/${_id}`}>
    //           <button className="bg-orange-500 text-white px-2 py-1 rounded">
    //             <Eye size={15} />
    //           </button>
    //         </Link>
    //         <Link href={`edit-user/${_id}`}>
    //         <button
    //           className="bg-blue-500 text-white px-2 py-1 rounded"
    //         >
    //           <UserRoundPen size={15} />
    //         </button>
    //         </Link>
    //         <button
    //           className={`${
    //             isBlocked ? "bg-green-500" : "bg-red-500"
    //           } text-white px-2 py-1 rounded`}
    //           onClick={() => handleBlockToggle(_id, isBlocked)}
    //         >
    //           {isBlocked ? <ShieldBan size={15} /> : <ShieldCheck size={15} />}
    //         </button>
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "actions",
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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={`/user-post/${_id}`}>
              <DropdownMenuItem>View User</DropdownMenuItem>
              </Link>
              <Link href={`edit-user/${_id}`}>
              <DropdownMenuItem>Edit User details</DropdownMenuItem>
              </Link>
              <DropdownMenuItem
              //   className={`${
              //   isBlocked ? "bg-green-500 " : "bg-red-500"
              // } text-white px-2 py-1 rounded`}
               onClick={() => handleBlockToggle(_id, isBlocked)}
            >
                {isBlocked ? "BlockedUser" : "UnblockUser"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];

  if (loading) {
    return <Loading/>;
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
