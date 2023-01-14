import { useRouter } from "next/router";
import PosterContainer from "../../../../molecules/PosterContainer";
import { getCookie, setCookie } from "cookies-next";
import PageHead from "../../../../molecules/PageHead";
import { overview } from "../../../../utils/functions";
import { useEffect, useRef, useState } from "react";
import { get } from "../../../../service/api-fetch";

export default function TvPage({data}) {
    const router = useRouter();
    const { language,type="day",page=1 } = router.query;
    const region = getCookie("region")
        ? JSON.parse(getCookie("region"))
        : { name: "India", "alpha-2": "IN", "country-code": "" };

    return (
        <>
            <PageHead
                title={"Trending Shows / ZFlix"}
                overview={overview}
                image_path="/icons/apple-touch-icon.png"
            />
            <PosterContainer
                title={`Trending shows`}
                media_type="movie"
                data_types={[{ name: "trending", value: "trending" }]}
                loadData={{ trending: false }}
                view="vertical"
                show_pagination={true}
                current_page={page}
                link={`/${language}/tv-shows/trending?type=${type}`}
                key={type + language + page}
                // show_change_view={true}
                all_data={{trending:data}}                
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

        const { language, page = 1, type = "day" } = query;
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
        const trending_tv_data = await get({
            url: `/trending/tv/${type}`,
            type: "tmdb_client",
            params: [
                { key: "language", value: language },
                { key: "page", value: page },
                { key: "region", value: region["alpha-2"] },
            ],
        });
        return {
            props: {
                data: trending_tv_data,
            },
        };
    } catch (error) {
        console.log(error.message);
        return {
            notFound: true,
        };
    }
}
