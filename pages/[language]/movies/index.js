import { useRouter } from "next/router";
import PosterContainer from "../../../molecules/PosterContainer";
import { get } from "../../../service/api-fetch";
import { getCookie, setCookie } from 'cookies-next';
import PageHead from "../../../molecules/PageHead";
import { overview } from "../../../utils/functions";

export default function MoviePage() {
    const router=useRouter()
    const {language}=router.query
    const region=getCookie('region')?JSON.parse(getCookie('region')):{"name": "",
    "alpha-2": "",
    "country-code": ""}
    return (
        <>
             <PageHead
                title={"Movies / ZFlix"}
                overview={overview}
                image_path="/icons/apple-touch-icon.png"
            />
            <PosterContainer
                title={"Upcoming movies"}
                media_type="movie"
                data_types={[{name:"Upcoming",value:"upcoming"}]}
                loadData={{upcoming:true}}
                meta_data={{upcoming:{
                    url: `/movie/upcoming`,
                    type: "tmdb",
                    params: [
                        { key: "language", value: language },
                        { key: "page", value: 1 },
                        {key:"region",value:region["alpha-2"]}
                    ],
                }}}
            />
            <PosterContainer
                title={`Popular movies in ${region.name}`}
                loadData={{popular:true}}
                meta_data={{popular:{
                    url: `/movie/popular`,
                    type: "tmdb",
                    params: [
                        { key: "language", value: language },
                        { key: "page", value: 1 },
                        {key:"region",value:region["alpha-2"]}
                    ],
                }}}
                media_type="movie"
                data_types={[{name:"Popular",value:"popular"}]}
            />
            <PosterContainer
                title={"Top rated movies"}
                loadData={{top_rated:true}}
                meta_data={{top_rated:{
                    url: `/movie/top_rated`,
                    type: "tmdb",
                    params: [
                        { key: "language", value: language },
                        { key: "page", value: 1 },
                        {key:"region",value:region["alpha-2"]}
                    ],
                }}}
                media_type="movie"
                data_types={[{name:"Top rated",value:"top_rated"}]}
            />
        </>
    );
}

export async function getServerSideProps({ query, req,res }) {
    try {
        const forwarded = req.headers["x-forwarded-for"];
        const ip = forwarded
            ? forwarded.split(/, /)[0]
            : req.connection.remoteAddress;
       
        const { language } = query;
        const isregion=getCookie('region',{req,res})
        var region={}
        if (isregion) {
            region=JSON.parse(getCookie('region',{req,res}))
        }
        else{
            const response=await fetch(`http://ip-api.com/json/${ip}`)
            const data=await response.json()
            region={"name": data.country,
            "alpha-2": data.countryCode,
            "country-code": ""}
            setCookie('region',region,{req,res})
        }
        // const movie_data_upcoming = await get({
        //     url: `/movie/upcoming`,
        //     type: "tmdb",
        //     params: [{ key: "language", value: language },{key:'page',value:1},{key:"region",value:region["alpha-2"]}],
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
