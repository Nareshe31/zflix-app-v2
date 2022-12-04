import PageHead from "../../../../../molecules/PageHead";
import PosterContainer from "../../../../../molecules/PosterContainer";
import { useRouter } from "next/router";
import { getCookie, setCookie } from "cookies-next";
import { get } from "../../../../../service/api-fetch";
import { overview } from "../../../../../utils/functions";
import {
    LANGUAGE_CODES,
    MOVIE_GENRES,
} from "../../../../../utils/language-codes";
import { useState } from "react";

export default function MovieGenre({ data }) {
    const router = useRouter();
    const {
        language,
        id,
        page = 1,
        include_adult = "no",
        name,
        with_original_language = "",
    } = router.query;
    const [genres, setgenres] = useState(id.split(","));
    const [originaLanguage, setoriginaLanguage] = useState(
        with_original_language
    );
    function generateLink() {
        const link = `/${language}/genre/movie/${name}?id=${genres.join(
            ","
        )}&with_original_language=${with_original_language}`;
        return link;
    }
    function handleGenreChange(genre) {
        const id=String(genre.id)
        if (genres.includes(id)) {
            setgenres((prev) => prev.filter((prev) => prev !== id));
        } else {
            setgenres((prev) => [...prev, id]);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const link = `/${language}/genre/movie/${name}?id=${genres.join(
            ","
        )}&with_original_language=${originaLanguage}`;
        router.push(link);
    }
    const genre_name = String(name)[0].toUpperCase() + String(name).slice(1);

    function GenresSelect({genres}) {
        return(
            <div key={genres}>
                {MOVIE_GENRES.map((genre) => (
                    <span
                        onClick={() => handleGenreChange(genre)}
                        key={genre.id}
                        style={{
                            color: `${genres.includes(String(genre.id)) ? "red" : "white"}`,
                        }}
                        data-value={genre.id}
                    >
                        {genre.name}
                    </span>
                ))}
            </div>
        )
    }
    return (
        <>
            <PageHead
                title={`${genre_name} movies / ZFlix`}
                overview={overview}
                image_path="/icons/apple-touch-icon.png"
            />
            <div>
                <form onSubmit={handleSubmit} action={``}>
                    <div>
                        <select
                            name="with_original_language"
                            onChange={(e) => setoriginaLanguage(e.target.value)}
                            id=""
                        >
                            {LANGUAGE_CODES.map((lang) => (
                                <option key={lang.iso_639_1} value={lang.iso_639_1}>
                                    {lang.english_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <GenresSelect genres={genres} />
                    <button style={{ background: "#333", color: "#aaa" }} type="submit">
                        Filter
                    </button>
                </form>
            </div>
            <PosterContainer
                title={`${genre_name} movies`}
                media_type={"movie"}
                data_types={[{ name: "Genre", value: "genre" }]}
                loadData={{ genre: false }}
                show_change_view={false}
                key={id + language + page + include_adult + name+ with_original_language}
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
            id,
            include_adult = "no",
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
            url: `/discover/movie`,
            type: "tmdb",
            params: [
                { key: "language", value: language },
                { key: "with_genres", value: id },
                { key: "page", value: page },
                { key: "with_original_language", value: with_original_language },
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
