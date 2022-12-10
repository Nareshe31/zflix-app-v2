import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'

export default function Header() {

  const router=useRouter()
  const {language}=router.query

    const expandSidebar = () => {
        return
        const asideRight = document.body;
        const sidebar=document.getElementById('sidebar')
        // ("#aside-right");
        if (sidebar.classList.contains("expand")) {
            const scrollY = asideRight.style.top;
            asideRight.style.position = "";
            asideRight.style.top = "";
            window.scrollTo(0, parseInt(scrollY || "0") * -1);
            sidebar.classList.remove("expand");
        } else {
            const top = window.scrollY;
            asideRight.style.position = "fixed";
            asideRight.style.top = `-${top}px`;
            sidebar.classList.add("expand");
        }
    };

    useEffect(() => {
      
        var prevScrollpos = window.pageYOffset;
        window.addEventListener('scroll',scrollbehaviour)
        function scrollbehaviour() {
          var currentScrollPos = window.pageYOffset;
          if (prevScrollpos > currentScrollPos) {
            document.getElementById("header").style.top = "0";
          } else {
            document.getElementById("header").style.top = "-80px";
          }
          prevScrollpos = currentScrollPos;
        }
      return () => {
        window.removeEventListener('scroll',scrollbehaviour)
      }
    }, [])
    
  return (
    <div className='header' id='header'>
          <h2 className='title'>
          <button onClick={expandSidebar}>
            <div className="ham">
                <div className="line-1"></div>
                <div className="line-2"></div>
                <div className="line-3"></div>
            </div>
          </button>
            <Link href={`/${language}`}>ZFlix</Link>
          </h2>
          <div>
            <button>Login / Register</button>
          </div>
        </div>
  )
}
