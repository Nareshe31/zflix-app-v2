import { useRouter } from "next/router";
import PosterContainer from "../../../molecules/PosterContainer";
import { get } from "../../../service/api-fetch";
import { getCookie, setCookie } from 'cookies-next';
import PageHead from "../../../molecules/PageHead";
import { overview } from "../../../utils/functions";
import { useState } from "react";
import LANGUAGE_CODES from '../../../utils/language-codes'

export default function SearchPage() {
    const router=useRouter()
    const {language,query="",page=1,type="all",lang="en-US",include_adult="no"}=router.query
    const region=getCookie('region')?JSON.parse(getCookie('region')):{"name": "",
    "alpha-2": "",
    "country-code": ""}

    const [searchData, setsearchData] = useState({query,type,include_adult})

    const api_endpoints={
        all:"/search/multi",
        movie:"/search/movie",
        tv:"/search/tv"
    }

    function handleChange(e) {
        const {name,value}=e.target
        console.log({name,value});
        setsearchData(prev=>({...prev,[name]:value}))
    }
    function handleSubmit(e) {
        e.preventDefault()
        const encodedQuery=searchData.query.replace(/\s+/g, "+")
        router.push(`/${language}/search?query=${encodedQuery}&type=${searchData.type}&include_adult=${searchData.include_adult}`)
    }
    return (
        <>
             <PageHead
                title={`${query} / ZFlix`}
                overview={overview}
                image_path="/icons/apple-touch-icon.png"
            />
            <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input onChange={handleChange} value={searchData.query} type="search" name="query" id="query" placeholder="What are you looking for?" />
                    </div>
                    <div>
                        <select onChange={handleChange} value={searchData.type} name="type" id="">
                            <option value="all">All</option>
                            <option value="movie">Movie</option>
                            <option value="tv">TV Show</option>
                        </select>
                    </div>
                    <div>
                        <select name="include_adult" onChange={handleChange} value={searchData.include_adult} id="">
                            <option value="" disabled selected>Include adult results?</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    <div>
                        <button style={{"background":"#555","color":"white","padding":"6px 16px"}} type="submit">Apply</button>
                    </div>
                </form>
            </div>
            <PosterContainer
                title={`Search results for "${query}"`}
                media_type={["movie","tv"].includes(type)?type:undefined}
                data_types={[{name:"Search",value:"search"}]}
                loadData={{search:true}}
                show_media_type={true}
                show_change_view={false}
                key={query+type+language+page+include_adult}
                pagination={true}
                current_page={page}
                meta_data={{search:{
                    url: api_endpoints[type],
                    type: "tmdb",
                    params: [
                        { key: "language", value: language },
                        { key: "query", value: query },
                        { key: "page", value: page },
                        { key: "include_adult", value: searchData.include_adult==="Yes"?true:false },
                        {key:"region",value:region["alpha-2"]}
                    ],
                }}}
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
