import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageHead from "../../molecules/PageHead";
import PosterContainer from "../../molecules/PosterContainer";
import { overview } from "../../utils/functions";
import { setCookie } from 'cookies-next';

export default function Home() {
    const router=useRouter()
    const {language}=router.query

    const [isocodes, setisocodes] = useState([])
    useEffect(() => {
      getISOCode()
      return () => {
      }
    }, [])
    
    const getISOCode=async()=>{
        try {
            const response=await fetch('https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/slim-2/slim-2.json')
            const data=await response.json()
            setisocodes(data)
        } catch (error) {
            
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
                meta_data={{week:{
                    url: `/trending/movie/week`,
                    type: "tmdb",
                    params: [
                        { key: "language", value: language }
                    ],
                },
                day:{
                    url: `/trending/movie/day`,
                    type: "tmdb",
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
                meta_data={{
                    day:{
                        url: `/trending/tv/day`,
                        type: "tmdb",
                        params: [
                            { key: "language", value: language }
                        ],
                    },
                    week:{
                    url: `/trending/tv/week`,
                    type: "tmdb",
                    params: [
                        { key: "language", value: language }
                    ],
                }}}
            />
        </>
    );
}
