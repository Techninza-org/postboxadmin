"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getCookie } from "cookies-next";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Loading from "@/components/loading";

interface Post {
  _id: string;
  caption: string;
  image: string[];
  likes: any[];
  comments: Comment[];
  isDeleted: boolean;
}

interface Comment {
  _id: string;
  userId: string;
  comment: string;
  isDeActivated: boolean;
}

interface BusinessPage {
  _id: string;
  userId: string;
  businessName: string;
  businessUsername: string;
  service: string;
  bio: string;
  websiteUrl: string;
  pickingDetails: string;
  email: string;
  mobile: number;
  address: string[];
  posts: Post[];
  pageVisit: number;
  pageProfileImage: string;
}

const BusinessPages: React.FC = () => {
  const [businessPages, setBusinessPages] = useState<BusinessPage[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessPage | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const token = getCookie("authtoken");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchBusinessPages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://postbox.biz/api/admin/businessPage/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBusinessPages(response.data.businessPages || []);
      } catch (err) {
        setError("Failed to fetch business pages.");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessPages();
  }, [id, token]);

  const selectBusinessPage = (businessPage: BusinessPage) => {
    setSelectedBusiness(businessPage);
  };

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = selectedBusiness?.posts.slice(
    indexOfFirstPost,
    indexOfLastPost
  );
  const totalPages = selectedBusiness
    ? Math.ceil(selectedBusiness.posts.length / postsPerPage)
    : 1;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 mt-10 w-full">
      {loading && <Loading />}
      {error && <div className="text-red-500">{error}</div>}

      {/* Business Page List */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Business Pages</h1>
        {businessPages.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {businessPages.map((businessPage) => (
              <li
                key={businessPage._id}
                className="p-4 border rounded-lg shadow-md cursor-pointer"
                onClick={() => selectBusinessPage(businessPage)}
              >
                <img
                  src={businessPage.pageProfileImage}
                  alt={businessPage.businessName}
                  className="w-[100px] h-[100px] object-cover rounded-full mx-auto mb-4"
                />
                <h2 className="text-lg font-semibold text-center">
                  {businessPage.businessName}
                </h2>
                <p className="text-sm text-center text-gray-500">
                  {businessPage.service}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No business pages available.</p>
        )}
      </div>

      {/* Selected Business Page Details */}
      {selectedBusiness && (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {selectedBusiness.businessName}
          </h2>

          {/* Posts Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts?.map((post) => (
              <div key={post._id} className="p-4 border rounded-lg shadow-md">
                <Carousel className="w-full h-[200px]">
                  <CarouselContent>
                    {post.image.map((img, idx) => (
                      <CarouselItem key={idx}>
                        <img
                          src={img}
                          alt="Post Image"
                          className="w-full h-[200px] object-cover rounded"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>

                <div className="mt-4">
                  <p className="text-sm">
                    <strong>Caption: </strong>
                    {post.caption}
                  </p>
                  <p className="text-sm">
                    <strong>Likes: </strong>
                    {post.likes.length}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-8">
            <button
              className={`px-4 py-2 rounded ${
                currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
              }`}
              disabled={currentPage === 1}
              onClick={handlePrevPage}
            >
              <ChevronLeft />
            </button>
            <p className="text-lg">
              Page {currentPage} of {totalPages}
            </p>
            <button
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300"
                  : "bg-blue-500 text-white"
              }`}
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessPages;
