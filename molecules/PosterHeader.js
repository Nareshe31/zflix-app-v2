import { useState } from "react";

export default function Header({title,data_type,data,data_types,change_view,containerview}){
    return(
        <header>
            <div className="left">
            <h3>{title}</h3>
            {
                data_types.length>1?
                    <div className="type">
                        {data_types.map((type,index)=><button key={index+type} className={data===type.value?"active":""} onClick={()=>data_type(type.value)}>{type.name}</button>)}
                    </div>
                    :null
                }
            </div>
            <button onClick={()=>{
                // posterSectionRef.current.classList.toggle('hide');
                // setisHide(prev=>!prev)
                change_view(prev=>prev==="vertical"?"horizontal":"vertical")
            }}>
                {
                    containerview==="horizontal"?
                    <i class="fa-solid fa-grip-vertical"></i>
                    :
                    <i class="fa-solid fa-grip"></i>
                }
            </button>
        </header>
    )
}