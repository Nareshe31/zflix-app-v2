// import PageHead from "../../../../../molecules/PageHead"
import PosterContainer from "../../../../../molecules/PosterContainer"
import { get } from "../../../../../service/api-fetch";

export default function MoviePage({data}){
    // console.log(data);
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
            <section>
                <iframe id="watch-frame" allowFullScreen frameBorder={0} src={`https://2embed.to/embed/tmdb/movie?id=${data.id}`}> </iframe>
            </section>
            <section>

            </section>
            <section>

            </section>
            <PosterContainer  
                title={"Similar movies"}
                loadData={{similar:false}}
                all_data={{similar:data.similar}}
                media_type="movie"
                data_types={[{name:"Similar",value:"similar"}]}
                view="horizontal"
            />
            <PosterContainer  
                title={"Recommendations"}
                loadData={{recommendations:false}}
                all_data={{recommendations:data.recommendations}}
                media_type="movie"
                data_types={[{name:"Recommendations",value:"recommendations"}]}
                view="horizontal"
            />
        </>
    )
}

export async function getServerSideProps(context) {
    const {id,language} = context.query 
    const data = await get({
        url: `/movie/${id}`,
        type: "tmdb",
        params: [
            { key: "language", value: language },
            { key:"append_to_response",value:"videos,images,recommendations,similar,images,credits" },
        ],
    });
    return{
        props:{
            data
        }
    }
}