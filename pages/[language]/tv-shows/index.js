import { useRouter } from "next/router";
import PageHead from "../../../molecules/PageHead";
import PosterContainer from "../../../molecules/PosterContainer";
import { overview } from "../../../utils/functions";
import { getCookie, setCookie } from 'cookies-next';

export default function TvPage() {
    const router=useRouter()
    const {language}=router.query
    const region=getCookie('region')?JSON.parse(getCookie('region')):{"name": "India",
    "alpha-2": "IN",
    "country-code": ""}
    return (
        <div>
            <PageHead
                title={"TV Shows / ZFlix"}
                overview={overview}
                image_path="/icons/apple-touch-icon.png"
            />
            <PosterContainer
                title={"Now airing shows"}
                media_type="tv"
                data_types={[{name:"Airing",value:"on_the_air"}]}
                loadData={{on_the_air:true}}
                meta_data={{on_the_air:{
                    url: `/tv/on_the_air`,
                    type: "tmdb_client",
                    params: [
                        { key: "language", value: language },
                        { key: "page", value: 1 },
                        {key:"region",value:region["alpha-2"]}
                    ],
                }}}
            />
            <PosterContainer
                title={"Popular shows"}
                loadData={{popular:true}}
                meta_data={{popular:{
                    url: `/tv/popular`,
                    type: "tmdb_client",
                    params: [
                        { key: "language", value: language },
                        { key: "page", value: 1 },
                        {key:"region",value:region["alpha-2"]}
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
                    type: "tmdb_client",
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

export async function getServerSideProps({ query, req, res }) {
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
            region={"name": data.country??"India",
            "alpha-2": data.countryCode??"IN",
            "country-code": ""}
            setCookie('region',region,{req,res})
        }
       
        return {
            props: {
            },
        };
    } catch (error) {
        console.log(error.message);
        return {
            notFound: true,
        };
    }
}
