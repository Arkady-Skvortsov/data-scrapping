const fs = require("fs");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const get_details = async (file_name, file_type, arr, url, obj) => {
  try {
    const browser = await puppeteer.launch({ headless: true, slowMo: 500 });

    for (let urls of url) {
      const page = await browser.newPage();
      await page.goto(`https://www.anime-planet.com${urls}`);

      const content = await page.content();

      const $ = cheerio.load(content);

      obj.name = $("div#siteContainer").children("h1").text();
      obj.img =
        "https://www.anime-planet.com" +
        $("div.mainEntry").children("img.screenshots").attr("src");
      obj.type = regx(
        $("section.entryBar").find("span.type").text(),
        /\n+/g,
        " "
      );
      obj.rank = $("section.EntryBar").children("div.pure-1").last().text();
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
      obj.rating = regx(
        $("section.entryBar").find("div.avgRating").text(),
        /\n+/g,
        ""
      );
      obj.about = $("div.md-3-5").find("p").text();
      obj.tags = [
        regx($("div.md-3-5").find("li").children("a").text(), /\n+/g, ", "),
      ];
      obj.warning_content = [
        regx($("div.tags--plain").find("li").children("a").text(), /\n+/g, ""),
      ];

      obj.some_characters = [
        `those names -> ${$("a.CharacterCard")
          .find("strong.CharacterCard__title")
          .text()}, those japanese voices -> ${regx(
          $("a.CharacterCard")
            .find("div.CharacterCard__body")
            .children("div")
            .text(),
          /\n+/g,
          " "
        )}`,
      ];

      obj.some_staff = [
        `those names -> ${$("a.CharacterCard")
          .children("article.CharacterCard__main")
          .find(".CharacterCard__title")
          .text()}, those roles -> ${regx(
          $("a.CharacterCard")
            .children("article.CharacterCard__main")
            .find(".CharacterCard__body")
            .text(),
          /\n+/g,
          " "
        )}`,
      ];

      arr.push(obj);

      await write_document(file_name, file_type, arr);
    }

    browser.close();
  } catch (e) {
    throw e;
  }
};

const write_document = (file_name, file_type, content) => {
  fs.writeFile(
    `./anime/${file_name}.${file_type}`,
    JSON.stringify(content),
    function (err) {
      if (err) console.log(err);
    }
  );
};

const regx = (text, reg, repl_text) => {
  return text.replace(reg, repl_text);
};

module.exports = {
  write_document,
  get_details,
};
