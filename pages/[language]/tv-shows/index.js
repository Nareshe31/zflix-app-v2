import { useRouter } from "next/router";
import PosterContainer from "../../../molecules/PosterContainer";
import { get } from "../../../service/api-fetch";

export default function TvPage({tv_data_on_the_air}) {
    const router=useRouter()
    const {language}=router.query
    return (
        <div>
             
            <PosterContainer
                title={"Now airing shows"}
                media_type="tv"
                all_data={{on_the_air:tv_data_on_the_air}}
                data_types={[{name:"Airing",value:"on_the_air"}]}
                loadData={{on_the_air:false}}
            />
            <PosterContainer
                title={"Popular shows"}
                loadData={{popular:true}}
                meta_data={{popular:{
                    url: `/tv/popular`,
                    type: "tmdb",
                    params: [
                        { key: "language", value: language },
                        { key: "page", value: 1 },
                    ],
                }}}
                media_type="tv"
                data_types={[{name:"Popular",value:"popular"}]}
            />
            <PosterContainer
                title={"Top rated shows"}
                loadData={{top_rated:true}}
                meta_data={{top_rated:{
                    url: `/tv/top_rated`,
                    type: "tmdb",
                    params: [
                        { key: "language", value: language },
                        { key: "page", value: 1 },
                    ],
                }}}
                media_type="tv"
                data_types={[{name:"Top rated",value:"top_rated"}]}
            />
        </div>
    );
}

export async function getServerSideProps({ query, req }) {
    try {
        const forwarded = req.headers["x-forwarded-for"];
        const ip = forwarded
            ? forwarded.split(/, /)[0]
            : req.connection.remoteAddress;
       
        const { language } = query;
        console.log('====================================');
        console.log("tv show");
        console.log('====================================');
        // const movie_data_popular = await get({
        //     url: `/movie/popular`,
        //     type: "tmdb",
        //     params: [
        //         { key: "language", value: language },
        //         { key: "page", value: 1 },
        //     ],
        // });
        // const movie_data_top_rated = await get({
        //     url: `/movie/top_rated`,
        //     type: "tmdb",
        //     params: [{ key: "language", value: language },{key:'page',value:1}],
        // });
        const tv_data_on_the_air = await get({
            url: `/tv/on_the_air`,
            type: "tmdb",
            params: [{ key: "language", value: language },{key:'page',value:1},{key:"region",value:"IN"}],
        });
        return {
            props: {
                // movie_data_popular,
                // movie_data_top_rated,
                tv_data_on_the_air
            },
        };
    } catch (error) {
        console.log(error.message);
        return {
            notFound: true,
        };
    }
}
