
export default function Header({title,data_type,data}){
    const data_types=[{name:"Day",value:"day"},{name:"Week",value:"week"}]
    return(
        <header>
            <h3>{title}</h3>
            <div className="type">
                {data_types.map((type,index)=><button key={index+type} className={data===type.value?"active":""} onClick={()=>data_type(type.value)}>{type.name}</button>)}
            </div>
        </header>
    )
}