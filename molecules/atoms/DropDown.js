import { useEffect, useRef, useState, memo } from "react";

function DropDown({ options, value, onChange, name, id,minWidth,optionsPositon }) {
    const optionsElement = useRef(null);
    const [dropdownOptions, setdropdownOptions] = useState({open:false,position:'bottom'});

    useEffect(() => {
      window.addEventListener('click',handleClickOutside)
      window.addEventListener('scroll',handleScroll)
      return () => {
        window.removeEventListener('click',handleClickOutside)
        window.removeEventListener('scroll',handleScroll)
      }
    }, [])
    
    // useEffect(() => {
    //     console.log(optionsElement?.current?.classList);
    //   return () => {
        
    //   }
    // }, [])
    
    function handleScroll(e) {
        if (e.target.id!==`${id}-value` && optionsElement.current.classList.contains('open')) {
            setdropdownOptions(prev=>({...prev,open:false}))
        }
    }
    function handleClickOutside(e) {
        if ((e.target.id!==`${id}-value` || e.target.classList.contains('dropdown-option')) && optionsElement.current.classList.contains('open')) {
            setdropdownOptions(prev=>({...prev,open:false}))
        }
    }
    function handleChange(option) {
        setdropdownOptions(prev=>({...prev,open:!prev.open}))
        onChange({ target: { value: option.value, name } });
    }
    function handleDropdownCollapse(e) {
        var h = window.innerHeight;
        var pageYOffset = window.pageYOffset;
        console.log({h,pageY:e.pageY,offset:window.pageYOffset});
        // $('.clickme').on('click', function(e) { 
        // alert(h + ", " + e.pageY);
        console.log((e.pageY - pageYOffset));

        // });
        if (e.target.id === `${id}-value`) {
            e.preventDefault();
            if( (e.pageY - pageYOffset) < 250) {
                // $('#popup').offset({ top: h-125, left:  e.pageX}).fadeIn();
                // var removed=optionsElement.current.classList.contains('top') && optionsElement.current.classList.remove("top");
                console.log("show bottom ");
                setdropdownOptions(prev=>({open:!prev.open,position:'bottom'}))
            }
            else {
                // $('#popup').offset({ top: e.pageY, left:  e.pageX}).fadeIn();
                console.log("show top ");
                setdropdownOptions(prev=>({open:!prev.open,position:'top'}))
            }
                
        }
    }
    function handleBlur(e) {
        console.log("blur");

    }
    return (
        <div id={id} style={{'width':`${minWidth}px`}} className="dropdown-container">
            <button
                id={`${id}-value`}
                onClick={handleDropdownCollapse}
                className="dropdown-value"
                // onBlur={handleBlur}
            >
                {options.find((option) => option.value === value).name}{" "}
                <i class="fa-solid fa-chevron-down"></i>
            </button>
            <div ref={optionsElement} id={`${id}-options`} className={`dropdown-options${dropdownOptions.open?' open':''} ${dropdownOptions.position}`}>
                {options.map((option) => (
                    <span
                        className={`dropdown-option ${option.value === value?'active':''}`}
                        onClick={(e) => {
                            // e.preventDefault();
                            handleChange(option);
                        }}
                        key={option.value}
                    >
                        {option.name}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default memo(DropDown)