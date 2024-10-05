const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const express = require("express");
const Downloader = require("./lib/downloader");
const downloader = new Downloader();

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    msg: "OK.",
  });
});

app.get("/downloader/tiktok", async (req, res) => {
  const { u } = req.query;
  if (!u) return res.status(400).json({ status: 400, msg: "Bad Request." });
  try {
    const data = await downloader.tiktok(u);
    return res.status(200).json({
      status: 200,
      msg: "ok.",
      data,
    });
  } catch {
    return res.status(500).json({ status: 500, msg: "Internal Server Error." });
  }
});

app.get("/downloader/x", async (req, res) => {
  const { u } = req.query;
  if (!u) return res.status(400).json({ status: 400, msg: "Bad Request." });
  const matchTwtId = u.match(/\/status\/(\d+)/);
  const tweetId = matchTwtId ? matchTwtId[1] : null;
  if (!tweetId) return res.status(400).json({ status: 400, msg: "Bad Request." });
  try {
    const data = await downloader.x(tweetId);
    return res.status(200).json({
      status: 200,
      msg: "ok.",
      data,
    });
  } catch {
    return res.status(500).json({ status: 500, msg: "Internal Server Error." });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
