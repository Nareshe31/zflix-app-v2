import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export default function Sidebar({ }) {
    const router = useRouter();
    const language = router.query.language || "en";
    const sidebar = useRef(null);
    const expandSidebar = () => {
        return;
        const asideRight = document.body;
        // ("#aside-right");
        if (sidebar.current.classList.contains("expand")) {
            const scrollY = asideRight.style.top;
            asideRight.style.position = "";
            asideRight.style.top = "";
            window.scrollTo(0, parseInt(scrollY || "0") * -1);
            sidebar.current.classList.remove("expand");
        } else {
            const top = window.scrollY;
            asideRight.style.position = "fixed";
            asideRight.style.top = `-${top}px`;
            sidebar.current.classList.add("expand");
        }
    };

    useEffect(() => {
        closeSidebar();
        return () => { };
    }, [router.asPath]);

    useEffect(() => {
        var prevScrollpos = window.pageYOffset;
        window.addEventListener("scroll", scrollbehaviour);
        function scrollbehaviour() {
            var currentScrollPos = window.pageYOffset;
            if (prevScrollpos > currentScrollPos) {
                document.getElementById("sidebar").style.bottom = "0";
            } else {
                document.getElementById("sidebar").style.bottom = "-80px";
            }
            prevScrollpos = currentScrollPos;
        }
        return () => {
            window.removeEventListener("scroll", scrollbehaviour);
        };
    }, []);

    const closeSidebar = () => {
        sidebar.current.classList.value = "sidebar";
        const asideRight = document.body;
        asideRight.style.position = "";
        asideRight.style.top = "";
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
    };
    const menu_links = [
        {
            id: 1,
            url: "",
            name: "Explore",
            icon: "fa-solid fa-house",
            addBaseURL: true,
        },
        {
            id: 2,
            url: "/movies",
            alternalteurl: "/movie",
            name: "Movies",
            icon: "fa-solid fa-film",
            addBaseURL: true,
        },
        {
            id: 3,
            url: "/tv-shows",
            alternalteurl: "/tv",
            name: "TV Shows",
            icon: "fa-solid fa-tv",
            addBaseURL: true,
        },
        {
            id: 4,
            url: "/search",
            name: "Search",
            icon: "fa-solid fa-search",
            addBaseURL: true,
        },
        {
            id: 5,
            url: "/u/watchlist",
            name: "Watchlist",
            icon: "fa-solid fa-bookmark",
            addBaseURL: false,
        },
        // {
        //     id: 6,
        //     url: "/help",
        //     name: "help",
        //     icon: "fa-solid fa-question",
        //     addBaseURL:false
        // },
    ];

    const Menu = ({ item }) => {
        const first_part = item.addBaseURL ? `/${language}` : "";
        const link = first_part + item.url;
        const linkclass = `menu-link${router.asPath === link ||
                (item.alternalteurl
                    ? router.asPath.includes(first_part + item.alternalteurl)
                    : false)
                ? " menu-active"
                : ""
            }`;
        return (
            <li className={linkclass}>
                <Link href={`${first_part}${item.url}`} passHref>
                    <a>
                        <span className="icon" data-desc={item.name}>
                            <i className={item.icon}></i>
                        </span>
                        <span className="nav-link-text">{item.name}</span>
                    </a>
                </Link>
            </li>
        );
    };

    const MenuList = ({ data, header }) => {
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
            <aside className="sidebar" ref={sidebar} id="sidebar">
                {/* <header>ZFlix</header> */}
                <div className="sidebar-handle">
                    <button className="expand" onClick={expandSidebar}>
                        {/* <i id="sidebar-arrow" className="fa-solid fa-arrow-right"></i> */}
                        <div className="ham">
                            <div className="line-1"></div>
                            <div className="line-2"></div>
                            <div className="line-3"></div>
                        </div>
                    </button>
                    <button className="close" onClick={expandSidebar}>
                        <i id="sidebar-arrow" className="fa-solid fa-arrow-left"></i>
                    </button>
                </div>
                <MenuList header={"Menu"} data={menu_links.slice(0, 3)} />
                <MenuList header={"Misc"} data={menu_links.slice(3, 6)} />
            </aside>
            <div className="sidebar-expanded-overlay" onClick={expandSidebar}></div>
        </>
    );
}
