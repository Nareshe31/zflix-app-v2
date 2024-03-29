export const getYear = (date) => {
    return date?.slice(0, 4);
  };
  export const covertToLinkWords = (title) => {
    var s = removeSpecialCharacters(title);
    return s.replace(/\s+/g, "-").toLowerCase();
  };
  
  export const removeSpecialCharacters = (title) =>{
    const t1=title ? title.replace(/[#,\-–_()$~%!*?<>{}]/g, " ") : "";
    const t2=t1?t1.replace(/['.:"]/g, ""):""
    return t2
  }
  
  export const getLink = (item, type,language="en") => {
    // const language=typeof window !=="undefined" && localStorage.getItem('language') || 'en'
    if (type === "movie") {
      // ${item.release_date ? "-" + getYear(item.release_date) : ""}
      const name=`${covertToLinkWords(item.title)}`
      return `/${language}/movie/${item.id}/${name}`;
    } else if (type === "tv")
      // ${item.first_air_date ? "-" + getYear(item.first_air_date) : ""}
      return `/${language}/tv/${item.id}/${covertToLinkWords(item.name)}`;
    else {
      return item ? `/${language}/person/${item.id}/${covertToLinkWords(item.name)}` : "";
    }
  };
  
  export const checkBothTitle = (data, actualTitle) => {
    const expectedTitle =
      covertToLinkWords(data.title) +
      (data.release_date ? "-" + getYear(data.release_date) : "");
    return [expectedTitle !== actualTitle, expectedTitle];
  };
  
  export const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  
  export const getDate = (date) => {
    if (!date) return "N/A";
    return (
      months[date?.split("-")[1] - 1] +
      " " +
      date?.split("-")[2] +
      ", " +
      date?.split("-")[0]
    );
  };
  
  export const getMonth = (date) => {
    return months[date?.slice(5, 7) - 1];
  };
  
  export const getHour = (runtime) => {
    return " " + Math.floor(runtime / 60).toString();
  };
  
  export const getMinute = (runtime) => {
    return runtime % 60;
  };
  
  export function convertMoney(labelValue) {
    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e9
      ? Number(Math.abs(Number(labelValue) / 1.0e9).toFixed(2)) + " billion"
      : // Six Zeroes for Millions
      Math.abs(Number(labelValue)) >= 1.0e6
        ? Number(Math.abs(Number(labelValue) / 1.0e6).toFixed(2)) + " million"
        : // Three Zeroes for Thousands
        Math.abs(Number(labelValue)) >= 1.0e3
          ? Number(Math.abs(Number(labelValue) / 1.0e3).toFixed(2)) + " thousand"
          : Math.abs(Number(labelValue));
  }
  
export const TMDB_BASE_IMAGE_PATH=(size)=>`https://image.tmdb.org/t/p/${size}`
  export const overview =
    "ZFlix is the largest free streaming platform for movies and tv shows. Collaborative media and info service featuring high quality content for a huge selection of titles and new releases! Available in all countries.";