import React from 'react';
import { auth} from "@/app/auth";
import Link from "next/link";
import SignOut from './SignOut'

const Navbar = async({children}) => {
    const session = await auth();
  return (
    <div className="font-[family-name:var(--font-poppins)]">
            <div className=" flex justify-center mt-6">
              <div className="w-5/6">
                <div className="flex justify-between  border-b-2">
                  <Link href='/'><h1 className="font-medium text-2xl -mt-1">Vlog News</h1></Link>
                  <ul className="flex space-x-6">
                    <li className="hover:border-b-2 border-black pb-4">Vlog</li>
                    <li className="hover:border-b-2 border-black pb-4">About</li>
                    {session?
                      <>
                      <Link href='/posts/newposts'><li className="hover:border-b-2 border-black pb-4">New Vlog</li></Link>
                      <div className="dropdown dropdown-bottom dropdown-end">
                      <div tabIndex={0} role="button" className="flex space-x-1 hover:border-b-2 border-black pb-4">
                        <svg width="16" height="16" className="mt-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8ZM10 5C10 6.10457 9.10457 7 8 7C6.89543 7 6 6.10457 6 5C6 3.89543 6.89543 3 8 3C9.10457 3 10 3.89543 10 5Z" fill="black"/>
                          <path d="M14 13C14 14 13 14 13 14H3C3 14 2 14 2 13C2 12 3 9 8 9C13 9 14 12 14 13ZM13 12.9965C12.9986 12.7497 12.8462 12.0104 12.1679 11.3321C11.5156 10.6798 10.2891 10 7.99999 10C5.71088 10 4.48435 10.6798 3.8321 11.3321C3.15375 12.0104 3.00142 12.7497 3 12.9965H13Z" fill="black"/>
                        </svg>
                        <span>{session?.user?.name}</span>
                      </div>
                      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 mt-2 shadow">
                        <li><Link href='/posts'>Account</Link></li>
                        <li><SignOut /></li>
                      </ul>
                    </div>
                    </>:
                      <div className="dropdown dropdown-bottom dropdown-end">
                      <div tabIndex={0} role="button" className="hover:border-b-2 border-black pb-4">Profile</div>
                      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 mt-2 shadow">
                        <li><Link href='/user/login'>SignIn</Link></li>
                      </ul>
                    </div>
                    }
                    {/* <li className="hover:border-b-2 border-black pb-4">Profile</li> */}
                  </ul>
                </div>
                  {children}
              </div>
            </div>
          </div>
  )
}

export default Navbar