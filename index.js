const cheerio = require("cheerio");
const axios = require("axios");
const { write_document, get_details } = require("./helpers/helper");
const { get } = require("cheerio/lib/api/traversing");

const scrapping_data = async (name, url, page_count) => {
  try {
    for (let y = 1; y <= page_count; y++) {
      const { data } = await axios.get(`${url}${y}`);

      const $ = cheerio.load(data);

      const cards = [];
      const url_pathes = [];

      let obj = {};

      $("li.card").each(async (i, elem) => {
        const local_url = $(elem).children("a.tooltip").attr("href");

        url_pathes.push(local_url);
      });

      await get_details(url_pathes, obj);

      console.log(obj);

      //await write_document(name, ...cards);
    }
  } catch (e) {
    console.log(e);
  }
};

//anime-planet.com/anime/all - 480 pages

scrapping_data("all_anime", "https://anime-planet.com/anime/all?page=", 1);
