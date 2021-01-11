import inlineCss from 'inline-css';
import fs from "fs";
import MarkdownIt from 'markdown-it';

const fsPromises = fs.promises;

const TEMPLATE_FILE_PATH = "./src/index.html";
const CSS_FILE_PATH = "./src/index.css";
const MARKDOWN_FILE_PATH = "./src/index.md";
const TEMPLATE_CONTENT_STRING = "{{slinger_content}}";

async function readFile(filePath) {
    try {
        const data = await fsPromises.readFile(filePath);
        return data.toString();
    } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
    }
}

async function openFile(file) {
    try {
        const csvHeaders = 'name,quantity,price'
        await fsPromises.writeFile('groceries.csv', csvHeaders);
    } catch (error) {
        console.error(`Got an error trying to write to a file: ${error.message}`);
    }
}

(async function () {
    const md = new MarkdownIt();

    let html = await readFile(TEMPLATE_FILE_PATH);
    let css = await readFile(CSS_FILE_PATH);
    let markdown = await readFile(MARKDOWN_FILE_PATH);

    let mainContent = md.render(markdown);

    let htmlWithContent = html.replace(TEMPLATE_CONTENT_STRING, mainContent);

    let options = {
        url: "./",
        extraCss: css
    };

    inlineCss(htmlWithContent, options)
        .then(function (outputHtml) {
            console.log(outputHtml);
        });
})();