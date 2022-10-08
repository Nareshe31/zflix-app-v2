import '../styles/globals.css'
import '../styles/home.css'
import '../styles/sidebar.css'
import Sidebar from '../components/sidebar'
import Head from 'next/head'
import { useRouter } from 'next/router'

function Layout({children}) {
 
  return(
    <>
      <Head>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      </Head>
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
