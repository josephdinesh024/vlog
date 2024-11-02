'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import SignOut from './SignOut'

const MobileMenu = ({session}) => {
    const [menu,setMenu] = useState(false)
  return (
    <div className="sm:hidden relative w-1/2 grid justify-end px-6">
      <button onClick={()=>setMenu(menu?false:true)}>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
      </button>
      {menu && <ul className="bg-base-100 rounded-box z-10 p-2 shadow absolute top-3/4 right-0 m-4 w-44">
        <li onClick={()=>setMenu(menu?false:true)} className="hover:border-b-2 border-black pb-4">Vlog</li>
        <li onClick={()=>setMenu(menu?false:true)} className="hover:border-b-2 border-black pb-4">About</li>
        {session?
          <>
          <Link href='/posts/newposts'><li onClick={()=>setMenu(menu?false:true)} className="hover:border-b-2 border-black pb-4">New Vlog</li></Link>
          {/* <div className="dropdown dropdown-bottom dropdown-end">
          <div tabIndex={0} role="button" className="flex space-x-1 hover:border-b-2 border-black pb-4">
            <svg width="16" height="16" className="mt-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8ZM10 5C10 6.10457 9.10457 7 8 7C6.89543 7 6 6.10457 6 5C6 3.89543 6.89543 3 8 3C9.10457 3 10 3.89543 10 5Z" fill="black"/>
              <path d="M14 13C14 14 13 14 13 14H3C3 14 2 14 2 13C2 12 3 9 8 9C13 9 14 12 14 13ZM13 12.9965C12.9986 12.7497 12.8462 12.0104 12.1679 11.3321C11.5156 10.6798 10.2891 10 7.99999 10C5.71088 10 4.48435 10.6798 3.8321 11.3321C3.15375 12.0104 3.00142 12.7497 3 12.9965H13Z" fill="black"/>
            </svg>
            <span>{session?.user?.name}</span>
          </div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 mt-2 shadow">
            <li onClick={()=>setMenu(menu?false:true)}><Link href='/posts'>Account</Link></li>
            <li onClick={()=>setMenu(menu?false:true)}><SignOut /></li>
          </ul>
        </div> */}
        <li onClick={()=>setMenu(menu?false:true)} className="hover:border-b-2 border-black pb-4"><Link href='/posts'>Account</Link></li>
        <li onClick={()=>setMenu(menu?false:true)} className="hover:border-b-2 border-black pb-4"><SignOut /></li>
        </>:
        //   <div className="dropdown dropdown-bottom dropdown-end">
        //   <div tabIndex={0} role="button" className="hover:border-b-2 border-black pb-4">Profile</div>
        //   <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 mt-2 shadow">
        //     <li onClick={()=>setMenu(menu?false:true)}><Link href='/user/login'>SignIn</Link></li>
        //   </ul>
        // </div>
        <li onClick={()=>setMenu(menu?false:true)} className="hover:border-b-2 border-black pb-4"><Link href='/user/login'>SignIn</Link></li>
        
        }
        {/* <li className="hover:border-b-2 border-black pb-4">Profile</li> */}
      </ul>}
    </div>
  )
}

export default MobileMenu