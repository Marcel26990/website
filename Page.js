import { join } from "path";
import JSONpages from "./pages.js";

export default class Page {
    constructor(name, path, subPages = []) {
        this.name = name;
        this.path = path;
        this.subpages = subPages;
    }
    
    publish(res) {
        res.sendFile(join(__dirname, this.path))
    }
    
    static getPages(pages = []) {
        if (pages == []) {
            pages = JSONpages;
        }
        var returnArray = [];
        Array.from(pages ?? []).forEach(object => {
            var subs = getPages(object.subPages) ?? [];
            let valueToAdd = new Page(object.name, object.path, subs);
            returnArray.push(valueToAdd);
        });
        return returnArray;
    }
}