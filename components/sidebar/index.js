import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export default function Sidebar({ }) {
    const router = useRouter();
    const language = router.query.language || 'en';
    const expandSidebar = () => {
        const sidebar = document.querySelector("#sidebar");
        const asideRight = document.body;
        // ("#aside-right");
        if (sidebar.classList.contains("expand")) {
            const scrollY = asideRight.style.top;
            asideRight.style.position = "";
            asideRight.style.top = "";
            window.scrollTo(0, parseInt(scrollY || "0") * -1);
            sidebar.classList.remove("expand");
        } else {
            const top = window.scrollY;
            asideRight.style.position = "fixed";
            asideRight.style.top = `-${top}px`;
            sidebar.classList.add("expand");
        }
    };

    useEffect(() => {
        const sidebar = document.querySelector("#sidebar");
        sidebar.classList.value = "sidebar";
        const asideRight = document.body;
        asideRight.style.position = "";
        asideRight.style.top = "";
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
        return () => { };
    }, [router.asPath]);

    const menu_links = [
        {
            id: 1,
            url: "",
            name: "Explore",
            icon: "fa-solid fa-house",
            addBaseURL:true
        },
        {
            id: 2,
            url: "/movies",
            name: "Movies",
            icon: "fa-solid fa-film",
            addBaseURL:true
        },
        {
            id: 3,
            url: "/tv-shows",
            name: "Tv Shows",
            icon: "fa-solid fa-tv",
            addBaseURL:true
        },
        {
            id: 4,
            url: "/language",
            name: "Language",
            icon: "fa-solid fa-language",
            addBaseURL:false
        },
        {
            id: 5,
            url: "/u/watchlist",
            name: "Watchlist",
            icon: "fa-solid fa-bookmark",
            addBaseURL:false
        },
        {
            id: 6,
            url: "/help",
            name: "help",
            icon: "fa-solid fa-question",
            addBaseURL:false
        },
    ];

    const Menu = ({ item }) => {
        const first_part=item.addBaseURL?`/${language}`:''
        const link=first_part+item.url
        return (
            <Link href={`${first_part}${item.url}`}>
                <a>
                    <li className={`menu-link ${router.asPath===link?'menu-active':''}`}>
                        <span className="icon" data-desc={item.name}>
                            <i className={item.icon}></i>
                        </span>
                        <span className="nav-link-text">{item.name}</span>
                    </li>
                </a>
            </Link>
        );
    };

    const MenuList = ({ data,header }) => {
        return (
            <div className="menu-wrapper">
                {/* <header>{header}</header> */}
                <ul className="menu-list">
                    {data.map((item) => (
                        <Menu key={item.id} item={item} />
                    ))}
                </ul>
            </div>
        );
    };
    return (
        <>
            <aside className="sidebar" id="sidebar">
                {/* <header>ZFlix</header> */}
                <div className="sidebar-handle">
                    <button className=" expand" onClick={expandSidebar}>
                        <i id="sidebar-arrow" className="fa-solid fa-arrow-right"></i>
                    </button>
                    <button className="close" onClick={expandSidebar}>
                        <i id="sidebar-arrow" className="fa-solid fa-arrow-left"></i>
                    </button>
                </div>
                <MenuList header={"Menu"} data={menu_links.slice(0,3)} />
                <MenuList header={"Misc"} data={menu_links.slice(3,6)} />
            </aside>
            <div className="sidebar-expanded-overlay" onClick={expandSidebar}></div>
        </>
    );
}