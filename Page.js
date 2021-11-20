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
        console.log("Get pages");
        if (pages == []) {
            console.log(JSONpages);
            pages = JSONpages;
        }
        var output = [];
        console.log(pages);
        Array.from(pages).forEach(object => {
            var subs = getPages(object.subPages) ?? [];
            let valueToAdd = new Page(object.name, object.path, subs);
            output.push(valueToAdd);
        });
        console.log(output);
        return output;
    }
}