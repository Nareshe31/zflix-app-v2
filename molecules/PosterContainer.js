import PosterHeader from './PosterHeader'
import Poster from './Poster'
import { useMemo, useState } from 'react'

export default function PosterContainer({title,data_day,data_week,type}){
    const [data_type, setdata_type] = useState('day')
    const data=useMemo(() => data_type==="day"?data_day:data_week, [data_type])  
    return(
        <section className="posters_section">
            <PosterHeader title={title} data_type={setdata_type} data={data_type}/>
            <div className="items">
                {data?.results?.map(item=>(
                    <Poster type={type} key={item.id} item={item} />
                ))}
            </div>
        </section>
    )
}