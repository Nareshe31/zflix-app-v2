export default function Home() {
  return (
    <div></div>
  )
}

export async function getServerSideProps() {
  return {
    redirect:{
      destination:'/en',
      permanent:false
    }
  }
}