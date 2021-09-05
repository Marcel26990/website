const express = require("express");
const http = require("http");
const https = require("https");
const helmet = require("helmet");
const compression = require("compression");
const file = require("fs");
const { join } = require("path");

const { page, getPages } = require('./Page.js');
const JSONpages = require("./pages.json");
var pages = getPages(JSONpages);

require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(helmet({ hidePoweredBy: true }));
app.use(compression());

const httpsOptions = {
    key: file.readFileSync(join(__dirname, "certificates/domain.key")),
    cert: file.readFileSync(join(__dirname, "certificates/domain.pem"))
};

http.createServer(app).listen("3000", () => {
    console.log("Listening via HTTP on Port:", "3000");
});

http.createServer(app).listen(process.env.httpPort, () => {
    console.log("Listening via HTTP on Port:", process.env.httpPort);
});

https.createServer(httpsOptions, app).listen(process.env.httpsPort, () => {
    console.log("Listening via HTTPS on Port:", process.env.httpsPort);
});

app.use("/assets", express.static(join(__dirname, "Assets")));

app.get("*", (req, res, next) => {
    let host = req.get("host").split(".");
    console.log(req.originalUrl)
    let url = req.originalUrl.split("/");
    url.shift();
    console.log(url)
    if (host.length > 2) {
        res.send("markregg.com");
    } else {
        Array.from(pages ?? []).forEach(page => {
            if ([(url[0] ?? "home").toLowerCase(), ""].includes(page.name)) {
                if (url.length == 1 || (url.length == 2 && url[1] == "")) {
                    page.publish(res);
                }
            }
        });
    }
});

app.use((req, res) => {
    res.status(404).send("404, Not found!");
});

