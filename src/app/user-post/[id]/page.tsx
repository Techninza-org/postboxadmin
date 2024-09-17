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

interface Profile {
  name: string;
  email: string;
  profileImage: string;
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
          `http://103.119.171.226:4000/admin/allPosts/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPosts(response.data.posts);
        setProfile(response.data.user);
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
      await axios.delete(
        `http://103.119.171.226:4000/admin/deletePost/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
        `http://103.119.171.226:4000/admin/deActivateComment/${commentId}`,
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
        <div className="flex flex-col items-center mb-8">
          <img
            src={`http://103.119.171.226:4000/${profile.profileImage}`}
            alt="Profile"
            className="w-[100px] h-[100px] object-cover rounded-full"
          />
          <h2 className="text-xl font-bold mt-4">{profile.name}</h2>
          <p className="mt-2">{profile.email}</p>
        </div>
        {message && <div className="text-green-500">{message}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentPosts.map((post) => (
            <div key={post._id} className="relative group">
              <CardContent className="bg-white p-4 shadow-md rounded-lg">
                {post.image.length > 0 && (
                  <Carousel className="w-full max-w-xs">
                    <CarouselContent>
                      {post.image.map((image: string) => (
                        <CarouselItem key={image}>
                          <div className="p-1">
                            <img
                              src={`http://103.119.171.226:4000/${image}`}
                              alt="post image"
                              className="w-full h-[200px] object-cover rounded"
                            />
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
                    <MessageSquareMore className="inline-block mr-2" />
                    ({post.comments.length})
                  </button>
                  <button
                    className={`${
                      post.isDeleted
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
              currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"
            }`}
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            <ChevronRight />
          </button>
        </div>

        {/* Comments Modal */}
        {showModal && (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-900 bg-opacity-75 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
              <h3 className="text-xl font-bold mb-4">Comments</h3>
              <button
                className="absolute top-10 right-10 bg-white rounded-full text-gray-500 hover:text-gray-800"
                onClick={closeModal}
                aria-label="Close"
              >
                <X />
              </button>
              {activePost &&
                posts
                  .find((post) => post._id === activePost)
                  ?.comments.map((comment) => (
                    <div
                      key={comment._id}
                      className={`border p-4 rounded mb-4 ${
                        comment.isDeActivated ? "bg-gray-200" : "bg-white"
                      }`}
                    >
                      <p>{comment.comment}</p>
                      <button
                        className={`mt-2 ${
                          comment.isDeActivated
                            ? "bg-green-500"
                            : "bg-red-500"
                        } text-white px-2 py-1 rounded`}
                        onClick={() =>
                          toggleCommentStatus(comment._id, comment.isDeActivated)
                        }
                      >
                        {comment.isDeActivated ? (
                          <ShieldCheck />
                        ) : (
                          <ShieldOff />
                        )}
                      </button>
                    </div>
                  ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserPost;
