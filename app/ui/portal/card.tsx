'use client'

import { Post } from "@/app/lib/definitions"
import Link from "next/link"

export default function CardPost({postCard}) {
  return (
    <Link
    key={'aaaaa'}
    href={'portal/post/' + postCard.namePost}>
    <div className="bg-white rounded-md shadow-md relative">
    <img
      src={postCard.coverURL}
      alt="News Image"
      className="rounded-t-md w-full object-cover"
    />
    <div className="absolute bottom-0 left-0 p-4 text-white bg-black bg-opacity-75">
      <h2 className="text-xl font-bold">
        {postCard.title}
      </h2>
      <p className="text-sm">
        {postCard.content}     
      </p>
    </div>
    </div> 
    </Link>
    
    )
}



{/* */}