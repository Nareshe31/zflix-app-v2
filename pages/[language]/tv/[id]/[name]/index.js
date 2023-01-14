// import PageHead from "../../../../../molecules/PageHead"
import { getCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DropDown from "../../../../../molecules/atoms/DropDown";
import Genres from "../../../../../molecules/Genres";
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
    const { language, season, episode, id, name } = router.query;
    const [additionalData, setadditionalData] = useState({ season:season?season:"1", episode:episode?episode:"1" });
    const [seasonDetail, setseasonDetail] = useState({ loading: true, data: [] });
    const poster_path = `${TMDB_BASE_IMAGE_PATH("w342")}${data.poster_path}`;
    const showWatchContainer=season!==undefined &&season!=="" && episode!==undefined &&episode!==""
    const region = getCookie("region")
    ? JSON.parse(getCookie("region"))
    : { name: "India", "alpha-2": "IN", "country-code": "" };

    const [watchRegion, setwatchRegion] = useState(region["alpha-2"])

    useEffect(() => {
        getSeasonDetails(additionalData.season);
        return () => { };
    }, [additionalData]);

    useEffect(() => {
        setadditionalData({ season:season?season:"1", episode:episode?episode:"1" })
    }, [data.id])
    
    async function getSeasonDetails() {
        try {
            setseasonDetail({ loading: true, data: [] });
            const seasondata = await get({
                url: `/tv/${id}/season/${additionalData.season}`,
                type: "tmdb_client",
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
                                passHref
                            >
                                <a >
                                    <img className="episode-poster" style={{"objectFit":"cover"}} src={TMDB_BASE_IMAGE_PATH("w342")+episode.still_path} alt={`${data.name} Season ${episode.season_number} Episode ${episode.episode_number} poster`} srcSet="" />
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
                title={`Watch ${data.name} (${getYear(data.first_air_date)}) / ZFlix`}
                image_path={TMDB_BASE_IMAGE_PATH("w342") + data.poster_path}
                overview={data.overview}
            />
            <header className="bread-crumbs">
                <span>
                    <Link href={`/${language}`}>Home</Link>
                </span>
                <span className="separator">/</span>

                <span>
                    <Link href={`/${language}/tv-shows`}>TV Shows</Link>
                </span>

                <span className="separator">/</span>
                <span>{data.name}</span>
            </header>
            <section style={{"display":showWatchContainer?"block":"none"}} className="watch-container">
                <iframe
                    id="watch-frame"
                    webkitallowfullscreen=""
                    mozallowfullscreen=""
                    allowfullscreen=""
                    key={data.id+season+episode}
                    frameBorder={0}
                    src={`https://www.2embed.to/embed/tmdb/tv?id=${data.id}&s=${season}&e=${episode}`}
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
                        alt={data.name}
                        objectFit="cover"
                    />
                </div>
                <div className="info">
                    <h3 className="tex-lg">{data.name}</h3>
                    <p>{data.tagline}</p>
                    <p className="text-sm year-runtime">
                        <span>{getDate(data.first_air_date)}</span>
                        <span className="dot"></span>{" "}
                        <span>{data?.episode_run_time[0]}mins</span>
                    </p>
                    <Genres data={data.genres} type="tv" />
                    <p className="text-sm">
                        TMDB Rating {Number(data.vote_average).toFixed(1)}/10
                    </p>
                    {/* <button>
                        <i className="fa-regular fa-bookmark"></i>Add to wishlist
                    </button> */}
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
            <section className="season-details">
                <header>
                    <DropDown
                            onChange={(e) =>
                                setadditionalData({ season: e.target.value, episode: "1" })
                            }
                            name="season"
                            id="season"
                            value={additionalData.season}
                            options={data.seasons
                                ?.filter((season) => season.season_number !== 0)
                                ?.map((item) => ({name:`Season ${item.season_number}`,value:String(item.season_number)}))}
                            minWidth="100"
                        />
                    {/* <select
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
                    </select> */}
                </header>
                <EpisodesContainer key={"seasons"+data.id} seasonData={seasonDetail} />
            </section>

            <PosterContainer
                title={"More like this"}
                loadData={{ recommendations: true }}
                media_type="tv"
                data_types={[{ name: "Recommendations", value: "recommendations" }]}
                view="horizontal"
                key={"recommendations "+data.id}
                show_change_view={true}
                meta_data={{
                    recommendations: {
                        url: `/tv/${data.id}/recommendations`,
                        type: "tmdb_client",
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
                key={"similar "+data.id}
                show_change_view={true}
                meta_data={{
                    similar: {
                        url: `/tv/${data.id}/similar`,
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
        url: `/tv/${id}`,
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
