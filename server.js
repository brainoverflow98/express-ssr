const express = require('express');
const ssr = require('./ssr.js');
const {Crawler} = require('es6-crawler-detect');
const path = require('path');

const app = express();
const port = process.env.PORT || '5000';

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', async (req, res, next) => {
  let crawler = new Crawler();
  let userAgent = req.get('User-Agent');
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log('URL: ' + fullUrl);
  console.log('User-Agnet: ' + userAgent);
  if (userAgent && crawler.isCrawler(userAgent))
  {
    console.log('request from crawler');
    const html = await ssr(req.originalUrl, port);
    return res.status(200).send(html);
  }
  else
  {
    console.log('request from user');
    return res.sendFile(path.join(__dirname, '/public/main.html'));
  }
  
});


app.listen(port, () => console.log(`Server started on Port ${port}`));