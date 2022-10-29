import '../styles/globals.css'
import '../styles/home.scss'
import '../styles/movie.scss'
import '../styles/sidebar.scss'
import Sidebar from '../components/sidebar'

//import owl carousel
import 'owl.carousel/dist/assets/owl.carousel.css';
import Link from 'next/link'
import Header from '../molecules/Header'

var $ = require("jquery");
if (typeof window !== "undefined") {
   window.$ = window.jQuery = require("jquery");
}

function Layout({children}) {
 
  return(
    <>
      <Sidebar  />
      <main className='aside-right' id='aside-right'>
        <Header />
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
