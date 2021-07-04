const cheerio = require("cheerio");
const axios = require("axios");
const { get_details } = require("./helpers/helper");

const scrapping_data = async (
  file_name,
  file_type,
  url,
  all_elem,
  page_count
) => {
  try {
    for (let y = 1; y <= page_count; y++) {
      const { data } = await axios.get(`${url}${y}`);

      const $ = cheerio.load(data);

      let arr = [];
      let url_pathes = [];

      let obj = {};

      $(all_elem).each(async (i, elem) => {
        const local_url = $(elem).children("a.tooltip").attr("href");

        url_pathes.push(local_url);
      });

      await get_details(file_name, file_type, arr, url_pathes, obj);
    }
  } catch (e) {
    console.log(e);
  }
};

Promise.all([
  scrapping_data(
    "all_anime",
    "json",
    "https://anime-planet.com/anime/all?page=",
    "li.card",
    10
  ),
  scrapping_data(
    "recomendations_anime",
    "json",
    "https://www.anime-planet.com/users/recent_recommendations.php?filter=anime&page=",
    "td.tableTitle",
    10
  ),
]);
