"use client"

import Image from 'next/image'
import { User } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FollowerProps {
  _id: string
  name: string
  username: string
  bio?: string
  profileImage?: string
  label?: string
}

export default function FollowerCard({ name, username, profileImage, label = 'Follower', _id }: FollowerProps) {
  const router = useRouter()

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200" onClick={() => router.push(`/user-post/${_id}`)}>
      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 " >
        {profileImage ? (
          <Image
            src={profileImage}
            alt={`${name}'s profile picture`}
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-300">
            <User className="w-6 h-6 text-gray-500" />
          </div>
        )}
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">@{username}</p>
      </div>
      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
        {label}
      </span>
    </div>
  )
}

