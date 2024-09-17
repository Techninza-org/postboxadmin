"use client"

import { CardContent } from '@/components/DashBoadCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import { format, parseISO } from 'date-fns'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const EditUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>({}); // Initialize as an empty object
    const [isSubmitting, setIsSubmitting] = useState(false); // Loader state
    const token = getCookie("authtoken");
    const { userid } = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://103.119.171.226:4000/admin/allPosts/${userid}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setUser(response.data.user); // Set data from API response
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
            return format(date, 'yyyy-MM-dd'); // Format to yyyy-MM-dd
        } catch (error) {
            console.error('Invalid date format:', dateStr);
            return '';
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prevUser: any) => ({
            ...prevUser,
            [name]: value
        }));
    };

    const formattedDob = user.dob ? getFormattedDate(user.dob) : '';

    const UpdateUser = async () => {
        setIsSubmitting(true); // Show loader
        setError(null); // Reset error state
        try {
            await axios.patch(
                `http://103.119.171.226:4000/admin/updateProfile/${userid}`,
                {
                    username: user.username,
                    name: user.name,
                    dob: user.dob,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert('User updated successfully');
        } catch (err) {
            setError('Failed to update user');
        } finally {
            setIsSubmitting(false); // Hide loader
        }
    }

    return (
        <div className='grid place-content-center w-[85vw] h-screen p-2'>
            <CardContent className='w-100'>
                <h1 className='font-bold text-2xl'>Edit User</h1>
                {loading && <p>Loading...</p>} {/* Show loader while fetching */}
                {error && <p className='text-red-500'>{error}</p>} {/* Show error if any */}
                <div className='grid grid-cols-2 gap-5'>
                <div>
                <Label>Username</Label>
                <Input
                    type="text"
                    name="username"
                    value={user.username || ''}
                    onChange={handleChange}
                                                        
                />
                </div>
                <div>
                <Label>Name</Label>
                <Input
                    type="text"
                    name="name"
                    value={user.name || ''}
                    onChange={handleChange}
                />
                </div>
                <div>
                <Label>Date of Birth</Label>
                <Input
                    type="date"
                    name="dob"
                    value={formattedDob}
                    onChange={handleChange}
                />
                </div>
                </div>
                <Button className="mt-2" onClick={UpdateUser} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
            </CardContent>
        </div>
    )
}

export default EditUser;
