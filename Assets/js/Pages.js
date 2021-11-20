import getPages from '../../Page.js';

function displayPages(pages) {
    var returnHTML = "";
    Array.from(getPages()).forEach(page => {
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
    console.log("Function called!");
    return returnHTML;
}

console.log("File called!");
