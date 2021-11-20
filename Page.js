import path from "path";
import JSONpages from "./pages.js";

const __dirname = path.resolve();

export default class Page {
    constructor(name, path, subPages = []) {
        this.name = name;
        this.path = path;
        this.subpages = subPages;
    }
    
    publish(res) {
        res.sendFile(path.join(__dirname, this.path))
    }
    
    static getPages(pages = []) {
        if (Array.from(pages).length == 0) {
            pages = JSONpages;
        }
        var output = [];
        Array.from(pages).forEach(object => {
            var subs;
            if (object.subPages == [] || object.subPages == undefined || object.subPages == null) {
                subs = [];
            } else {
                subs = Page.getPages(object.subPages)
            }
            let valueToAdd = new Page(object.name, object.path, subs);
            output.push(valueToAdd);
        });
        return output;
    }
}