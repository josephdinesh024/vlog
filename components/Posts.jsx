'use client'

import { useRouter } from 'next/navigation'
import Post from './Post'
import {postDragDropUpdate} from '@/lib/action/posts'
import { useEffect,useState } from 'react'

const Posts = ({userId}) => {
    const [posts,setPosts] = useState()
    const [publish,setPublish] = useState("")
    useEffect(()=>{
        console.log(userId)
        fetch("http://localhost:3000/api/posts",{
            method:"post",
            body:JSON.stringify({userId}),
            headers: { "Content-Type": "application/json" }
        })
        .then(res=>res.json())
        .then(data=>{
            setPosts(data['data'])
        })
    },[publish])
    function init(){
        const lists = document.getElementsByClassName("dragItem");
        const leftBlock = document.getElementById('left')
        const rightBlock = document.getElementById('right')
        console.log(rightBlock)
        let list = null
        for(list of lists){
            list.addEventListener('dragstart',function(e){
                let selected = e.target;
                rightBlock.addEventListener('dragover',function(e){
                    e.preventDefault();
                });
                rightBlock.addEventListener('drop',function(e){
                    console.log(selected.parentElement.getAttribute('id'))
                    if(selected.parentElement.getAttribute('id') != "right"){   // Unpublish
                        postDragDropUpdate(selected.getAttribute('id'),"false")
                        rightBlock.appendChild(selected);
                        setPublish("false")
                    }
                    selected=null
                });
                leftBlock.addEventListener('dragover',function(e){
                    e.preventDefault();
                });
                leftBlock.addEventListener('drop',function(e){
                    if(selected.parentElement.getAttribute('id') != "left"){   // Publish
                        postDragDropUpdate(selected.getAttribute('id'),"true")
                        leftBlock.appendChild(selected);
                        setPublish("true")
                    }
                    selected=null
                });
            })
        }
    }
    const fun = async()=>{
        await new Promise((resolve)=>(setTimeout(resolve,2000)))
        init()
    }
    fun()
  return (
    <>
        <div id='left'>
            <h1 className='text-2xl font-semibold capitalize'>Published post</h1>
            {posts?.map((post,index)=>(
                <>
                {post.publish && <div className="dragItem" draggable="true" id={post.id}><Post key={index} posts={post}/></div> }
                </>
            ))}
        </div>
        <div id='right'>
            <h1 className='text-2xl font-semibold capitalize'>Unpublished post</h1>
            {posts?.map((post,index)=>(
                <>
                {!post.publish && <div className="dragItem" draggable="true" id={post.id}><Post key={index} posts={post}/> </div>}
                </>
            ))}
        </div>
    </>
  )
}

export default Posts