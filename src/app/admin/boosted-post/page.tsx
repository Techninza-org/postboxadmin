"use client";

import { CardContent } from "@/components/DashBoadCard"; // Ensure this path is correct
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
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  image: string[]; // Array of images
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

interface Profile {
  name: string;
  email: string;
  profileImage: string;
}
interface BusinessPage {
  _id: string;
  title: string;
  description: string;
  image: string;
}

const UserPost: React.FC = () => {
  const [activePost, setActivePost] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [currPost, setCurrPost] = useState<any>()

  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    profileImage: "",
  });
  const [businessPages, setBusinessPages] = useState<BusinessPage[]>([]);
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 6;

  const { id } = useParams<{ id: string }>();
  const token = getCookie("authtoken");

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://postbox.biz/api/admin/allBoostedPosts?page=${currentPage}&limit=${postsPerPage}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPosts(response.data.boostedPosts);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token]);

  // Handle post deletion
  const confirmDeletePost = (postId: string, isDeleted: boolean) => {
    const action = isDeleted ? "restore" : "delete";
    const confirmAction = window.confirm(
      `Are you sure you want to ${action} this post?`
    );

    if (confirmAction) {
      toggleDeletePost(postId, isDeleted);
    }
  };

  const toggleDeletePost = async (postId: string, isDeleted: boolean) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`https://postbox.biz/api/admin/deletePost/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedPosts = posts.map((post) =>
        post._id === postId ? { ...post, isDeleted: !post.isDeleted } : post
      );
      setPosts(updatedPosts);
      setMessage(`Post ${isDeleted ? "restored" : "deleted"} successfully!`);
    } catch (err) {
      setError(`Failed to ${isDeleted ? "restore" : "delete"} post.`);
    } finally {
      setLoading(false);
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
        post.comments.some((c: any) => c._id === commentId)
          ? {
            ...post,
            comments: post.comments.map((comment: any) =>
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
    setShowModal(1);
  };

  const closeModal = () => {
    setShowModal(0);
    setActivePost(null);
    setCurrPost(null);
  };

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts?.length / postsPerPage);

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

  const showPostDetails = (post: any) => {
    setShowModal(2)
    setCurrPost(post)
  }

  return (
    <>
      <div className="flex flex-col items-center p-2 mt-20 w-[85vw]">
        {loading && <Loading />}
        {error && <div className="text-red-500">{error}</div>}

        {/* Posts Section */}
        <h2 className="text-2xl font-bold items-center mb-6">Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentPosts.map((post) => (
            <div key={post._id} className="relative group" onClick={() => showPostDetails(post)}>
              {post.isLive && <div className="text-xs px-2 text-white p-1 rounded-full bg-red-600 animate-pulse absolute -top-2 -right-2">Live</div>}
              <CardContent className="bg-white p-4 shadow-md rounded-lg">
                {/* @ts-ignore */}
                {post.media && post.media.length > 0 && (
                  <Carousel className="w-full max-w-xs">
                    <CarouselContent>
                      {/* @ts-ignore */}
                      {post.media.map((media) => (
                        <CarouselItem key={media.path}>
                          <div className="p-1">
                            {media.type === "video" ? (
                              <video
                                src={media.path}
                                controls
                                className="w-full h-[200px] object-cover rounded"
                              />
                            ) : (
                              <img
                                src={media.path}
                                alt="post media"
                                className="w-full h-[200px] object-cover rounded"
                              />
                            )}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                )}

                <div className="mt-2 text-gray-800">
                  <p>
                    <strong>Caption: </strong>
                    {post.caption}
                  </p>
                  <p>
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
              </CardContent>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between w-full max-w-xs mt-8">
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
      </div>

      {/* Modal for comments */}
      {showModal === 1 && activePost && (
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
            {posts?.find((post) => post._id === activePost)?.comments.length ? (
              <ul>
                {posts
                  .find((post) => post._id === activePost)
                  ?.comments.map((comment: any) => (
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
      )}

      {showModal === 2 && Object.keys(currPost || {}).length && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-2xl transition-transform transform duration-300 ease-in-out">
            <h2 className="text-2xl font-bold mb-4">Post Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={currPost.userId?.profileImage || '/admin/placeholder.svg?height=50&width=50'}
                  alt={currPost.userId?.name || 'User'}
                  className="w-12 h-12 rounded-full"
                />
                <span className="font-semibold">{currPost.userId?.name || 'Unknown User'}</span>
              </div>

              <div>
                <p className="font-semibold">Boost Radius:</p>
                <p>{currPost.boostedPost?.radius || 'N/A'} KM</p>
              </div>

              <div>
                <p className="font-semibold">Boost Start Date:</p>
                <p>{currPost.boostedPost?.startDate ? new Date(currPost.boostedPost.startDate).toLocaleDateString() : 'N/A'}</p>
              </div>

              <div>
                <p className="font-semibold">Boost End Date:</p>
                <p>{currPost.boostedPost?.endDate ? new Date(currPost.boostedPost.endDate).toLocaleDateString() : 'N/A'}</p>
              </div>

              <div>
                <p className="font-semibold">Order ID:</p>
                <p>{currPost.boostedPost.orderId?._id || 'N/A'}</p>
              </div>

              <div>
                <p className="font-semibold">Total Amount:</p>
                <p>{currPost.boostedPost.orderId?.totalAmount ? `${currPost.boostedPost.orderId.totalAmount.toFixed(2)} ${currPost.boostedPost.orderId.currency || ''}` : 'N/A'}</p>
              </div>
            </div>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-6 flex items-center justify-center"
              onClick={closeModal}
            >
              <X className="mr-2" />
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserPost;
