'use client'

import React, { useState, useEffect } from 'react'
import { redirect} from 'next/navigation'
import '../../snow.css'
import { useSession } from 'next-auth/react'
import {setReplyCommand} from '../../../lib/action/posts'
import {differenceInDays,differenceInMinutes, differenceInMilliseconds} from 'date-fns'
import {getcookie} from '@/components/SetCooke'
import Link from 'next/link'

const Timeposted = (dateTime)=>{
  const date = differenceInDays(Date.now(),dateTime)
  if(date<1)
  {
    const minutes = (differenceInMinutes(Date.now(),dateTime))
    if(Number(minutes)<60){
      const second = (differenceInMilliseconds(Date.now(),dateTime)/1000)
        if(second<60){
          return (differenceInMilliseconds(Date.now(),dateTime)/1000).toFixed(0)+'s'
        }
        else{
          return (differenceInMilliseconds(Date.now(),dateTime)/60000).toFixed(0)+'m'
        }
    }else{
      return (differenceInMinutes(Date.now(),dateTime)/60).toFixed(0)+'h'
    }
  }
  else if(date>=1&&date<=7){
    return (differenceInDays(Date.now(),dateTime))+'d'
  }else{
    return (differenceInDays(Date.now(),dateTime)/7).toFixed(0)+'w'
  }
}

const SingleVlogPage = ({params}) => {
    const [post,setPost] = useState()
    const [redirects,setRedirects] = useState(false)
    const [translatedPost,setTranslatedPost] = useState('')
    const [showtrans,setShowtrans] = useState(false)
    const [translate,setTranslate] = useState(false)
    const [translateLanguage,setTranslateLanguage] = useState()
    const postid = params.id;
    
    useEffect(()=>{
        const url = process.env.NEXT_PUBLIC_URL+'/api/posts?id='+postid
        let textData = ''
        fetch(url)
        .then(response => response.json())
        .then(data=>{
          if(data.publish){
          setPost(data)
          const div = document.createElement('div');
          div.innerHTML = data.content;
          textData = data.content
          fetch("http://localhost:3000/api/trans/detect", {
            method: "POST",
            body: JSON.stringify({
              "text": div.textContent,
              "target": "en"
            }),
            headers: { "Content-Type": "application/json" }
          })
          .then(res=>res.json())
          .then(async(data)=>{
            const lang = await getcookie()
            setTranslateLanguage(lang)
            if(data['detect']!==lang)
            {
              setTranslate(true)
              
            }
            console.log(data['detect'],lang)
          })
        }
          else 
          setRedirects(true)
        })
    },[])

    const handletranslate = async()=>{
      if(!translatedPost){
      const res = await fetch("http://localhost:3000/api/trans", {
                method: "POST",
                body: JSON.stringify({ html:post.content, targetLanguage:translateLanguage }),
                headers: { "Content-Type": "application/json" }
              });
      const rslt = await res.json()
      setTranslatedPost(rslt.translatedHtml)
      }
      setShowtrans(showtrans?false:true)
    }

    if(redirects)
      redirect('/')
  return (<>
    {post && <div className="p-8" key='33'>
            <div className="">
              <h1 className="text-xl font-medium">{post.title} </h1>
              {/* <p className="m-2">{post.content}</p> */}
              <div className="ql-editor" dangerouslySetInnerHTML={{ __html:showtrans && translate?translatedPost:post.content}} />
            </div>
            <div className={`${translate?'block':'hidden'} space-x-3 text-sm font-semibold my-6`}>
              <button onClick={handletranslate} className={`bg-gray-200 p-2 rounded-xl ${showtrans?"text-gray-500 bg-gray-50":null}`}>
                {showtrans?"show Original":"show Translation"}</button>
              <button><Link href={'/posts/langsetting'}>Translation setting</Link></button>
            </div>
            <FeedBacks postId={postid}/>
          </div>
  }
  
  </>
  )
}

export default SingleVlogPage


const FeedBacks = ({postId})=>{
  const [like,setLike] = useState(false)
  const [ unlike,setUnlike] = useState(false)
  const [commandText,setCommandText] = useState('')
  const [data,setData] = useState()
  const [effectload,setEffectload] = useState(false)
  const [errormessage,setErrorMessage] = useState('')
  const [userEmail,setEmail] = useState();
  const {data:session} = useSession()
  const [loading,setLoading] = useState(true)
  

  useEffect(()=>{
    if(session && session.user){
      setEmail(session.user.email)
    const data = {
      'postId':postId,
      'userEmail':session.user.email,
    }
    fetch(process.env.NEXT_PUBLIC_URL+'/api/userfeedback',{
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res => res.json())
    .then(data =>{
      const liked = data.data[0]?.liked
      if(liked!=='null' && liked){
        if(liked==='true')
          setLike(true)
        else
          setUnlike(true)
      }
    })
  }
  },[])

  const feedbackAction = async(e) =>{
    e.preventDefault()
    setEffectload(effectload?false:true)
    if(userEmail){
    const data = {
      'like':like,
      'unlike':unlike,
      'command':commandText,
      'postId':postId,
      'userEmail':userEmail,
    }
    const  result = await fetch(process.env.NEXT_PUBLIC_URL+'/api/feedback',{
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if(result.status===200)
      setCommandText('')
      setEffectload(effectload?true:false)
    }
    else{
      setErrorMessage("You should login to say your feedback !")
      setLike(false)
      setUnlike(false)
      setEffectload(false)
    }
  }
  const replyFun = async()=>{
    setEffectload(effectload?false:true)
    await new Promise((resolve)=>setTimeout(resolve,1000));
    // console.log("replyFun")
    setEffectload(effectload?true:false)
  }
  useEffect(()=>{
    fetch(process.env.NEXT_PUBLIC_URL+'/api/feedback?id='+postId)
    .then(res => res.json())
    .then(data =>{
     setData(data?.data[0])
     setLoading(false)
    })
   },[effectload])

  return (
    <>
    
    {loading && <LoadingUi />}
    <div className={effectload?'cursor-progress':`${loading?'blur-sm':''}`}>
    <form onSubmit={feedbackAction} className='mb-20'>
      <div className='flex space-x-8'>
        <button disabled={effectload} className='flex'  onClick={()=>{
          setLike(like?false:true)
          setUnlike(false)
          }}>
          <svg className={!like?'block':'hidden'} width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.8638 0.0460592C7.90812 -0.192861 7.02087 0.530102 6.95631 1.46585C6.88374 2.51744 6.72691 3.48161 6.52757 4.05676C6.4031 4.4159 6.04895 5.06871 5.48879 5.69469C4.93091 6.31812 4.20585 6.87339 3.35693 7.10496C2.68549 7.28812 2 7.86992 2 8.72015V12.7212C2 13.5656 2.68233 14.185 3.44792 14.2662C4.51741 14.3796 5.0118 14.6814 5.51594 14.9891L5.56354 15.0182C5.83632 15.1844 6.14176 15.3675 6.53434 15.5026C6.93094 15.6392 7.39536 15.7205 8 15.7205H11.5C12.4371 15.7205 13.099 15.2426 13.4341 14.6561C13.5982 14.369 13.6875 14.0499 13.6875 13.7439C13.6875 13.5916 13.6647 13.4318 13.6107 13.2795C13.8121 13.0172 13.9915 12.7021 14.0993 12.3786C14.2091 12.0494 14.2709 11.6171 14.1026 11.2304C14.1718 11.0997 14.2235 10.9614 14.262 10.8266C14.3392 10.5564 14.375 10.2594 14.375 9.9705C14.375 9.68161 14.3392 9.38454 14.262 9.11439C14.2275 8.99364 14.1824 8.87012 14.1237 8.75177C14.5183 8.18035 14.5421 7.55086 14.3576 7.01847C14.1524 6.42641 13.6764 5.91891 13.1581 5.74615C12.311 5.46378 11.3547 5.47028 10.6422 5.53505C10.484 5.54943 10.3353 5.56695 10.1994 5.58555C10.6699 3.58771 10.357 1.89202 10.1366 1.07601C9.99923 0.567518 9.58765 0.227022 9.12522 0.111414L8.8638 0.0460592ZM11.5 14.7205H8C7.48931 14.7205 7.13694 14.6525 6.85992 14.5571C6.57887 14.4603 6.35385 14.3287 6.08393 14.1642L6.04402 14.1399C5.48916 13.8014 4.8456 13.4088 3.55337 13.2717C3.22055 13.2365 3 12.9813 3 12.7211V8.72014C3 8.4658 3.2259 8.17723 3.6201 8.0697C4.71546 7.7709 5.59685 7.07352 6.23399 6.36152C6.86886 5.65205 7.29831 4.88662 7.47243 4.38422C7.71504 3.68422 7.8793 2.61627 7.95393 1.53467C7.97893 1.17237 8.31466 0.939535 8.62127 1.01619L8.88269 1.08154C9.04329 1.12169 9.14107 1.22529 9.17119 1.33678C9.39155 2.15255 9.71926 3.98157 9.02566 6.06237C8.96795 6.23549 9.00915 6.42631 9.13314 6.56021C9.25709 6.69406 9.44428 6.74973 9.62127 6.70555L9.62386 6.70492L9.63757 6.70165C9.65031 6.69864 9.67014 6.69406 9.69646 6.68826C9.74911 6.67666 9.82756 6.66022 9.92698 6.64181C10.1262 6.60491 10.4075 6.5605 10.7328 6.53093C11.3953 6.4707 12.189 6.4772 12.8419 6.69482C13.0174 6.75332 13.2914 6.99582 13.4127 7.34594C13.5193 7.65331 13.4986 8.0148 13.1464 8.36693L12.7929 8.72048L13.1464 9.07404C13.189 9.11658 13.2507 9.215 13.3005 9.38909C13.3483 9.55643 13.375 9.75937 13.375 9.97048C13.375 10.1816 13.3483 10.3845 13.3005 10.5519C13.2507 10.726 13.189 10.8244 13.1464 10.8669L12.7929 11.2205L13.1464 11.574C13.1935 11.6211 13.2546 11.7505 13.1507 12.0624C13.053 12.3554 12.8481 12.6653 12.6464 12.8669L12.2929 13.2205L12.6464 13.574C12.6517 13.5793 12.6875 13.6237 12.6875 13.7439C12.6875 13.8599 12.6518 14.0095 12.5659 14.1599C12.401 14.4484 12.0629 14.7205 11.5 14.7205Z" fill="black"/>
          </svg>
          <svg className={like?'block':'hidden'} width="24" height="24" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <svg width="18" height="18" viewBox="1 0.5 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.8638 0.0460592C7.90812 -0.192861 7.02087 0.530102 6.95631 1.46585C6.88374 2.51744 6.72691 3.48161 6.52757 4.05676C6.4031 4.4159 6.04895 5.06871 5.48879 5.69469C4.93091 6.31812 4.20585 6.87339 3.35693 7.10496C2.68549 7.28812 2 7.86992 2 8.72015V12.7212C2 13.5656 2.68233 14.185 3.44792 14.2662C4.51741 14.3796 5.0118 14.6814 5.51594 14.9891L5.56354 15.0182C5.83632 15.1844 6.14176 15.3675 6.53434 15.5026C6.93094 15.6392 7.39536 15.7205 8 15.7205H11.5C12.4371 15.7205 13.099 15.2426 13.4341 14.6561C13.5982 14.369 13.6875 14.0499 13.6875 13.7439C13.6875 13.5916 13.6647 13.4318 13.6107 13.2795C13.8121 13.0172 13.9915 12.7021 14.0993 12.3786C14.2091 12.0494 14.2709 11.6171 14.1026 11.2304C14.1718 11.0997 14.2235 10.9614 14.262 10.8266C14.3392 10.5564 14.375 10.2594 14.375 9.9705C14.375 9.68161 14.3392 9.38454 14.262 9.11439C14.2275 8.99364 14.1824 8.87012 14.1237 8.75177C14.5183 8.18035 14.5421 7.55086 14.3576 7.01847C14.1524 6.42641 13.6764 5.91891 13.1581 5.74615C12.311 5.46378 11.3547 5.47028 10.6422 5.53505C10.484 5.54943 10.3353 5.56695 10.1994 5.58555C10.6699 3.58771 10.357 1.89202 10.1366 1.07601C9.99923 0.567518 9.58765 0.227022 9.12522 0.111414L8.8638 0.0460592ZM11.5 14.7205H8C7.48931 14.7205 7.13694 14.6525 6.85992 14.5571C6.57887 14.4603 6.35385 14.3287 6.08393 14.1642L6.04402 14.1399C5.48916 13.8014 4.8456 13.4088 3.55337 13.2717C3.22055 13.2365 3 12.9813 3 12.7211V8.72014C3 8.4658 3.2259 8.17723 3.6201 8.0697C4.71546 7.7709 5.59685 7.07352 6.23399 6.36152C6.86886 5.65205 7.29831 4.88662 7.47243 4.38422C7.71504 3.68422 7.8793 2.61627 7.95393 1.53467C7.97893 1.17237 8.31466 0.939535 8.62127 1.01619L8.88269 1.08154C9.04329 1.12169 9.14107 1.22529 9.17119 1.33678C9.39155 2.15255 9.71926 3.98157 9.02566 6.06237C8.96795 6.23549 9.00915 6.42631 9.13314 6.56021C9.25709 6.69406 9.44428 6.74973 9.62127 6.70555L9.62386 6.70492L9.63757 6.70165C9.65031 6.69864 9.67014 6.69406 9.69646 6.68826C9.74911 6.67666 9.82756 6.66022 9.92698 6.64181C10.1262 6.60491 10.4075 6.5605 10.7328 6.53093C11.3953 6.4707 12.189 6.4772 12.8419 6.69482C13.0174 6.75332 13.2914 6.99582 13.4127 7.34594C13.5193 7.65331 13.4986 8.0148 13.1464 8.36693L12.7929 8.72048L13.1464 9.07404C13.189 9.11658 13.2507 9.215 13.3005 9.38909C13.3483 9.55643 13.375 9.75937 13.375 9.97048C13.375 10.1816 13.3483 10.3845 13.3005 10.5519C13.2507 10.726 13.189 10.8244 13.1464 10.8669L12.7929 11.2205L13.1464 11.574C13.1935 11.6211 13.2546 11.7505 13.1507 12.0624C13.053 12.3554 12.8481 12.6653 12.6464 12.8669L12.2929 13.2205L12.6464 13.574C12.6517 13.5793 12.6875 13.6237 12.6875 13.7439C12.6875 13.8599 12.6518 14.0095 12.5659 14.1599C12.401 14.4484 12.0629 14.7205 11.5 14.7205Z" fill="black"/>
          </svg>
            <path d="M6.95631 1.74533C7.02087 0.809582 7.90812 0.0866185 8.8638 0.325539L9.12522 0.390894C9.58765 0.506502 9.99923 0.846997 10.1366 1.35549C10.357 2.1715 10.6699 3.86719 10.1994 5.86503C10.3353 5.84643 10.484 5.82891 10.6422 5.81453C11.3547 5.74976 12.311 5.74326 13.1581 6.02563C13.6764 6.19839 14.1524 6.70589 14.3576 7.29795C14.5421 7.83034 14.5183 8.45983 14.1237 9.03125C14.1824 9.1496 14.2275 9.27312 14.262 9.39387C14.3392 9.66402 14.375 9.96109 14.375 10.25C14.375 10.5389 14.3392 10.8359 14.262 11.1061C14.2235 11.2409 14.1718 11.3792 14.1026 11.5098C14.2709 11.8966 14.2091 12.3289 14.0993 12.6581C13.9915 12.9816 13.8121 13.2966 13.6107 13.5589C13.6647 13.7113 13.6875 13.8711 13.6875 14.0234C13.6875 14.3293 13.5982 14.6485 13.4341 14.9355C13.099 15.5221 12.4371 16 11.5 16H8C7.39536 16 6.93094 15.9187 6.53434 15.7821C6.14176 15.6469 5.83632 15.4639 5.56354 15.2977L5.51594 15.2686C5.0118 14.9609 4.51741 14.6591 3.44792 14.5457C2.68233 14.4645 2 13.8451 2 13.0006V8.99963C2 8.1494 2.68549 7.5676 3.35693 7.38444C4.20585 7.15287 4.93091 6.5976 5.48879 5.97417C6.04895 5.34819 6.4031 4.69538 6.52757 4.33624C6.72691 3.76109 6.88374 2.79692 6.95631 1.74533Z" fill="#4C7EE1"/>
          </svg>
          <span className='pl-2'>{data?.like}</span>
        </button>
        <button disabled={effectload} className='mt-1 flex'
        onClick={()=>{ 
          setUnlike(unlike?false:true)
          setLike(false)
          }}>
          <svg className={!unlike?'block':'hidden'} width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.8638 15.6744C7.90812 15.9134 7.02087 15.1904 6.95631 14.2546C6.88374 13.2031 6.72691 12.2389 6.52757 11.6637C6.4031 11.3046 6.04895 10.6518 5.48879 10.0258C4.93091 9.40237 4.20585 8.8471 3.35693 8.61553C2.68549 8.43238 2 7.85057 2 7.00034V2.99934C2 2.15492 2.68233 1.5355 3.44792 1.45431C4.51741 1.3409 5.0118 1.0391 5.51594 0.731348L5.56354 0.702307C5.83632 0.536077 6.14176 0.35304 6.53434 0.21786C6.93094 0.0812931 7.39536 0 8 0H11.5C12.4371 0 13.099 0.477883 13.4341 1.06443C13.5982 1.35149 13.6875 1.67064 13.6875 1.97656C13.6875 2.12892 13.6647 2.28868 13.6107 2.44104C13.8121 2.70333 13.9915 3.0184 14.0993 3.34189C14.2091 3.6711 14.2709 4.10338 14.1026 4.49014C14.1718 4.62082 14.2235 4.75908 14.262 4.89389C14.3392 5.16405 14.375 5.46111 14.375 5.75C14.375 6.03889 14.3392 6.33595 14.262 6.60611C14.2275 6.72686 14.1824 6.85037 14.1237 6.96873C14.5183 7.54015 14.5421 8.16964 14.3576 8.70202C14.1524 9.29408 13.6764 9.80159 13.1581 9.97434C12.311 10.2567 11.3547 10.2502 10.6422 10.1854C10.484 10.1711 10.3353 10.1535 10.1994 10.135C10.6699 12.1328 10.357 13.8285 10.1366 14.6445C9.99923 15.153 9.58765 15.4935 9.12522 15.6091L8.8638 15.6744ZM11.5 1.00001H8C7.48931 1.00001 7.13694 1.068 6.85992 1.16339C6.57887 1.26017 6.35385 1.39176 6.08393 1.55625L6.04402 1.58059C5.48916 1.9191 4.8456 2.31172 3.55337 2.44875C3.22055 2.48404 3 2.73922 3 2.99936V7.00036C3 7.2547 3.2259 7.54327 3.6201 7.6508C4.71546 7.94959 5.59685 8.64697 6.23399 9.35898C6.86886 10.0684 7.29831 10.8339 7.47243 11.3363C7.71504 12.0363 7.8793 13.1042 7.95393 14.1858C7.97893 14.5481 8.31466 14.781 8.62127 14.7043L8.88269 14.639C9.04329 14.5988 9.14107 14.4952 9.17119 14.3837C9.39155 13.5679 9.71926 11.7389 9.02566 9.65813C8.96795 9.485 9.00915 9.29419 9.13314 9.16029C9.25709 9.02643 9.44428 8.97076 9.62127 9.01494L9.62386 9.01558L9.63757 9.01885C9.65031 9.02185 9.67014 9.02644 9.69646 9.03223C9.74911 9.04384 9.82756 9.06027 9.92698 9.07869C10.1262 9.11558 10.4075 9.16 10.7328 9.18957C11.3953 9.2498 12.189 9.24329 12.8419 9.02567C13.0174 8.96718 13.2914 8.72468 13.4127 8.37455C13.5193 8.06719 13.4986 7.7057 13.1464 7.35357L12.7929 7.00001L13.1464 6.64646C13.189 6.60391 13.2507 6.5055 13.3005 6.3314C13.3483 6.16406 13.375 5.96113 13.375 5.75001C13.375 5.5389 13.3483 5.33597 13.3005 5.16862C13.2507 4.99453 13.189 4.89612 13.1464 4.85357L12.7929 4.50001L13.1464 4.14646C13.1935 4.09943 13.2546 3.97003 13.1507 3.65813C13.053 3.36508 12.8481 3.05523 12.6464 2.85357L12.2929 2.50001L12.6464 2.14646C12.6517 2.14122 12.6875 2.09685 12.6875 1.97658C12.6875 1.86063 12.6518 1.71102 12.5659 1.56058C12.401 1.27213 12.0629 1.00001 11.5 1.00001Z" fill="black"/>
          </svg>
          <svg className={unlike?'block':'hidden'} width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.95631 14.5342C7.02087 15.4699 7.90812 16.1929 8.8638 15.954L9.12522 15.8886C9.58765 15.773 9.99923 15.4325 10.1366 14.924C10.357 14.108 10.6699 12.4123 10.1994 10.4145C10.3353 10.4331 10.484 10.4506 10.6422 10.465C11.3547 10.5298 12.311 10.5363 13.1581 10.2539C13.6764 10.0811 14.1524 9.57362 14.3576 8.98157C14.5421 8.44918 14.5183 7.81969 14.1237 7.24827C14.1824 7.12991 14.2275 7.0064 14.262 6.88565C14.3392 6.61549 14.375 6.31843 14.375 6.02954C14.375 5.74065 14.3392 5.44359 14.262 5.17343C14.2235 5.03862 14.1718 4.90036 14.1026 4.76968C14.2709 4.38292 14.2091 3.95064 14.0993 3.62143C13.9915 3.29794 13.8121 2.98287 13.6107 2.72058C13.6647 2.56822 13.6875 2.40846 13.6875 2.2561C13.6875 1.95018 13.5982 1.63103 13.4341 1.34397C13.099 0.757424 12.4371 0.279541 11.5 0.279541H8C7.39536 0.279541 6.93094 0.360834 6.53434 0.497401C6.14176 0.632581 5.83632 0.815619 5.56354 0.981848L5.51594 1.01089C5.0118 1.31864 4.51741 1.62044 3.44792 1.73385C2.68233 1.81504 2 2.43446 2 3.27889V7.27988C2 8.13011 2.68549 8.71192 3.35693 8.89507C4.20585 9.12664 4.93091 9.68192 5.48879 10.3053C6.04895 10.9313 6.4031 11.5841 6.52757 11.9433C6.72691 12.5184 6.88374 13.4826 6.95631 14.5342Z" fill="#4C7EE1"/>
          </svg>
          <span className='pl-2 -mt-1'>{data?.unlike}</span>
        </button>
        {/* share icon */}
          <ShareBtn LikeId={postId}/>
      </div>
      <div className='mt-4'>
        <label htmlFor='command' className='flex'>
          <input type='text' id='command' name='command' placeholder='command' value={commandText} onChange={(e)=>
            setCommandText(e.target.value)
          } className='outline-none bg-gray-50 p-2 rounded-3xl' />
            <button disabled={effectload} className={`${commandText?'block ml-2':'hidden'} `}>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C9.00262 2.5 9.94117 2.76782 10.7496 3.2355C10.9887 3.37377 11.2945 3.29209 11.4328 3.05306C11.5711 2.81403 11.4894 2.50816 11.2504 2.36989C10.2938 1.81654 9.1831 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 7.72386 14.2761 7.5 14 7.5C13.7239 7.5 13.5 7.72386 13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8Z" fill="black"/>
                <path d="M15.3536 3.35355C15.5488 3.15829 15.5488 2.84171 15.3536 2.64645C15.1583 2.45118 14.8417 2.45118 14.6464 2.64645L8 9.29289L5.35355 6.64645C5.15829 6.45118 4.84171 6.45118 4.64645 6.64645C4.45118 6.84171 4.45118 7.15829 4.64645 7.35355L7.64645 10.3536C7.84171 10.5488 8.15829 10.5488 8.35355 10.3536L15.3536 3.35355Z" fill="black"/>
              </svg>
            </button>
        </label> 
        </div>
        {errormessage && <span className='text-blue-400 text-sm m-2'>{errormessage}</span>}
      </form>
      {data?.commands[0]?<div className='w-80 sm:w-1/2 shadow-md -mt-16 rounded-3xl p-4'>
          {data?.commands?.map((command,index)=>(
            <>
              <div className='p-2 sm:pl-7' htmlFor={index}>
                <div className='flex'>
                  <h3 className='text-xs text-gray-400 underline'>{command.user.email}</h3>
                  <span className='text-xs ml-2'>{Timeposted(String(command.created_date))}</span>
                </div>
                <div className='text-sm text-gray-600 bg-gray-50 rounded-lg w-72 sm:w-11/12 p-2 divide-x-2'>
                  <h6 className='mb-2'>{command.text}</h6>
                  {command.replys && <ReplyMessage replys={command.replys} />
                  }
                </div>
                <ReplyComponent commandId={command.id} userEmail={userEmail} fun={replyFun} />
              </div>
            </>
          )) }
      </div>:null}
    </div>
    </>
  )
}


const ReplyComponent = ({commandId,userEmail,fun})=>{
  const [replyForm,setReplyForm] = useState(false);
  const [commandText,setCommandText] = useState('');
  const [errorMessage,setErrorMessage] = useState();
  return (
    <>
      <div className='relative w-72 sm:w-11/12'>
        <button className='text-sky-400 text-xs absolute right-0' onClick={()=>{
          if(userEmail)
          {
          setReplyForm(replyForm?false:true)
          setErrorMessage('')
          }
          else
          setErrorMessage('You should login')
          }} >reply</button>
      </div>
      {errorMessage && <span className='text-xs text-red-500'>{errorMessage}</span>}

      <form className={replyForm?'block':'hidden'} action={setReplyCommand} onSubmit={()=>{setCommandText('')
        fun()
      }}>
        <input type='hidden' name='commandId' value={commandId}/>
        <input type='hidden' name='emailId' value={userEmail}/>
        <div>
          <label htmlFor='command' className='flex text-sm pl-4'>
            <input type='text' id='replyCommand' name='replyCommand' placeholder='Reply command' value={commandText} onChange={(e)=>
              setCommandText(e.target.value)
            } className='outline-none bg-white rounded-xl mt-2 p-1 border-dotted border-2' />
              <button  onClick={()=>{
                setReplyForm(replyForm?false:true)
                }} className={`${commandText?'block m-2 pt-2':'hidden'} `}>
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C9.00262 2.5 9.94117 2.76782 10.7496 3.2355C10.9887 3.37377 11.2945 3.29209 11.4328 3.05306C11.5711 2.81403 11.4894 2.50816 11.2504 2.36989C10.2938 1.81654 9.1831 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 7.72386 14.2761 7.5 14 7.5C13.7239 7.5 13.5 7.72386 13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8Z" fill="black"/>
                    <path d="M15.3536 3.35355C15.5488 3.15829 15.5488 2.84171 15.3536 2.64645C15.1583 2.45118 14.8417 2.45118 14.6464 2.64645L8 9.29289L5.35355 6.64645C5.15829 6.45118 4.84171 6.45118 4.64645 6.64645C4.45118 6.84171 4.45118 7.15829 4.64645 7.35355L7.64645 10.3536C7.84171 10.5488 8.15829 10.5488 8.35355 10.3536L15.3536 3.35355Z" fill="black"/>
                  </svg>
                </button>
          </label>
        </div>
      </form>
    </>
  )
}

// Display reply message
const ReplyMessage = ({replys})=>{
  const [load,setLoad] = useState(false)
  return (
    <>
        
        <div className={`${load?'block':'hidden'} w-72 sm:w-11/12`}>
          {replys?.map((reply,index)=>(
            <div key={index}>
              <div className='flex ml-1'>
                  <h3 className='text-xs text-gray-400 underline'>{reply.user_emailId}</h3>
                  <span className='text-xs ml-2'>{Timeposted(String(reply.created_date))}</span>
              </div>
              <h1 className='text-gray-500 ml-2 ' htmlFor={index}>{reply.text}</h1>
            </div>
            ))}
        </div>
        <div className=" tooltip-right text-xs" data-tip="replys">
          <div tabIndex={0} role="button" className="m-1" onClick={()=>setLoad(load?false:true)}>...</div>
        </div>
      </>
  )
}

const LoadingUi = ()=>{
  return (
      <div className='grid content-center w-1/2 justify-center z-20'>
          <span className="loading loading-infinity loading-lg"></span>
      </div>
  )
}

const ShareBtn = ({LikeId})=>{
  const [sharebtn,setSharebtn] = useState(false)
  const [isCopyed,setIsCopyed] = useState(false)
  const copyText = process.env.NEXT_PUBLIC_URL+'/vlog/'+LikeId
  return (
    <>
    <div className='cursor-pointer' onClick={()=>{setSharebtn(true);console.log('btn')}}>
      <svg width="28" height="28" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.90225 4.0133C8.80932 3.97168 8.70004 4.03942 8.70004 4.14717V5.30045C8.70004 5.57659 8.47618 5.80045 8.20004 5.80045C7.53296 5.80045 6.18707 5.80564 4.89913 6.62266C3.91607 7.24628 2.90929 8.38231 2.30522 10.4987C3.32568 9.51511 4.49045 8.98289 5.51008 8.6999C6.26345 8.49082 6.94097 8.41633 7.43113 8.39393C7.67668 8.38271 7.87658 8.38451 8.01719 8.38931C8.08753 8.39171 8.14316 8.39486 8.18237 8.39753C8.20198 8.39887 8.2175 8.40008 8.22871 8.40102L8.24228 8.40221L8.2466 8.40261L8.24814 8.40276C8.24814 8.40276 8.24925 8.40287 8.20004 8.90044L8.24925 8.40287C8.50509 8.42817 8.70004 8.64336 8.70004 8.90044V10.0537C8.70004 10.1615 8.80932 10.2292 8.90225 10.1876L12.8858 7.2548C12.8995 7.24471 12.9137 7.23532 12.9284 7.22668C13.0239 7.17037 13.0239 7.03052 12.9284 6.97421C12.9137 6.96557 12.8995 6.95618 12.8858 6.94609L8.90225 4.0133ZM7.70004 9.3862C7.63206 9.38714 7.55741 9.38921 7.47677 9.39289C7.04349 9.41268 6.44289 9.47882 5.77751 9.66348C4.45096 10.0316 2.88061 10.865 1.83712 12.7433C1.72083 12.9526 1.47243 13.0501 1.24479 12.9757C1.01716 12.9014 0.874203 12.6761 0.903906 12.4384C1.36771 8.72801 2.78974 6.77654 4.36346 5.77823C5.6095 4.98779 6.8908 4.83632 7.70004 4.80731V4.14717C7.70004 3.25174 8.66944 2.71431 9.42472 3.1594C9.43938 3.16805 9.4536 3.17743 9.4673 3.18752L13.4608 6.12766C14.1798 6.57481 14.1798 7.62607 13.4608 8.07323L9.4673 11.0134C9.4536 11.0235 9.43938 11.0328 9.42472 11.0415C8.66944 11.4866 7.70004 10.9492 7.70004 10.0537V9.3862Z" fill="black"/>
        <path d="M11.7682 3.29373C11.9319 3.07135 12.2449 3.0238 12.4673 3.18752L16.4608 6.12766C17.1798 6.57481 17.1798 7.62607 16.4608 8.07323L12.4673 11.0134C12.2449 11.1771 11.9319 11.1295 11.7682 10.9072C11.6045 10.6848 11.652 10.3718 11.8744 10.2081L15.8858 7.2548C15.8995 7.24471 15.9137 7.23532 15.9284 7.22668C16.0239 7.17037 16.0239 7.03052 15.9284 6.97421C15.9137 6.96557 15.8995 6.95618 15.8858 6.94609L11.8744 3.99281C11.652 3.8291 11.6045 3.5161 11.7682 3.29373Z" fill="black"/>
      </svg>
    </div>
    {sharebtn && 
    <div className=' absolute left-0 sm:left-1/3 bg-gray-50'>
      <div className='p-12 shadow-xl w-80 sm:w-96 relative rounded-xl'>
        <button className='absolute right-0 text-xl top-0 shadow-lg rounded-xl m-1' onClick={()=>{setSharebtn(false); setIsCopyed(false)}}>X</button>
        <div className='flex space-x-1'>
          <input type='text' disabled={true} className='border border-black p-2 bg-white rounded-lg text-sm text-gray-600 w-full' value={copyText}/>
          <div className='cursor-pointer mt-2' onClick={()=>{
            navigator.clipboard.writeText(copyText)
            setIsCopyed(true)
          }}>
            {isCopyed?
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-clipboard2-check" viewBox="0 0 16 16">
              <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/>
              <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z"/>
              <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/>
            </svg>:
            <svg className='bg-gray-100' xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
            </svg>
            }
          </div>
        </div>
        <div className='mt-4'>
          <a href={`whatsapp://send?text=`+copyText} data-action="share/whatsapp/share">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
}
    </>
  )
}