import Home from "../../components/home";
import { get } from "../../service/api-fetch";

export default function HomePage({
    movie_data_day
}) {
    return <Home movie_data_day={movie_data_day}  />;
}

export async function getServerSideProps(context) {
    try {
        const { language } = context.query;
        const movie_data_day = await get({
            url: `/trending/movie/day`,
            type: "tmdb",
            params: [{ key: "language", value: language }],
        });
        return {
            props: {
                movie_data_day
            },
        };
    } catch (error) {
        console.log(error.message);
        return {
            notFound: true,
        };
    }
}
