import Pages from '../../Page.js';

function displayPages(pages) {
    var output = "";
    Pages.getPages().forEach(page => {
        output += `
<div id="page">
    <h1>${page.name}</h1>
    <b>${page.path}</b>
        `;
        if (pages.subPages.length > 0) {
            displayPages(page.subPages);
        } else {
            output += `</div>`
        }
    });
    Document.getElementById("listOfPages").innerHTML = output;
    console.log("Function called!");
}

console.log("File called!");
