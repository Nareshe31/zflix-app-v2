// import PageHead from "../../../../../molecules/PageHead"
import { getCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Genres from "../../../../../molecules/Genres";
import PageHead from "../../../../../molecules/PageHead";
import PosterContainer from "../../../../../molecules/PosterContainer";
import { get } from "../../../../../service/api-fetch";
import {
    getDate,
    getYear,
    TMDB_BASE_IMAGE_PATH,
} from "../../../../../utils/functions";

export default function MoviePage({ data }) {
    // console.log(data);
    const router = useRouter();
    const { language } = router.query;
    const poster_path = `${TMDB_BASE_IMAGE_PATH("w342")}${data.poster_path}`;
    const showWatchContainer=(new Date()>=new Date(data?.release_date))
    const region = getCookie("region")
    ? JSON.parse(getCookie("region"))
    : { name: "India", "alpha-2": "IN", "country-code": "" };
    const [watchRegion, setwatchRegion] = useState(region["alpha-2"])
    return (
        <>
            <PageHead
                title={`Watch ${data.title} (${getYear(data.release_date)}) / ZFlix`}
                image_path={TMDB_BASE_IMAGE_PATH("w342") + data.poster_path}
                overview={data.overview}
            />
            <header className="bread-crumbs">
                <span>
                    <Link href={`/${language}`}>Home</Link>
                </span>
                <span className="separator">/</span>

                <span>
                    <Link href={`/${language}/movies`}>Movies</Link>
                </span>

                <span className="separator">/</span>
                <span>{data.title}</span>
            </header>
            {showWatchContainer?<section className="watch-container">
                <iframe
                    id="watch-frame"
                    key={data.id}
                    webkitallowfullscreen=""
                    mozallowfullscreen=""
                    allowfullscreen=""
                    frameBorder={0}
                    src={`https://www.2embed.to/embed/tmdb/movie?id=${data.id}`}
                    title={data.id}
                ></iframe>
            </section>
            :null}
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
                    <p className="text-sm">{data.tagline}</p>
                    <p className="text-sm year-runtime">
                        <span>{getDate(data.release_date)}</span>
                        <span className="dot"></span> <span>{data.runtime}mins</span>
                    </p>
                    <Genres data={data.genres} type="movie" />
                    <p className="text-sm">
                        TMDB Rating {Number(data.vote_average).toFixed(1)}/10
                    </p>
                    <button>
                        <i className="fa-regular fa-bookmark"></i>Add to wishlist
                    </button>
                    
                </div>
            </section>
            <section className="other-details">
                <div>
                    <label htmlFor="">Streaming: </label>
                    <select value={watchRegion} onChange={(e)=>setwatchRegion(e.target.value)}>
                        {Object.keys(data["watch/providers"]?.results).map(item=><option key={item}>{item}</option>)}
                    </select>
                    <div>
                        {data["watch/providers"]?.results[watchRegion]?.flatrate?.map(item=><span style={{"margin":"4px 3px","display":"inline-block"}} key={item.provider_id}><img width={40} height={40} src={TMDB_BASE_IMAGE_PATH('w342')+item.logo_path} /></span>)}
                    </div>
                </div>
            </section>

            <PosterContainer
                title={"More like this"}
                loadData={{ recommendations: true }}
                media_type="movie"
                data_types={[{ name: "Recommendations", value: "recommendations" }]}
                view="horizontal"
                key={"recommendations " + data.id}
                show_change_view={true}
                meta_data={{
                    recommendations: {
                        url: `/movie/${data.id}/recommendations`,
                        type: "tmdb_client",
                        params: [{ key: "language", value: language }],
                    },
                }}
            />
            <PosterContainer
                title={"You may also like"}
                loadData={{ similar: true }}
                media_type="movie"
                data_types={[{ name: "Similar", value: "similar" }]}
                view="horizontal"
                key={"similar " + data.id}
                show_change_view={true}
                meta_data={{
                    similar: {
                        url: `/movie/${data.id}/similar`,
                        type: "tmdb_client",
                        params: [{ key: "language", value: language }],
                    },
                }}
            />
        </>
    );
}

export async function getServerSideProps(context) {
    const { id, language } = context.query;
    const data = await get({
        url: `/movie/${id}`,
        type: "tmdb_server",
        params: [
            { key: "language", value: language },
            {
                key: "append_to_response",
                value: "videos,images,credits,watch/providers",
            },
        ],
    });
    return {
        props: {
            data,
        },
    };
}
