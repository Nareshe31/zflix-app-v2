import PageHead from "../../../../../molecules/PageHead"

export default function MoviePage({id}){

    return(
        <>
            <style jsx>
                {`
                iframe{
                    width:100%;
                    height:100%;
                }   
                `}
            </style>
            <iframe id="watch-frame" allowFullScreen frameBorder={0} src={`https://2embed.to/embed/tmdb/movie?id=${id}`}> </iframe>
        </>
    )
}

export async function getServerSideProps(context) {
    const {id} = context.query 
    return{
        props:{
            id
        }
    }
}