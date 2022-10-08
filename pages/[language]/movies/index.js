import PosterContainer from "../../../molecules/PosterContainer";
import { get } from "../../../service/api-fetch";

export default function MoviePage(props) {
    const {movie_data_popular,movie_data_top_rated,movie_data_upcoming}=props
    return(
        <div>
            <PosterContainer title={"Upcoming movies"} type="movie" data_day={movie_data_upcoming} />
            <PosterContainer title={"Popular movies"} type="movie" data_day={movie_data_popular} />
            <PosterContainer title={"Top rated movies"} type="movie" data_day={movie_data_top_rated} />
        </div>
    )
}

export async function getServerSideProps({query,req}) {
    try {
        const forwarded = req.headers["x-forwarded-for"]
        const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
        const response=await fetch(`https://ipapi.co/${ip}/json`)
        const data=await response.json()
        console.log({ip,data});
        const { language } = query;
        const movie_data_popular = await get({
            url: `/movie/popular`,
            type: "tmdb",
            params: [{ key: "language", value: language },{key:'page',value:1}],
        });
        const movie_data_top_rated = await get({
            url: `/movie/top_rated`,
            type: "tmdb",
            params: [{ key: "language", value: language },{key:'page',value:1}],
        });
        const movie_data_upcoming = await get({
            url: `/movie/upcoming`,
            type: "tmdb",
            params: [{ key: "language", value: language },{key:'page',value:1},{key:"region",value:"IN"}],
        });
        return {
            props: {
                movie_data_popular,
                movie_data_top_rated,
                movie_data_upcoming
            },
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
}
