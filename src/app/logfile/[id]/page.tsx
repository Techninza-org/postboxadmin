"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getCookie } from "cookies-next";
import Loading from "@/components/loading";
import { useParams } from "next/navigation";

type Log = {
  _id: string;
  logMessage: string;
  logLevel: string;
  createdAt: string;
};

const LogDetailPage = () => {
//   const router = useRouter();
  const { id } = useParams<{ id: string }>();// Get the `id` from the route
  const [log, setLog] = useState<Log | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = getCookie("authtoken");

  useEffect(() => {
    if (id) {
      // Fetch log details using the `id`
      const fetchLog = async () => {
        try {
          const response = await axios.get(
            `https://postbox.biz/api/admin/previewLogs`,
            {
              headers: { Authorization: `Bearer ${token}` },
              params: { id },
            }
          );
          setLog(response.data.data);
        } catch (err) {
          setError("Failed to fetch log details");
        } finally {
          setLoading(false);
        }
      };

      fetchLog();
    }
  }, [id, token]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-8 mt-10 w-[80vw]">
      <h1 className="text-2xl font-bold mb-4">Log Details</h1>
      {/* @ts-ignore */}

      <pre>{log}</pre>
    
    </div>
  );
};

export default LogDetailPage;
