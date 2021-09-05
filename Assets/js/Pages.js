const { page, getPages } = require('./Page.js.js.js');
const JSONpages = require("./pages.json");
var pages = getPages(JSONpages);

function displayPages(pages) {
    var returnHTML = "";
    Array.from(pages).forEach(page => {
        returnHTML += ```
            <div id="page">
                <h1>${page.name}</h1>
                <b>${page.path}</b>
        ```;
        if (pages.subPages.length > 0) {
            displayPages(page.subPages);
        } else {
            returnHTML += `</div>`
        }
    });
    return returnHTML;
}

document.getElementById('listOfPages').innerHTML = displayPages(pages);

console.log("Check!");