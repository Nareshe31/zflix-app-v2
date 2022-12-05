import { useRouter } from "next/router";
import { getCookie, setCookie } from "cookies-next";
import { useRef, useState } from "react";
import PageHead from "../../../molecules/PageHead";
import PosterContainer from "../../../molecules/PosterContainer";
import { get } from "../../../service/api-fetch";
import { overview } from "../../../utils/functions";
import {
    FILTER_SORT_BY_VALUES,
    LANGUAGE_CODES,
    MOVIE_GENRES,
    TV_GENRES,
} from "../../../utils/language-codes";

export default function MovieGenre({ data }) {
    const router = useRouter();
    const {
        language,
        genres,
        type = "movie",
        page = 1,
        include_adult = "no",
        with_original_language = "",
        sort_by = "popularity.desc",
    } = router.query;
    const [filterData, setfilterData] = useState({
        genres: genres.split(","),
        type,
        include_adult,
        with_original_language,
    });

    const formRef = useRef(null)

    function generateLink() {
        const link = `/${language}/filter?genres=${genres}&with_original_language=${with_original_language}&type=${type}&sort_by=${sort_by}`;
        return link;
    }
    function handleGenreChange(genre) {
        const id = String(genre.id);
        const filterDataTemp = filterData;
        if (filterData.genres.includes(id)) {
            filterData.genres = filterData.genres.filter((prev) => prev !== id);
        } else {
            filterData.genres = [...filterData.genres, id];
        }
        setfilterData((prev) => ({ ...prev, filterDataTemp }));
    }

    function handleFilterChange(event) {
        const { name, value } = event.target;
        const filterDataTemp = filterData;
        filterData[name] = value;
        if (name === "type") {
            filterData.genres = [];
        }
        setfilterData((prev) => ({ ...prev, filterDataTemp }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        const link = `/${language}/filter?genres=${filterData.genres.join(
            ","
        )}&with_original_language=${filterData.with_original_language}&type=${filterData.type
            }&sort_by=${filterData.sort_by}`;
        router.push(link);
    }
    // const genre_name = String(name)[0].toUpperCase() + String(name).slice(1);

    function GenresSelect({ selected_genres, genres }) {
        return (
            <div>
                <label htmlFor="">Genres: </label>

                <div className="filter-genres" key={selected_genres}>
                    {/* <div>{selected_genres.map(genre=><span key={genre}>{genres.filter[genre]}</span>)}</div> */}
                    {/* <div> */}
                    {genres.map((genre) => (
                        <button
                            className={`${selected_genres.includes(String(genre.id)) ? "active" : ""
                                } filter-genre`}
                            onClick={() => handleGenreChange(genre)}
                            key={genre.id}
                            data-value={genre.id}
                        >
                            {genre.name}
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
                <div className="filter-head" onClick={()=>formRef.current.classList.toggle('hide')}>
                    <h2>Filter</h2>
                    <div><i class="fa-solid fa-circle-chevron-down"></i></div>
                </div>
                <form
                    onSubmit={handleSubmit}
                    action={``}
                    ref={formRef}
                >
                    <div>
                        <label htmlFor="">Language: </label>
                        <select
                            name="with_original_language"
                            onChange={handleFilterChange}
                            id=""
                            value={filterData.with_original_language}
                        >
                            <option value="" selected>
                                All
                            </option>
                            {LANGUAGE_CODES.map((lang) => (
                                <option key={lang.iso_639_1} value={lang.iso_639_1}>
                                    {lang.english_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="">Type: </label>
                        <select
                            name="type"
                            onChange={handleFilterChange}
                            value={filterData.type}
                            id=""
                        >
                            <option value="movie">Movie</option>
                            <option value="tv">Tv Show</option>
                        </select>
                    </div>
                    <GenresSelect
                        selected_genres={filterData.genres}
                        genres={filterData.type === "movie" ? MOVIE_GENRES : TV_GENRES}
                    />
                    <div>
                        <label htmlFor="">Sort by: </label>
                        <select
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
                        </select>
                    </div>
                    <button
                        style={{
                            background: "#222",
                            color: "#ccc",
                            padding: "4px 10px",
                            fontSize: "15px",
                            margin:"10px 0"
                        }}
                        type="submit"
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
                    with_original_language +
                    type +
                    sort_by
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
            name,
            genres,
            type = "movie",
            include_adult = "no",
            sort_by = "popularity.desc",
            with_original_language = "",
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
        const genre_data = await get({
            url: `/discover/${type}`,
            type: "tmdb",
            params: [
                { key: "language", value: language },
                { key: "with_genres", value: genres },
                { key: "page", value: page },
                { key: "with_original_language", value: with_original_language },
                { key: "sort_by", value: sort_by },
                { key: "include_adult", value: include_adult === "Yes" ? true : false },
                // {key:"region",value:region["alpha-2"]}
            ],
        });
        return {
            props: {
                data: genre_data,
            },
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
}
