const express = require('express');
const http = require('http');
const https = require('https');
const ssr = require('./ssr.js');
const {Crawler} = require('es6-crawler-detect');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', async (req, res, next) => {
  let crawler = new Crawler();
  let userAgent = req.get('User-Agent');
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log('URL: ' + fullUrl);
  console.log('User-Agnet: ' + userAgent);
  if (crawler.isCrawler(userAgent))
  {
    console.log('request from crawler');
    const html = await ssr(req);
    return res.status(200).send(html);
  }
  else
  {
    console.log('request from user');
    return res.sendFile(path.join(__dirname, '/public/main.html'));
  }
  
});

http.createServer(app).listen(80, () => console.log('Listening HTTP on port 80'));
//https.createServer(app).listen(443, () => console.log('Listening HTTPS on port 443'));