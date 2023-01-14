import Link from "next/link";
import { useEffect, useState } from "react";
import DropDown from "./atoms/DropDown";

export default function Header({
    title,
    change_data_type,
    data,
    data_types,
    change_view,
    containerview,
    show_change_view,
    see_all_link
}) {

    useEffect(() => {
      document.body.addEventListener('resize',handleResize) 
    
      return () => {
        document.body.removeEventListener('resize',handleResize)
      }
    }, [])
    
    function handleResize(e) {
        console.log(window.innerHeight,window.innerWidth);
    }
    return (
        <header>
            <div className="left">
                <h3>{title}</h3>
                {/* {data_types.length > 1 ? (
                    <div className="type">
                        {data_types.map((type, index) => (
                            <button
                                key={index + type}
                                className={data === type.value ? "active" : ""}
                                onClick={() => type.value!==data?change_data_type(type.value):null}
                            >
                                {type.name}
                            </button>
                        ))}
                    </div>
                ) : null} */}
                 {data_types.length > 1 ? (
                        <DropDown
                            onChange={(e) =>
                                e.target.value!==data?change_data_type(e.target.value):null
                            }
                            name={String(title).toLowerCase().split(' ').join('-')+"-type"}
                            id={String(title).toLowerCase().split(' ').join('-')+"-type"}
                            value={data}
                            options={data_types.map((type, index) => ({name:type.name,value:type.value}))}
                            minWidth="100"
                        />
                ) : null}
            </div>
            <div className="right">
                <span><Link href={`${see_all_link}`}>See all</Link></span>
                {show_change_view?
                <button
                    onClick={() => {
                        // posterSectionRef.current.classList.toggle('hide');
                        // setisHide(prev=>!prev)
                        change_view();
                    }}
                >
                    {containerview === "horizontal" ? (
                        <i className="fa-solid fa-grip-vertical"></i>
                    ) : (
                        <i className="fa-solid fa-grip"></i>
                    )}
                </button>
                :
                    null
                }
            </div>
        </header>
    );
}
