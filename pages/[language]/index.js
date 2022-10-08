import Home from "../../components/home";
import { get } from "../../service/api-fetch";

export default function HomePage({
    movie_data_day,
    movie_data_week,
    tv_data_day,
    tv_data_week,
}) {
    return <Home movie_data_day={movie_data_day} movie_data_week={movie_data_week} tv_data_day={tv_data_day} tv_data_week={tv_data_week} />;
}

export async function getServerSideProps(context) {
    try {
        const { language } = context.query;
        const movie_data_day = await get({
            url: `/trending/movie/day`,
            type: "tmdb",
            params: [{ key: "language", value: language }],
        });
        const movie_data_week = await get({
            url: `/trending/movie/week`,
            type: "tmdb",
            params: [{ key: "language", value: language }],
        });
        const tv_data_day = await get({
            url: `/trending/tv/day`,
            type: "tmdb",
            params: [{ key: "language", value: language }],
        });
        const tv_data_week = await get({
            url: `/trending/tv/week`,
            type: "tmdb",
            params: [{ key: "language", value: language }],
        });
        return {
            props: {
                movie_data_day,
                movie_data_week,
                tv_data_day,
                tv_data_week,
            },
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
}
