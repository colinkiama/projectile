import inlineCss from 'inline-css';
import fs from 'fs/promises';

const TEMPLATE_FILE_PATH = "./src/index.html";
const CSS_FILE_PATH = "./src/index.css";

async function readFile(filePath) {
    try {
        const data = await fs.readFile(filePath);
        return data.toString();
    } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
    }
}

(async function () {
    let html = await readFile(TEMPLATE_FILE_PATH);
    let css = await readFile(CSS_FILE_PATH);
    // var html = "<style>div{color:red;}</style><div/>";

    let options = {
        url: "./",
        extraCss: css
    };

    inlineCss(html, options)
        .then(function (html) { console.log(html); });
})();