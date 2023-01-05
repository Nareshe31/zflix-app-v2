import { useRouter } from "next/router";
import PosterContainer from "../../../molecules/PosterContainer";
import { get } from "../../../service/api-fetch";
import { getCookie, setCookie } from "cookies-next";
import PageHead from "../../../molecules/PageHead";
import { overview } from "../../../utils/functions";
import { useState } from "react";
import LANGUAGE_CODES from "../../../utils/data-codes";
import DropDown from "../../../molecules/atoms/DropDown";

const api_endpoints = {
    all: "/search/multi",
    movie: "/search/movie",
    tv: "/search/tv",
};

export default function SearchPage({ data }) {
    const router = useRouter();
    const {
        language,
        query = "",
        page = 1,
        type = "all",
        lang = "en-US",
        include_adult = "no",
    } = router.query;
    const region = getCookie("region")
        ? JSON.parse(getCookie("region"))
        : { name: "", "alpha-2": "", "country-code": "" };

    const [searchData, setsearchData] = useState({ query, type, include_adult });

    function handleChange(e) {
        const { name, value } = e.target;
        console.log(e.target);
        setsearchData((prev) => ({ ...prev, [name]: value }));
    }

    function generateLink() {
        const encodedQuery = searchData.query.replace(/\s+/g, "+");
        const link = `/${language}/search?query=${encodedQuery}&type=${searchData.type}&include_adult=${searchData.include_adult}`;
        return link;
    }
    function handleSubmit(e) {
        e.preventDefault();
        router.push(generateLink());
    }
    return (
        <>
            <PageHead
                title={`${query==='' || query===undefined?'Search':query} / ZFlix`}
                overview={overview}
                image_path="/icons/apple-touch-icon.png"
            />
            <div className="search-container">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="query">Keyword: </label>
                        <input
                            onChange={handleChange}
                            value={searchData.query}
                            type="search"
                            name="query"
                            id="query"
                            placeholder="What are you looking for?"
                            accessKey="/"
                        />
                    </div>
                    <div>
                        <label htmlFor="type">Type: </label>
                        {/* <select
                            onChange={handleChange}
                            value={searchData.type}
                            name="type"
                            id="type"
                        >
                            <option value="all">All</option>
                            <option value="movie">Movie</option>
                            <option value="tv">TV Show</option>
                        </select> */}
                        <DropDown
                            onChange={handleChange}
                            name="type"
                            id="type"
                            value={searchData.type}
                            options={[
                                { name: "All", value: "all" },
                                { name: "Movie", value: "movie" },
                                { name: "TV", value: "tv" },
                            ]}
                            minWidth="100"
                        />
                    </div>
                    <div>
                        <label htmlFor="include_adult">Include Adult: </label>
                        {/* <select
                            name="include_adult"
                            onChange={handleChange}
                            value={searchData.include_adult}
                            id="include_adult"
                        >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select> */}
                        <DropDown
                            onChange={handleChange}
                            name="include_adult"
                            id="include_adult"
                            value={searchData.include_adult}
                            options={[
                                { name: "Yes", value: "yes" },
                                { name: "No", value: "no" }
                            ]}
                            minWidth="100"
                        />
                    </div>
                    <div>
                        <button type="submit">Search</button>
                    </div>
                </form>
            </div>
            <PosterContainer
                title={`Search results for "${query}"`}
                media_type={["movie", "tv"].includes(type) ? type : undefined}
                data_types={[{ name: "Search", value: "search" }]}
                loadData={{ search: false }}
                show_media_type={true}
                show_change_view={false}
                key={query + type + language + page + include_adult}
                show_pagination={true}
                current_page={page}
                link={generateLink()}
                all_data={{ search: data }}
                meta_data={{
                    search: {
                        url: api_endpoints[type],
                        type: "tmdb_client",
                        params: [
                            { key: "language", value: language },
                            { key: "query", value: query },
                            { key: "page", value: page },
                            {
                                key: "include_adult",
                                value: include_adult === "Yes" ? true : false,
                            },
                            { key: "region", value: region["alpha-2"] },
                        ],
                    },
                }}
            />
        </>
    );
}

export async function getServerSideProps({ query, req, res }) {
    try {
        const forwarded = req.headers["x-forwarded-for"];
        const ip = forwarded
            ? forwarded.split(/, /)[0]
            : req.connection.remoteAddress;

        const { language, page = 1, type = "all", include_adult = "no" } = query;
        const search_query = query.query ?? "";
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
        const search_data = await get({
            url: api_endpoints[type],
            type: "tmdb_server",
            params: [
                { key: "language", value: language },
                { key: "query", value: search_query },
                { key: "page", value: page },
                { key: "include_adult", value: include_adult === "Yes" ? true : false },
                { key: "region", value: region["alpha-2"] },
            ],
        });
        return {
            props: {
                data: search_data,
            },
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
}
