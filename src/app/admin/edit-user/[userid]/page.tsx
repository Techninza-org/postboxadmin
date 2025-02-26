"use client";

import { CardContent } from "@/components/DashBoadCard";
import FollowerCard from "@/components/DisplayUserList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { getCookie } from "cookies-next";
import { format, parseISO } from "date-fns";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const EditUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>({}); // Initialize as an empty object
  const [formData, setFormData] = useState<any>({}); // Initialize as an empty object
  const [isSubmitting, setIsSubmitting] = useState(false); // Loader state
  const token = getCookie("authtoken");
  const { userid } = useParams();
  const { toast } = useToast()
  const today = new Date().toISOString().split("T")[0];
  const [showModal, setShowModal] = useState<number>(0);


  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://postbox.biz/api/admin/allPosts/${userid}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data.user); // Set data from API response
        setFormData(response.data.user); // Set data from API response
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userid, token]);

  // Convert DOB to yyyy-MM-dd format if it's available
  const getFormattedDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr); // Parse ISO string to Date object
      return format(date, "yyyy-MM-dd"); // Format to yyyy-MM-dd
    } catch (error) {
      console.error("Invalid date format:", dateStr);
      return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevUser: any) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const formattedDob = formData.dob ? getFormattedDate(formData.dob) : "";

  const UpdateUser = async () => {

    const currYear = new Date().getFullYear()
    const formYear = new Date(formData.dob).getFullYear()
    // Error Validation
    if ((currYear - formYear) <= 18) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Age must be greater than 18",
      })
      return;
    }


    setIsSubmitting(true); // Show loader
    setError(null); // Reset error state
    try {
      const updateInfo: any = {
        name: formData.name,
        dob: formData.dob,
        bio: formData.bio,
      }

      if (user.username !== formData.username) {
        updateInfo.username = formData.username
      }
      if (user.email !== formData.email) {
        updateInfo.email = formData.email
      }

      await axios.patch(
        `https://postbox.biz/api/admin/updateProfile/${userid}`,
        updateInfo,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      setError("Failed to update user");
    } finally {
      setIsSubmitting(false); // Hide loader
    }
  };

  const closeModal = () =>{
    setShowModal(0)
  }

  return (
    <div className="grid place-content-center w-[85vw] h-screen p-2">
      <CardContent className="w-full max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={formData.profileImage}
            alt="Profile"
            className="w-[100px] h-[100px] object-cover rounded-full"
          />
          <div>
            <h1 className="font-bold text-2xl">{formData.name}</h1>
            <p className="text-gray-600">@{formData.username}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6 text-center">
          <div className="hover:bg-gray-50 ">
            <Link href={`/admin/user-post/${userid}`}>
              <p className="font-semibold">{formData.posts?.length}</p>
              <p className="text-sm text-gray-600">Posts</p>
            </Link>
          </div>
          <div onClick={() => setShowModal(2)}>
            <p className="font-semibold">{formData.followers?.length}</p>
            <p className="text-sm text-gray-600">Followers</p>
          </div>
          <div onClick={() => setShowModal(3)}>
            <p className="font-semibold">{formData.following?.length}</p>
            <p className="text-sm text-gray-600">Following</p>
          </div>
          <div className="hover:bg-gray-50 ">
            <Link href={`/admin/user-post/${userid}`}>
              <p className="font-semibold">{formData.businessPages?.length}</p>
              <p className="text-sm text-gray-600">Business Pages</p>
            </Link>
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Bio</Label>
            <Input
              id="Bio"
              type="text"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              name="dob"
              value={formattedDob}
              onChange={handleChange}
              max={today}
            />
          </div>
        </div>

        <Button className="mt-6 w-full" onClick={UpdateUser} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>


      {
        showModal === 2 && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ease-in-out"
            onClick={closeModal} // Close modal when clicking the overlay
          >
            <div
              className="bg-white p-8 rounded-lg w-full max-w-2xl transition-transform transform duration-300 ease-in-out"
              onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
            >
              {user.followers.map((item: any) => (
                <FollowerCard
                  label={"Follower"}
                  profileImage={item.profileImage}
                  key={item._id}
                  _id={item._id}
                  name={item.name}
                  username={item.username}
                  bio={item.bio}
                />
              ))}
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

      {
        showModal === 3 && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ease-in-out"
            onClick={closeModal} // Close modal when clicking the overlay
          >
            <div
              className="bg-white p-8 max-h-72 overflow-y-scroll rounded-lg w-full max-w-2xl transition-transform transform duration-300 ease-in-out"
              onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
            >
              {user.following.map((item: any) => (
                <FollowerCard
                  label={"Following"}
                  profileImage={item.profileImage}
                  key={item._id}
                  _id={item._id}
                  name={item.name}
                  username={item.username}
                  bio={item.bio}
                />
              ))}
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
    </div>
  );
};

export default EditUser;