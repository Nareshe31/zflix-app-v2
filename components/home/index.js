import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageHead from "../../molecules/PageHead";
import PosterContainer from "../../molecules/PosterContainer";
import { overview } from "../../utils/functions";
import { getCookie, setCookie } from 'cookies-next';

export default function Home() {
    const router=useRouter()
    const {language}=router.query

    const region=getCookie('region')?JSON.parse(getCookie('region')):{"name": "India",
    "alpha-2": "IN",
    "country-code": ""}

    const [isocodes, setisocodes] = useState([])
    useEffect(() => {
    //   getISOCode()
      return () => {
      }
    }, [])
    
    const getISOCode=async()=>{
        try {
            const response=await fetch('https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/slim-2/slim-2.json')
            const data=await response.json()
            setisocodes(data)
        } catch (error) {
            console.log("hello ",error.message);
        }
    }

    return (
        <>
            {/* <select onChange={(e)=>{setCookie("region",e.target.value)}} name="codes" id="codes">
                {isocodes.map((code)=><option key={JSON.stringify(code)} value={JSON.stringify(code)}>{code.name}</option>)}
                
            </select> */}
            <PageHead
                title={"Explore / ZFlix"}
                overview={overview}
                image_path="/icons/apple-touch-icon.png"
            />
            <PosterContainer
                title={"Trending movies"}
                media_type="movie"
                data_types={[{name:"Day",value:"day"},{name:"Week",value:"week"}]}
                loadData={{day:true,week:true}}
                // show_change_view={true}
                view="horizontal"
                meta_data={{week:{
                    url: `/trending/movie/week`,
                    type: "tmdb_client",
                    params: [
                        { key: "language", value: language }
                    ],
                },
                day:{
                    url: `/trending/movie/day`,
                    type: "tmdb_client",
                    params: [
                        { key: "language", value: language }
                    ],
                }
            }}
            />
            <PosterContainer
                title={"Trending shows"}
                media_type="tv"
                data_types={[{name:"Day",value:"day"},{name:"Week",value:"week"}]}
                loadData={{day:true,week:true}}
                // show_change_view={true}
                view="horizontal"
                meta_data={{
                    day:{
                        url: `/trending/tv/day`,
                        type: "tmdb_client",
                        params: [
                            { key: "language", value: language }
                        ],
                    },
                    week:{
                    url: `/trending/tv/week`,
                    type: "tmdb_client",
                    params: [
                        { key: "language", value: language }
                    ],
                }}}
            />
            <PosterContainer
                title={"Popular Movies in"}
                media_type="movie"
                data_types={[{name:"Netflix",value:"netflix"},{name:"Hotstar",value:"hotstar"},{name:"Prime",value:"prime"}]}
                loadData={{netflix:true,hotstar:true,prime:true}}
                // show_change_view={true}
                view="horizontal"
                meta_data={{
                    netflix:{
                        url: `/discover/movie`,
                        type: "tmdb_client",
                        params: [
                            { key: "language", value: language },
                            { key: "with_genres", value: "" },
                            { key: "page", value: 1 },
                            { key: "with_watch_providers", value: 8 },
                            { key: "watch_region", value: region["alpha-2"] },
                        ],
                    },
                    hotstar:{
                        url: `/discover/movie`,
                        type: "tmdb_client",
                        params: [
                            { key: "language", value: language },
                            { key: "with_genres", value: "" },
                            { key: "page", value: 1 },
                            { key: "with_watch_providers", value: 122 },
                            { key: "watch_region", value: region["alpha-2"] },
                        ],
                    },
                    prime:{
                        url: `/discover/movie`,
                        type: "tmdb_client",
                        params: [
                            { key: "language", value: language },
                            { key: "with_genres", value: "" },
                            { key: "page", value: 1 },
                            { key: "with_watch_providers", value: 119 },
                            { key: "watch_region", value: region["alpha-2"] },
                        ],
                    }
                }}
            />
             <PosterContainer
                title={"Popular Shows in"}
                media_type="tv"
                data_types={[{name:"Netflix",value:"netflix"},{name:"Hotstar",value:"hotstar"},{name:"Prime",value:"prime"}]}
                loadData={{netflix:true,hotstar:true,prime:true}}
                // show_change_view={true}
                view="horizontal"
                meta_data={{
                    netflix:{
                        url: `/discover/tv`,
                        type: "tmdb_client",
                        params: [
                            { key: "language", value: language },
                            { key: "with_genres", value: "" },
                            { key: "page", value: 1 },
                            { key: "with_watch_providers", value: 8 },
                            { key: "watch_region", value: region["alpha-2"] },
                        ],
                    },
                    hotstar:{
                        url: `/discover/tv`,
                        type: "tmdb_client",
                        params: [
                            { key: "language", value: language },
                            { key: "with_genres", value: "" },
                            { key: "page", value: 1 },
                            { key: "with_watch_providers", value: 122 },
                            { key: "watch_region", value: region["alpha-2"] },
                        ],
                    },
                    prime:{
                        url: `/discover/tv`,
                        type: "tmdb_client",
                        params: [
                            { key: "language", value: language },
                            { key: "with_genres", value: "" },
                            { key: "page", value: 1 },
                            { key: "with_watch_providers", value: 119 },
                            { key: "watch_region", value: region["alpha-2"] },
                        ],
                    }
                }}
            />
        </>
    );
}
