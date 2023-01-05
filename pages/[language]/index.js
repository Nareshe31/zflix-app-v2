import Home from "../../components/home";
import { get } from "../../service/api-fetch";

export default function HomePage() {
    return <Home  />;
}

export async function getServerSideProps(context) {
    try {
        const { language } = context.query;
        // const movie_data_day = await get({
        //     url: `/trending/movie/day`,
        //     type: "tmdb",
        //     params: [{ key: "language", value: language }],
        // });
        return {
            props: {
            },
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
}
