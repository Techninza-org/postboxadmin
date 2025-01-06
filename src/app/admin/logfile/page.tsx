"use client";
//@ts-nocheck

import { useRouter } from "next/navigation"; // Import useRouter
import { DataTable } from "@/components/DataTable";
import Title from "@/components/Title";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Download, Eye } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
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

// Define the log type based on API response
type Log = {
  _id: string;
  logMessage: string;
  logLevel: string;
  createdAt: string; // Date field from the API response
};

const UserPage = () => {
  const router = useRouter(); // Initialize the router
  const [data, setData] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const token = getCookie("authtoken");

  // Fetch log data from the API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://postbox.biz/api/log/getLogs",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(response.data.logs); // Set 'logs' array from API response
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to redirect user to preview page
  const handlePreview = (id: string) => {
    router.push(`/logfile/${id}`); // Navigate to the log detail page
  };

  // Function to handle downloading logs
  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `https://postbox.biz/api/admin/downloadLogs`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // Set response type for downloading files
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "logs.csv"); // File name for download
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download logs");
    }
  };

  // Define columns for the data table
  const columns: ColumnDef<any>[] = [ 

    {
      accessorKey: "logMessage",
      header: "Log Message",
    },
    {
      accessorKey: "logLevel",
      header: "Log Level",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ getValue }) => {
        const date = getValue();
        return date && typeof date === "string"
          ? format(new Date(date), "dd/MM/yyyy HH:mm:ss")
          : ""; // Format date or leave empty
      },
    },
    {
      accessorKey: "actions",
      cell: ({ row }) => {
        const { _id } = row.original;

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
              <DropdownMenuItem onClick={() => handlePreview(_id)}>
                <Eye className="mr-2 h-4 w-4" />
                Preview Log
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download Logs
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
      <Title title="Logs" />
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default UserPage;
