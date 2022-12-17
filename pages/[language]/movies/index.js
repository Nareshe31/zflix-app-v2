import { useRouter } from "next/router";
import PosterContainer from "../../../molecules/PosterContainer";
import { getCookie, setCookie } from "cookies-next";
import PageHead from "../../../molecules/PageHead";
import { overview } from "../../../utils/functions";
import { useEffect, useRef, useState } from "react";

export default function MoviePage() {
    const router = useRouter();
    const { language } = router.query;
    const region = getCookie("region")
        ? JSON.parse(getCookie("region"))
        : { name: "India", "alpha-2": "IN", "country-code": "" };

    const genreCodes = [
        { id: 28, name: "Action", value: "action" },
        { id: 53, name: "Thriller", value: "thriller" },
    ];
    const [showContainerIds, setshowContainerIds] = useState(0);
    const loading = useRef(false)
    useEffect(() => {
        loading.current=false
        window.addEventListener("scroll", scrollbehaviour);
        console.log("innn");
        function scrollbehaviour() {
            var myDiv = document.getElementsByTagName("body")[0];
            // console.log(myDiv.scrollHeight,myDiv.clientHeight,window.scrollY,showContainerIds);
            // console.log(myDiv.clientHeight+window.scrollY,' ',myDiv.scrollHeight);
            if (myDiv.clientHeight + window.scrollY >= myDiv.scrollHeight - 100 && showContainerIds<3 && !loading.current) {
                loading.current=true
                setshowContainerIds((prev) => prev + 1);
            }
        }
        return () => {
            window.removeEventListener("scroll", scrollbehaviour);
        };
    }, [showContainerIds]);
    
    return (
        <>
            <PageHead
                title={"Movies / ZFlix"}
                overview={overview}
                image_path="/icons/apple-touch-icon.png"
            />
            <PosterContainer
                title={`Upcoming movies in ${region.name}`}
                media_type="movie"
                data_types={[{ name: "Upcoming", value: "upcoming" }]}
                loadData={{ upcoming: true }}
                view="horizontal"
                show_change_view={true}
                meta_data={{
                    upcoming: {
                        url: `/movie/upcoming`,
                        type: "tmdb_client",
                        params: [
                            { key: "language", value: language },
                            { key: "page", value: 1 },
                            { key: "region", value: region["alpha-2"] },
                        ],
                    },
                }}
            />
            <PosterContainer
                title={`Popular movies in ${region.name}`}
                loadData={{ popular: true }}
                view="horizontal"
                meta_data={{
                    popular: {
                        url: `/movie/popular`,
                        type: "tmdb_client",
                        params: [
                            { key: "language", value: language },
                            { key: "page", value: 1 },
                            { key: "region", value: region["alpha-2"] },
                        ],
                    },
                }}
                show_change_view={true}
                media_type="movie"
                data_types={[{ name: "Popular", value: "popular" }]}
            />
            <PosterContainer
                title={"Top rated movies"}
                loadData={{ top_rated: true }}
                show_change_view={true}
                view="horizontal"
                meta_data={{
                    top_rated: {
                        url: `/movie/top_rated`,
                        type: "tmdb_client",
                        params: [
                            { key: "language", value: language },
                            { key: "page", value: 1 },
                            { key: "region", value: region["alpha-2"] },
                        ],
                    },
                }}
                media_type="movie"
                data_types={[{ name: "Top rated", value: "top_rated" }]}
            />
            {showContainerIds >= 1 ? (
                <PosterContainer
                    key={genreCodes[0].id}
                    title={`${genreCodes[0].name} & Thriller Movies`}
                    media_type="movie"
                    data_types={[{ name: genreCodes[0].name, value: genreCodes[0].value }]}
                    loadData={{ [genreCodes[0].value]: true }}
                    // show_change_view={true}
                    view="horizontal"
                    meta_data={{
                        [genreCodes[0].value]: {
                            url: `/discover/movie`,
                            type: "tmdb_client",
                            params: [
                                { key: "language", value: language },
                                { key: "with_genres", value: genreCodes[0].id },
                                { key: "page", value: 1 },
                                { key: "sort_by", value: "vote_count.desc" },
                                // { key: "with_watch_providers", value: 122 },
                                // { key: "watch_region", value: region["alpha-2"] },
                            ],
                        },
                    }}
                />
            ) : null}

            {showContainerIds >= 2 ? (
                <PosterContainer
                    title={"Mystery Movies"}
                    media_type="movie"
                    data_types={[{ name: "Action", value: "action" }]}
                    loadData={{ action: true, week: true }}
                    // show_change_view={true}
                    view="horizontal"
                    meta_data={{
                        action: {
                            url: `/discover/movie`,
                            type: "tmdb_client",
                            params: [
                                { key: "language", value: language },
                                { key: "with_genres", value: "27" },
                                { key: "page", value: 1 },
                                { key: "sort_by", value: "vote_count.desc" },
                                // { key: "with_watch_providers", value: 122 },
                                // { key: "watch_region", value: region["alpha-2"] },
                            ],
                        },
                    }}
                />
            ) : null}

            {showContainerIds >= 3 ? (
                <PosterContainer
                    title={"Mystery Movies"}
                    media_type="movie"
                    data_types={[{ name: "Action", value: "action" }]}
                    loadData={{ action: true, week: true }}
                    // show_change_view={true}
                    view="horizontal"
                    meta_data={{
                        action: {
                            url: `/discover/movie`,
                            type: "tmdb_client",
                            params: [
                                { key: "language", value: language },
                                { key: "with_genres", value: "9648" },
                                { key: "page", value: 1 },
                                { key: "sort_by", value: "vote_count.desc" },
                                // { key: "with_watch_providers", value: 122 },
                                // { key: "watch_region", value: region["alpha-2"] },
                            ],
                        },
                    }}
                />
            ) : null}
        </>
    );
}

export async function getServerSideProps({ query, req, res }) {
    try {
        const forwarded = req.headers["x-forwarded-for"];
        const ip = forwarded
            ? forwarded.split(/, /)[0]
            : req.connection.remoteAddress;

        const { language } = query;
        const isregion = getCookie("region", { req, res });
        var region = {};
        if (isregion) {
            region = JSON.parse(getCookie("region", { req, res }));
        } else {
            const response = await fetch(`http://ip-api.com/json/${ip}`);
            const data = await response.json();
            region = {
                name: data.country ?? "India",
                "alpha-2": data.countryCode ?? "IN",
                "country-code": "",
            };
            setCookie("region", region, { req, res });
        }
        return {
            props: {},
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
}
