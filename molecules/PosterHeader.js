import { useState } from "react";

export default function Header({
    title,
    change_data_type,
    data,
    data_types,
    change_view,
    containerview,
    show_change_view
}) {
    return (
        <header>
            <div className="left">
                <h3>{title}</h3>
                {data_types.length > 1 ? (
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
                ) : null}
            </div>
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
        </header>
    );
}
