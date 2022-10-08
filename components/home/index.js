import PageHead from "../../molecules/PageHead";
import PosterContainer from "../../molecules/PosterContainer";
import { overview } from "../../utils/functions";

export default function Home({movie_data_day,movie_data_week,tv_data_day,tv_data_week}) {
    return(
        <>
            <PageHead title={"ZFlix - Watch Movies & TV Shows"} overview={overview} image_path="/icons/apple-touch-icon.png" />
            <PosterContainer title={"Trending movies"} type="movie" data_day={movie_data_day} data_week={movie_data_week} />
            <PosterContainer title={"Trending shows"} type="tv" data_day={tv_data_day} data_week={tv_data_week} />
        </>
    )
}