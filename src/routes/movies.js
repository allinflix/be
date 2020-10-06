const express = require('express');
const axios = require('axios');
const router = new express.Router();
const puppeteer = require('puppeteer');

const getInfo = async (links) => {
  const movies = links.map(async (link) => {
    const { data } = await axios.get(
      `${process.env.API_URL}?i=${link.id}&apikey=${process.env.API_KEY}`
    );
    return { ...link, info: data, slug: `/${data.Title.replace(/\s/g, '+')}` };
  });
  return Promise.all(movies);
};

router.get('/top', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.imdb.com/chart/top/?ref_=nv_mv_250');

  const links = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll('.chart tr .titleColumn a')
    ).map((anchor) => {
      return {
        id: anchor.href.slice(27, 36),
        title: anchor.textContent,
      };
    });
  });

  await browser.close();

  const movies = await getInfo(links);

  res.send(movies);
});

module.exports = router;
