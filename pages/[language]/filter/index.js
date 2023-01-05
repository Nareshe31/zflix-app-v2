import { useRouter } from "next/router";
import { getCookie, setCookie } from "cookies-next";
import React, { useEffect, useRef, useState } from "react";
import PageHead from "../../../molecules/PageHead";
import PosterContainer from "../../../molecules/PosterContainer";
import { get } from "../../../service/api-fetch";
import { overview } from "../../../utils/functions";
import {
    FILTER_SORT_BY_VALUES,
    LANGUAGE_CODES,
    MOVIE_GENRES,
    MOVIE_WATCH_PROVIDERS,
    TV_GENRES,
    TV_WATCH_PROVIDERS,
} from "../../../utils/data-codes";
import DropDown from "../../../molecules/atoms/DropDown";

export default function FilterPage({ data }) {
    const router = useRouter();
    const {
        language,
        genres = "",
        type = "movie",
        page = 1,
        include_adult = "no",
        original_language = "",
        watch_providers = "",
        sort_by = "vote_count.desc",
        release_date_gte = "",
        release_date_lte = "",
    } = router.query;
    const [filterData, setfilterData] = useState({
        genres: genres === "" ? [] : genres.split(","),
        type,
        include_adult,
        original_language,
        watch_providers,
        sort_by,
        release_date_gte,
        release_date_lte,
    });

    const formRef = useRef(null);

    useEffect(() => {
        formRef.current.classList.add("hide");
        return () => { };
    }, [router.query]);

    function generateLink() {
        const link = `/${language}/filter?genres=${genres}&original_language=${original_language}&type=${type}&sort_by=${sort_by}&watch_providers=${watch_providers}&release_date_gte=${release_date_gte}&release_date_lte=${release_date_lte}`;
        return link;
    }

    function checkValueChanged() {
        if (filterData.original_language !== original_language) return true;
        if (filterData.sort_by !== sort_by) return true;
        if (filterData.type !== type) return true;
        if (filterData.genres.length !== genres.split(",").length) return true;
        if (
            filterData.genres.filter((g) => !genres.split(",").includes(g)).length !==
            0
        )
            return true;
        if (filterData.watch_providers !== watch_providers) return true;
        return false;
    }

    function handleGenreChange(value, name) {
        const id = String(value);
        const filterDataTemp = filterData;
        if (filterData[name].includes(id)) {
            filterDataTemp[name] = filterData[name].filter((prev) => prev !== id);
        } else {
            filterDataTemp[name] = [...filterData[name], id];
        }
        setfilterData((prev) => ({ ...prev, ...filterDataTemp }));
    }

    function handleFilterChange(event) {
        const { name, value } = event.target;
        const filterDataTemp = filterData;
        filterDataTemp[name] = value;
        if (name === "type") {
            filterDataTemp.genres = [];
            filterDataTemp.watch_providers = '';
        }
        setfilterData((prev) => ({ ...prev, ...filterDataTemp }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        router.push(
            `/${language}/filter?genres=${filterData.genres.join(
                ","
            )}&original_language=${filterData.original_language}&type=${filterData.type
            }&sort_by=${filterData.sort_by}&watch_providers=${filterData.watch_providers
            }&release_date_gte=${filterData.release_date_gte}&release_date_lte=${filterData.release_date_lte
            }`
        );
    }
    // const genre_name = String(name)[0].toUpperCase() + String(name).slice(1);

    function GenresSelect({ selected_genres, genres, name, label, id, value }) {
        return (
            <div>
                <label htmlFor="">{label}: </label>

                <div className="filter-genres" key={selected_genres}>
                    {/* <div>{selected_genres.map(genre=><span key={genre}>{genres.filter[genre]}</span>)}</div> */}
                    {/* <div> */}
                    {genres.map((genre) => (
                        <button
                            className={`${selected_genres.includes(String(genre[id])) ? "active" : ""
                                } filter-genre`}
                            onClick={() => handleGenreChange(genre[id], name)}
                            key={genre[id]}
                            data-value={genre[id]}
                        >
                            {genre[value]}
                        </button>
                    ))}
                    {/* </div> */}
                </div>
            </div>
        );
    }
    return (
        <>
            <PageHead
                title={`Filtered results / ZFlix`}
                overview={overview}
                image_path="/icons/apple-touch-icon.png"
            />
            <section className="filter-form-container">
                <div
                    className="filter-head"
                    onClick={() => formRef.current.classList.toggle("hide")}
                >
                    <h2>Filter</h2>
                    <div>
                        <i className="fa-solid fa-circle-chevron-down"></i>
                    </div>
                </div>
                <form onSubmit={handleSubmit} ref={formRef} className="hide">
                    <div>
                        <label htmlFor="">Language: </label>
                        {/* <select
                            name="original_language"
                            onChange={handleFilterChange}
                            id=""
                            value={filterData.original_language}
                        >
                            <option value="" defaultValue>
                                All
                            </option>
                            {LANGUAGE_CODES.map((lang) => (
                                <option key={lang.iso_639_1} value={lang.iso_639_1}>
                                    {lang.english_name}
                                </option>
                            ))}
                        </select> */}
                        <DropDown
                            onChange={handleFilterChange}
                            name="original_language"
                            id="original_language"
                            value={filterData.original_language}
                            options={[
                                { name: "All", value: "" },
                                ...LANGUAGE_CODES.map(lang=>({ name: lang.english_name, value: lang.iso_639_1 }))
                            ]}
                            minWidth="160"
                        />
                    </div>
                    <div>
                        <label htmlFor="">Type: </label>
                        {/* <select
                            name="type"
                            onChange={handleFilterChange}
                            value={filterData.type}
                            id=""
                        >
                            <option value="movie">Movie</option>
                            <option value="tv">Tv Show</option>
                        </select> */}
                        <DropDown
                            onChange={handleFilterChange}
                            name="type"
                            id="type"
                            value={filterData.type}
                            options={[
                                { name: "Movie", value: "movie" },
                                { name: "TV", value: "tv" },
                            ]}
                            minWidth="100"
                        />
                    </div>
                    <GenresSelect
                        name="genres"
                        label="Genres"
                        selected_genres={filterData.genres}
                        id={"id"}
                        value={"name"}
                        key={genres}
                        genres={filterData.type === "movie" ? MOVIE_GENRES : TV_GENRES}
                    />
                    <div>
                        <label htmlFor="watch_providers">OTT Platform: </label>
                        {/* <select
                            name="watch_providers"
                            onChange={handleFilterChange}
                            value={filterData.watch_providers}
                            id="watch_providers"
                        >
                            <option value="">All</option>
                            {(filterData.type === "movie"
                                ? MOVIE_WATCH_PROVIDERS
                                : TV_WATCH_PROVIDERS
                            ).map((provider) => (
                                <option key={provider.provider_id} value={provider.provider_id}>
                                    {provider.provider_name}
                                </option>
                            ))}
                        </select> */}
                        <DropDown
                            onChange={handleFilterChange}
                            name="watch_providers"
                            id="watch_providers"
                            value={filterData.watch_providers}
                            options={[
                                { name: "All", value: "" },
                                ...(filterData.type === "movie"
                                ? MOVIE_WATCH_PROVIDERS.map(provider=>({ name: provider.provider_name, value: provider.provider_id }))
                                : TV_WATCH_PROVIDERS.map(provider=>({ name: provider.provider_name, value: provider.provider_id })))
                            ]}
                            minWidth="200"
                            optionsPositon='top'
                        />
                    </div>
                    <div>
                        <label htmlFor="">Release Date: </label>
                        <div style={{ margin: "4px 0 4px 20px" }}>
                            <label htmlFor="">From: </label>
                            <input
                                type="date"
                                value={filterData.release_date_gte}
                                name="release_date_gte"
                                onChange={handleFilterChange}
                                id=""
                            />
                        </div>
                        <div style={{ margin: "0 0 4px 20px" }}>
                            <label htmlFor="">To: </label>
                            <input
                                type="date"
                                min={filterData.release_date_gte}
                                value={filterData.release_date_lte}
                                name="release_date_lte"
                                onChange={handleFilterChange}
                                id=""
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="">Sort by: </label>
                        {/* <select
                            name="sort_by"
                            onChange={handleFilterChange}
                            id=""
                            value={filterData.sort_by}
                        >
                            {FILTER_SORT_BY_VALUES.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.name}
                                </option>
                            ))}
                        </select> */}
                        <DropDown
                            onChange={handleFilterChange}
                            name="sort_by"
                            id="sort_by"
                            value={filterData.sort_by}
                            options={[
                                ...FILTER_SORT_BY_VALUES.map(item=>({ name: item.name, value: item.value }))
                            ]}
                            minWidth="260"
                            optionsPositon='bottom'
                        />
                    </div>
                    <button
                        type="submit"
                        className={`${!checkValueChanged() ? "disabled" : ""}`}
                        disabled={!checkValueChanged()}
                    >
                        Apply
                    </button>
                </form>
            </section>

            <PosterContainer
                title={`Filtered results`}
                media_type={type}
                data_types={[{ name: "Genre", value: "genre" }]}
                loadData={{ genre: false }}
                show_change_view={false}
                key={
                    genres +
                    language +
                    page +
                    include_adult +
                    original_language +
                    type +
                    sort_by +
                    watch_providers +
                    JSON.stringify(router.query)
                }
                show_pagination={true}
                current_page={page}
                link={generateLink()}
                all_data={{ genre: data }}
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

        const {
            language,
            page = 1,
            genres = "",
            type = "movie",
            include_adult = "no",
            sort_by = "vote_count.desc",
            original_language = "",
            watch_providers = "",
            release_date_gte = "",
            release_date_lte = "",
        } = query;
        const isregion = getCookie("region", { req, res });
        var region = {};
        if (isregion) {
            region = JSON.parse(getCookie("region", { req, res }));
        } else {
            const response = await fetch(`http://ip-api.com/json/${ip}`);
            const data = await response.json();
            region = {
                name: data.country,
                "alpha-2": data.countryCode,
                "country-code": "",
            };
            setCookie("region", region, { req, res });
        }
        const filter_data = await get({
            url: `/discover/${type}`,
            type: "tmdb_server",
            params: [
                { key: "language", value: language },
                { key: "with_genres", value: genres },
                { key: "page", value: page },
                { key: "with_original_language", value: original_language },
                { key: "with_watch_providers", value: watch_providers },
                { key: "sort_by", value: sort_by },
                { key: "primary_release_date.gte", value: release_date_gte },
                { key: "primary_release_date.lte", value: release_date_lte },
                { key: "watch_region", value: region["alpha-2"] ?? "IN" },
                { key: "include_adult", value: include_adult === "Yes" ? true : false },
            ],
        });
        return {
            props: {
                data: filter_data,
            },
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
}
