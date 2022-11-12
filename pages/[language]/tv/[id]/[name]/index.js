// import PageHead from "../../../../../molecules/PageHead"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageHead from "../../../../../molecules/PageHead";
import PosterContainer from "../../../../../molecules/PosterContainer";
import { get } from "../../../../../service/api-fetch";
import {
    getDate,
    getLink,
    getYear,
    TMDB_BASE_IMAGE_PATH,
} from "../../../../../utils/functions";

export default function TvPage({ data }) {
    // console.log(data);
    const router = useRouter();
    const { language, season = "1", episode = "1", id, name } = router.query;
    const [additionalData, setadditionalData] = useState({ season, episode });
    const [seasonDetail, setseasonDetail] = useState({ loading: true, data: [] });
    const poster_path = `${TMDB_BASE_IMAGE_PATH("w342")}${data.poster_path}`;

    useEffect(() => {
        getSeasonDetails(additionalData.season);
        return () => { };
    }, [additionalData.season]);

    async function getSeasonDetails() {
        try {
            setseasonDetail({ loading: true, data: [] });
            const seasondata = await get({
                url: `/tv/${id}/season/${additionalData.season}`,
                type: "tmdb",
                params: [
                    { key: "language", value: language },
                    {
                        key: "append_to_response",
                        value: "videos,images,credits",
                    },
                ],
            });
            setseasonDetail({ data: seasondata, loading: false });
        } catch (error) {
            console.log(error);
        }
    }

    function EpisodesContainer({ seasonData }) {
        const link=(episode)=>`${getLink(data, "tv", language)}?season=${episode.season_number}&episode=${episode.episode_number}`
        return (
            <>
            {
                seasonData.loading?
                <h2>Loading...</h2>
                :
                <div className="episodes-container">
                    {seasonData.data.episodes?.map((episode) => (
                        <div className="episode-container" key={episode.id}>
                            <Link
                                href={link(episode)}
                            >
                                <a>
                                    <img className="episode-poster" style={{"objectFit":"cover"}} src={TMDB_BASE_IMAGE_PATH("w342")+episode.still_path} alt={`${data.name} Season ${episode.season_number} Episode ${episode.episode_number} poster`} srcset="" />
                                    <span className="episode-number text-lg">Episode {episode.episode_number}</span>
                                    <span className="episode-title text-lg">{episode.name}</span>
                                </a>
                            </Link>
                        </div>
                    ))}
                </div>
                
            }
            </>
            
        );
    }
    return (
        <>
            <PageHead
                title={`Watch ${data.name} (${getYear(data.first_air_date)}) online`}
                image_path={TMDB_BASE_IMAGE_PATH("w342") + data.poster_path}
                overview={data.overview}
            />
            <header className="bread-crumbs">
                <span>
                    <Link href={`/${language}`}>Home</Link>
                </span>
                <span className="separator">/</span>

                <span>
                    <Link href={`/${language}/tv-shows`}>Tv Shows</Link>
                </span>

                <span className="separator">/</span>
                <span>{data.name}</span>
            </header>
            {/* <section className="watch-container">
                <iframe
                    id="watch-frame"
                    webkitallowfullscreen=""
                    mozallowfullscreen=""
                    allowfullscreen=""
                    frameBorder={0}
                    src={`https://www.2embed.to/embed/tmdb/tv?id=${data.id}&s=${season}&e=${episode}`}
                >
                    {" "}
                </iframe>
            </section> */}
            <section className="movie-details">
                <div className="poster-container">
                    <Image
                        src={poster_path}
                        blurDataURL={poster_path}
                        layout="fill"
                        alt={data.name}
                        objectFit="cover"
                    />
                </div>
                <div className="info">
                    <h3 className="tex-lg">{data.name}</h3>
                    <p className="text-sm year-runtime">
                        <span>{getDate(data.first_air_date)}</span>
                        <span className="dot"></span>{" "}
                        <span>{data.episode_run_time[0]}mins</span>
                    </p>
                    <div className="genres text-sm">
                        {data.genres.map((item) => (
                            <span className="genre" key={item.id}>
                                {item.name}
                            </span>
                        ))}
                    </div>
                    <p className="text-sm">
                        TMDB Rating {Number(data.vote_average).toFixed(1)}/10
                    </p>
                    <button>
                        <i className="fa-regular fa-bookmark"></i>Add to wishlist
                    </button>
                </div>
            </section>
            <section className="season-details">
                <header>
                    <select
                        value={additionalData.season}
                        onChange={(e) =>
                            setadditionalData({ season: e.target.value, episode: "1" })
                        }
                    >
                        {data.seasons
                            ?.filter((season) => season.season_number !== 0)
                            ?.map((item) => (
                                <option value={item.season_number} key={item.id}>
                                    Season {item.season_number}
                                </option>
                            ))}
                    </select>
                </header>
                <EpisodesContainer seasonData={seasonDetail} />
            </section>

            <PosterContainer
                title={"More like this"}
                loadData={{ recommendations: true }}
                media_type="tv"
                data_types={[{ name: "Recommendations", value: "recommendations" }]}
                view="horizontal"
                meta_data={{
                    recommendations: {
                        url: `/tv/${data.id}/recommendations`,
                        type: "tmdb",
                        params: [{ key: "language", value: language }],
                    },
                }}
            />
            <PosterContainer
                title={"You may also like"}
                loadData={{ similar: true }}
                media_type="tv"
                data_types={[{ name: "Similar", value: "similar" }]}
                view="horizontal"
                meta_data={{
                    similar: {
                        url: `/tv/${data.id}/similar`,
                        type: "tmdb",
                        params: [{ key: "language", value: language }],
                    },
                }}
            />
        </>
    );
}

export async function getServerSideProps(context) {
    const { id, language } = context.query;
    console.log({ id, language });
    const data = await get({
        url: `/tv/${id}`,
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
