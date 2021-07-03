const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const get_details = async (url, obj) => {
  try {
    for (let i in url) {
      const browser = await puppeteer.launch({ headless: true, slowMo: 500 });
      const page = await browser.newPage();
      await page.goto(`https://www.anime-planet.com${url[i]}`);
      const content = await page.content();
      browser.close();

      const $ = cheerio.load(content);

      obj.name = $("div#siteContainer").children("h1").text();
      obj.img = $("div.mainEntry").children("img.screenshots").attr("src");
      obj.type = $("section.entryBar").find("span.type").text();
      obj.year = $("section.entryBar").find("span.iconYear").text();
      obj.current_data = $("section.entryBar")
        .children("div")
        .next()
        .next()
        .children("a")
        .text();
      obj.studio = $("section.entryBar")
        .children("div")
        .children("a")
        .first()
        .text();
      obj.rating = $("section.entryBar").find("div.avgRating").text();
      obj.about = $("div.md-3-5").find("p").text();
      obj.tags = [$("div.md-3-5").find("li").children("a").text()].join(", ");
      obj.warning_content = [
        $("div.tags--plain").find("li").children("a").text(),
      ];

      console.log(url[i]);

      return obj;
    }
  } catch (error) {
    throw error;
  }
};

const write_document = (name, content) => {
  // fs.mkdir(path.resolve(__dirname, "../anime_list"), function (err) {
  //   if (err) console.log(err);

  fs.writeFileSync(`${name}.json`, JSON.stringify(content), function (err) {
    if (err) console.log(err);
  });
  //});
};

module.exports = {
  write_document,
  get_details,
};
