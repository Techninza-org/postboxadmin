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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
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
          `https://postbox.biz/api/admin/allPosts/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPosts(response.data.posts);
        setProfile(response.data.user);
        console.log(response.data.user, "this is");
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    const fetchBusinessPages = async () => {
      setLoading(true);
      try {
        // Fetch business page data
        const response = await axios.get(
          `https://postbox.biz/api/admin/businessPages/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setBusinessPages(response.data.businessPages);
      } catch (err) {
        setError("Failed to fetch business pages");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    fetchBusinessPages();
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

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
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

  return (
    <>
      <div className="flex flex-col items-center p-2 mt-20 w-[85vw]">
        {loading && <Loading />}
        {error && <div className="text-red-500">{error}</div>}

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={
              profile.profileImage ? profile?.profileImage : "/user.png" // Default avatar path
            }
            alt="Profile"
            className="w-[100px] h-[100px] object-cover rounded-full"
          />
          <h2 className="text-xl font-bold mt-4">{profile.name}</h2>
          <p className="mt-2">{profile.email}</p>
          <hr className="w-full border-t border-gray-400 my-6" />

          {/* Business Pages Section */}

          <Link href="/admin/about">
            <h2 className="text-lg font-bold items-center mb-2">
              Business Pages
            </h2>
          </Link>
          <div className="w-full mt-2">
            {businessPages.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="flex space-x-8 mx-4">
                  {businessPages.slice(0, 4).map((businessPage: any) => (
                    <Link key={businessPage._id} href={`/business/${businessPage._id}`}>
                      <div
                        key={businessPage._id}
                        className=" p-2 rounded-lg shadow-md flex flex-col items-center h-[120px] border p-4 overflow-auto mx-6"
                      >
                        <img
                          src={businessPage.pageProfileImage}
                          alt={businessPage.businessName}
                          className="w-[50px] h-[50px] rounded-lg object-cover mb-4"
                        />
                        <h3 className="text-lg font-bold">
                          {businessPage.title}
                        </h3>
                        <p className="text-gray-600 text-sm text-center">
                          {businessPage.description}
                        </p>
                        <div className="mt-2 text-gray-800">
                          <p>
                            <strong>businessName: </strong>
                            {businessPage.businessName}
                          </p>
                          <p>
                            <strong>service: </strong>
                            {businessPage.service}
                          </p>
                          <p>
                            <strong>businessUsername: </strong>
                            {businessPage.businessUsername}
                          </p>
                          <p>
                            <strong>websiteUrl: </strong>
                            {businessPage.websiteUrl}
                          </p>
                          <p>
                            <strong>bio: </strong>
                            {businessPage.bio}
                          </p>
                          <p>
                            <strong>email: </strong>
                            {businessPage.email}
                          </p>
                          <p>
                            <strong>mobile: </strong>
                            {businessPage.mobile}
                          </p>
                        </div>
                      </div>
                    </Link>

                  ))}
                </div>
              </div>
            ) : (
              <p>No business pages available.</p>
            )}
          </div>
        </div>

        {message && <div className="text-green-500">{message}</div>}
        <hr className="w-full border-t border-gray-400 my-6" />

        {/* Posts Section */}
        <h2 className="text-2xl font-bold items-center mb-6">Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentPosts.map((post) => (
            <div key={post._id} className="relative group">
              <CardContent className="bg-white p-4 shadow-md rounded-lg">
                {/* @ts-ignore */}
                {post.media && post.media.length > 0 && (
                  <Carousel className="w-full max-w-xs">
                    <CarouselContent>
                      {/* @ts-ignore */}
                      {post.media.map((media) => (
                        <CarouselItem key={media.path}>
                          <div className="p-1">
                            {media.type === "video/mp4" ? (
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
      {showModal && activePost && (
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
                {posts
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
      )}
    </>
  );
};

export default UserPost;
