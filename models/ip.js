module.exports = {
  queryIpFunction: async()=>{
    const fetchData = await fetch("http://ip-api.com/json")
    const data = await fetchData.json()
    return data
  }
}