"use client";

import {
  ChevronLeft,
  ChevronRight,
  MessageSquareMore,
  ShieldCheck,
  ShieldOff,
  Trash,
  Undo,
  X,
} from "lucide-react";
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
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface Post {
  _id: string;
  caption: string;
  image: string[];
  likes: any[];
  media: any[];
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
  followers: string[];
  posts: Post[];
  pageVisit: number;
  pageProfileImage: string;
}

const BusinessPages: React.FC = () => {
  const [businessPages, setBusinessPages] = useState<BusinessPage>();
  const [activePost, setActivePost] = useState<string | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessPage | null>(
    null
  );
  const [message, setMessage] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
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
        setBusinessPages(response.data.businessPage || []);
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
  const totalPages = Math.ceil(posts.length / postsPerPage);

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

  const toggleDeletePost = async (postId: string, isDeleted: boolean) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`https://postbox.biz/api/admin/deletePost/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedPosts = businessPages?.posts.map((post) =>
        post._id === postId ? { ...post, isDeleted: !post.isDeleted } : post
      ) || [];
      setPosts(updatedPosts);
      setMessage(`Post ${isDeleted ? "restored" : "deleted"} successfully!`);
    } catch (err) {
      setError(`Failed to ${isDeleted ? "restore" : "delete"} post.`);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeletePost = (postId: string, isDeleted: boolean) => {
    const action = isDeleted ? "restore" : "delete";
    const confirmAction = window.confirm(
      `Are you sure you want to ${action} this post?`
    );

    if (confirmAction) {
      toggleDeletePost(postId, isDeleted);
    }
  };

  const toggleCommentStatus = async (
    commentId: string,
    isDeActivated: boolean
  ) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `https://postbox.biz/api/admin/deActivateComment/${commentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedPosts = posts.map((post) =>
        post.comments.some((c) => c._id === commentId)
          ? {
            ...post,
            comments: post.comments.map((comment) =>
              comment._id === commentId
                ? { ...comment, isDeActivated: !comment.isDeActivated }
                : comment
            ),
          }
          : post
      );

      setPosts(updatedPosts);
      setMessage(
        `Comment ${isDeActivated ? "reactivated" : "deactivated"} successfully!`
      );
    } catch (err) {
      setError(
        `Failed to ${isDeActivated ? "reactivate" : "deactivate"} comment.`
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleComments = (postId: string) => {
    setActivePost(postId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setActivePost(null);
  };


  return (
    <div className="flex flex-col items-center p-4 mt-14 w-full">
      {loading && <Loading />}
      {error && <div className="text-red-500">{error}</div>}

      <Card className="max-w-lg">
        <CardContent className="w-full max-w-2xl mx-auto">
          <div className="flex items-center space-x-4 my-6">
            <Image
              src={businessPages?.pageProfileImage || ""}
              alt="Profile"
              width={100}
              height={100}
              objectFit=""
              className="w-[100px] h-[100px] object-cover rounded-full"
            />
            <div>
              <h1 className="font-bold text-2xl capitalize">{businessPages?.businessName || ""}</h1>
              <p className="text-gray-600">@{businessPages?.businessUsername || ""}</p>
              <p className="text-sm text-center text-gray-500">
                {businessPages?.service || ""}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 mb-6 text-center">
            <div className="hover:bg-gray-50 ">
              <p className="font-semibold">{businessPages?.posts?.length}</p>
              <p className="text-sm text-gray-600">Posts</p>
            </div>
            <div>
              <p className="font-semibold">{businessPages?.followers?.length}</p>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div>
            <Label htmlFor="username">Bio</Label>
            <Textarea
              disabled
              value={businessPages?.bio || ""}
              id="Bio"
              name="bio"
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                disabled
                value={businessPages?.businessUsername || ""}
                id="username"
                type="text"
                name="username"
              />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                disabled
                value={businessPages?.businessName || ""}
                id="name"
                type="text"
                name="name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                disabled
                value={businessPages?.email || ""}
                id="email"
                type="email"
                name="email"
              />
            </div>
            <div>
              <Label htmlFor="websiteUrl">websiteUrl</Label>
              <Input
                disabled
                value={businessPages?.websiteUrl || ""}
                id="dob"
                type="date"
                name="dob"
              />
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Posts Section */}
      <h1 className="text-xl font-bold my-8">Business Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-screen-lg">
        {businessPages?.posts?.map((post) => (
          <div key={post._id} className="p-4 border rounded-lg shadow-md">
            <Carousel className="w-full h-[200px]">
              <CarouselContent>
                {post.media.map((item, idx) => (
                  <CarouselItem key={idx}>
                    <Image
                      src={item.path}
                      height={200}
                      width={200}
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
            <div className="flex justify-between mt-4">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                onClick={() => toggleComments(post._id)}
              >
                <MessageSquareMore className="inline-block mr-2" />(
                {post.comments.length})
              </button>
              <button
                className={`${post.isDeleted
                  ? "bg-gray-500 hover:bg-gray-600"
                  : "bg-red-500 hover:bg-red-600"
                  } text-white px-2 py-1 rounded`}
                onClick={() => confirmDeletePost(post._id, post.isDeleted)}
              >
                {post.isDeleted ? <Undo /> : <Trash />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-8">
        <button
          className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
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
          className={`px-4 py-2 rounded ${currentPage === totalPages
            ? "bg-gray-300"
            : "bg-blue-500 text-white"
            }`}
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
        >
          <ChevronRight />
        </button>
      </div>

      {
        showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ease-in-out"
            onClick={closeModal} // Close modal when clicking the overlay
          >
            <div
              className="bg-white p-8 rounded-lg w-full max-w-2xl transition-transform transform duration-300 ease-in-out"
              onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
            >
              <h2 className="text-xl font-bold mb-4">Comments</h2>
              {/* @ts-ignore */}
              {posts?.find((post) => post._id === activePost)?.comments.length >
                0 ? (
                <ul>
                  {businessPages?.posts
                    .find((post) => post._id === activePost)
                    ?.comments.map((comment) => (
                      <li
                        key={comment._id}
                        className="border-b border-gray-200 py-2"
                      >
                        <p>{comment.comment}</p>
                        <button
                          className={`${comment.isDeActivated
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-500 hover:bg-gray-600"
                            } text-white px-2 py-1 rounded mt-2`}
                          onClick={() =>
                            toggleCommentStatus(
                              comment._id,
                              comment.isDeActivated
                            )
                          }
                        >
                          {comment.isDeActivated ? (
                            <ShieldCheck />
                          ) : (
                            <ShieldOff />
                          )}
                        </button>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  No comments available for this post.
                </p>
              )}

              <button
                className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                onClick={closeModal}
              >
                <X />
              </button>
            </div>
          </div>
        )
      }


    </div >
  );
};

export default BusinessPages;