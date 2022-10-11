import '../styles/globals.css'
import '../styles/home.css'
import '../styles/sidebar.css'
import Sidebar from '../components/sidebar'
import { useRouter } from 'next/router'
import { setCookie } from 'cookies-next';

//import owl carousel
import 'owl.carousel/dist/assets/owl.carousel.css';
import dynamic from 'next/dynamic'
const Owl = dynamic(() => import("owl.carousel"), {
    ssr:false
  });

var $ = require("jquery");
if (typeof window !== "undefined") {
   window.$ = window.jQuery = require("jquery");
}

function Layout({children}) {
 
  return(
    <>
      <Sidebar  />
      <main className='aside-right' id='aside-right'>
        <div className='header'>
        
        </div>
        {children}
      </main>
    </>
  )
}

function MyApp({ Component, pageProps }) {
  return( 
    <Layout>
      <Component {...pageProps} />
    </Layout>
    )
}

export default MyApp
