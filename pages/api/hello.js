// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


function sortByKey(array, key) {
  return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

export default async function handler(req, res) {
  // const sorted=sortByKey(WATCH_PROVIDERS,"provider_name")

  const result= await fetch("https://api.themoviedb.org/3/watch/providers/tv?api_key=dfc43a605d906f9da6982495ad7bb34e&language=en-US&watch_region=IN")
  const resultdata=await result.json()
  console.log(resultdata.results.length);
  const data=resultdata.results.map(i=>({"logo_path": i.logo_path,
  "provider_name": i.provider_name,
  "provider_id": i.provider_id}))
  const sorted=sortByKey(data,"provider_name")
  res.status(200).json(sorted)
}
