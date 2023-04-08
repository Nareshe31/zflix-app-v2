import '../styles/globals.css'
import '../styles/home.scss'
import '../styles/movie.scss'
import '../styles/sidebar.scss'
import '../styles/tv.scss'
import '../styles/search.scss'
import Sidebar from '../components/sidebar'

//import owl carousel
import 'owl.carousel/dist/assets/owl.carousel.css';
import Link from 'next/link'
import Header from '../molecules/Header'

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Router from 'next/router';
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient=new QueryClient;

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

Router.events.on('routeChangeStart', (url) => {
  NProgress.start();
});

Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return( 
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
    )
}

export default MyApp
