const file = require("fs");
const { join } = require("path");

class Page {
    constructor(name, path, subPages = []) {
        this.name = name;
        this.path = path;
        this.subpages = subPages;
    }
    
    publish(res) {
        res.sendFile(join(__dirname, this.path))
    }
}

function getPages(objects) {
    var returnArray = [];
    Array.from(objects ?? []).forEach(object => {
        var subs = getPages(object.subPages) ?? [];
        let valueToAdd = new Page(object.name, object.path, subs);
        returnArray.push(valueToAdd);
    });
    return returnArray;
}

module.exports = {
    Page,
    getPages
}