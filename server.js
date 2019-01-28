const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const app = express();

const config = require('./config');

const credentials = {
    key: fs.readFileSync('./https/key.pem', 'utf8'),
    cert: fs.readFileSync('./https/cert.pem', 'utf8')
};

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(config.httpPort, (err) => {
    if (err) console.log(err);
    console.log(`HTTP: ${config.httpPort}`)
});
httpsServer.listen(config.httpsPort, (err) => {
    if (err) console.log(err);
    console.log(`HTTPS: ${config.httpsPort}`)
});