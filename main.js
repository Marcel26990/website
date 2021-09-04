const express = require("express");
const http = require("http");
const https = require("https");
const helmet = require("helmet");
const compression = require("compression");
const file = require("fs");
const { join } = require("path");

const JSONpages = require("./pages.json");

class Page {
    constructor(name, path, subPages = []) {
        this.name = name;
        this.path = path;
        this.subpages = subPages;
    }
    publish(res) {
        res.send(express.static(file.readFileSync.join(__dirname, path)))
    }
}

function getPages(objects) {
    var returnArray = [];
    Array.from(objects ?? []).forEach(object => {
        var subs = getPages(object.subPages);
        returnArray += new Page(object.name, object.path, subs);
    });
    return returnArray;
}

var pages = getPages(JSONpages);

require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(helmet({ hidePoweredBy: true }));
app.use(compression());

const httpsOptions = {
    key: file.readFileSync(join(__dirname, "certificates/domain.key")),
    cert: file.readFileSync(join(__dirname, "certificates/domain.pem")),
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

app.get("*", (req, res, next) => {
    let host = req.get("host").split(".");
    let url = req.originalUrl.split("/").shift();
    if (host.length > 2) {
        res.send("markregg.com")
    } else {
        Array.from(pages ?? []).forEach(page => {
            if ((url[0] ?? "home") == page.name) {
                page.publish(res)
            }
        });
    }
});

app.use((req, res) => {
    res.status(404).send("404, Not found!");
});

