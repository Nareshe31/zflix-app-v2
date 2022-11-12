// import PageHead from "../../../../../molecules/PageHead"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import PageHead from "../../../../../molecules/PageHead";
import PosterContainer from "../../../../../molecules/PosterContainer";
import { get } from "../../../../../service/api-fetch";
import { getDate, getYear, TMDB_BASE_IMAGE_PATH } from "../../../../../utils/functions";

export default function MoviePage({ data }) {
    // console.log(data);
    const router=useRouter()
    const {language}=router.query
    const poster_path=`${TMDB_BASE_IMAGE_PATH('w342')}${data.poster_path}`
    return (
        <>
            <PageHead
                title={`Watch ${data.title} (${getYear(data.release_date)}) os`}
                image_path={TMDB_BASE_IMAGE_PATH('w342')+data.poster_path}
                overview={data.overview}
            />
            <header className="bread-crumbs">
                <span>
                    <Link href={`/${language}`}>Home</Link>
                </span>
                <span className="separator">/</span>
                
                    <span>
                    <Link href={`/${language}/movies`}>Movies</Link></span>
                
                <span className="separator">/</span>
                <span>{data.title}</span>
            </header>
            <section className="watch-container">
                <iframe
                    id="watch-frame"
                    webkitallowfullscreen=""
                    mozallowfullscreen=""
                    allowfullscreen=""
                    frameBorder={0}
                    src={`https://www.2embed.to/embed/tmdb/movie?id=${data.id}`}
                >
                    {" "}
                </iframe>
            </section>
            <section className="movie-details">
                <div className="poster-container">
                    <Image 
                        src={poster_path} 
                        blurDataURL={poster_path}
                        layout="fill"
                        alt={data.title}  
                        objectFit="cover"
                    />
                </div>
                <div className="info">
                    <h3 className="tex-lg">{data.title}</h3>
                    <p className="text-sm year-runtime"><span>{getDate(data.release_date)}</span><span className="dot"></span> <span>{data.runtime}mins</span></p>
                    <div className="genres text-sm">{data.genres.map(item=><span className="genre" key={item.id}>{item.name}</span>)}</div>
                    <p className="text-sm">TMDB Rating {Number(data.vote_average).toFixed(1)}/10</p>
                    <button><i class="fa-regular fa-bookmark"></i>Add to wishlist</button>
                </div>
            </section>
            <section></section>
            
            <PosterContainer
                title={"More like this"}
                loadData={{ recommendations: true }}
                media_type="movie"
                data_types={[{ name: "Recommendations", value: "recommendations" }]}
                view="horizontal"
                meta_data={{recommendations:{
                    url: `/movie/${data.id}/recommendations`,
                    type: "tmdb",
                    params: [
                        { key: "language", value: language }
                    ],
                }}}
            />
            <PosterContainer
                title={"You may also like"}
                loadData={{ similar: true }}
                media_type="movie"
                data_types={[{ name: "Similar", value: "similar" }]}
                view="horizontal"
                meta_data={{similar:{
                    url: `/movie/${data.id}/similar`,
                    type: "tmdb",
                    params: [
                        { key: "language", value: language }
                    ],
                }}}
            />
        </>
    );
}

export async function getServerSideProps(context) {
    const { id, language } = context.query;
    const data = await get({
        url: `/movie/${id}`,
        type: "tmdb",
        params: [
            { key: "language", value: language },
            {
                key: "append_to_response",
                value: "videos,images,credits",
            },
        ],
    });
    return {
        props: {
            data,
        },
    };
}
