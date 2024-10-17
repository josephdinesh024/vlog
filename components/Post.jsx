
import Link from 'next/link'
import React from 'react'

const singlePost = ({posts}) => {
  const url = '/posts/editpost/'+posts.id
  return (
    <div className='m-4 w-96 space-y-2 shadow-lg p-6 rounded-xl relative'>
        <Link href={url}><button className='absolute right-0 mr-2'>Edit</button></Link>
        <h2 className='text-xl font-medium'>{posts.title}</h2>
        <p>{posts.content}</p>
    </div>
  )
}

export default singlePost