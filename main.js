import express from 'express';
import { createServer as createHTTPserver } from 'http';
import { createServer as createHTTPSserver } from 'https';
import helmet from 'helmet';
import compression from 'compression';
import files from 'fs';
import path from 'path';
import Page from './assets/js/Page.js';
import exp from 'constants';
import dotenv from 'dotenv';
dotenv.config();

const __dirname = path.resolve();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(helmet({ hidePoweredBy: true }));
app.use(compression());

const httpsOptions = {
    key: files.readFileSync(path.join(__dirname, "certificates/domain.key")),
    cert: files.readFileSync(path.join(__dirname, "certificates/domain.pem"))
};

createHTTPserver(app).listen("3000", () => {
    console.log("Listening via HTTP on Port:", "3000");
});

createHTTPserver(app).listen(process.env.httpPort, () => {
    console.log("Listening via HTTP on Port:", process.env.httpPort);
});

createHTTPSserver(httpsOptions, app).listen(process.env.httpsPort, () => {
    console.log("Listening via HTTPS on Port:", process.env.httpsPort);
});

app.get("*", (req, res, next) => {
    
    let host = req.get("host").split(".");
    console.log(req.originalUrl);
    
    let url = req.originalUrl.split("/");
    url.shift();
    console.log(url);
    
    if (host.length > 2) {
        res.send("markregg.com");
    } else {
        const pages = Page.getPages();
        pages.forEach(page => {
            if ((url[0] == "" ? "home" : url[0] ?? "home").toLowerCase() == page.name) {
                if (url.length == 1 || (url.length == 2 && url[1] == "")) {
                    page.publish(res);
                }
            }
        });
    }
});

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use((req, res) => {
    res.status(404).send("404, Not found!");
});

