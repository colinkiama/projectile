import inlineCss from 'inline-css';
import fs from 'fs/promises';
import MarkdownIt from 'markdown-it';

const TEMPLATE_FILE_PATH = "./src/index.html";
const CSS_FILE_PATH = "./src/index.css";
const MARKDOWN_FILE_PATH = "./src/index.md";

async function readFile(filePath) {
    try {
        const data = await fs.readFile(filePath);
        return data.toString();
    } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
    }
}

(async function () {
    const md = new MarkdownIt();

    let html = await readFile(TEMPLATE_FILE_PATH);
    let css = await readFile(CSS_FILE_PATH);
    let markdown = await readFile(MARKDOWN_FILE_PATH);

    let mainContent = md.render(markdown);
    console.log(mainContent);
    
    let options = {
        url: "./",
        extraCss: css
    };

    inlineCss(html, options)
        .then(function (html) { console.log(html); });
})();