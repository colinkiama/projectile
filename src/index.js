import inlineCss from 'inline-css';
import fs from "fs";
import MarkdownIt from 'markdown-it';
import * as fileIO from './fileIO';
const fsPromises = fs.promises;

const DEFAULT_TEMPLATE_FILE_PATH = "./src/index.html";
const DEFAULT_CSS_FILE_PATH = "./src/index.css";
const DEFAULT_MARKDOWN_FILE_PATH = "./src/index.md";
const DEFAULT_OUTPUT_DIRECTORY = "./output";

const TEMPLATE_CONTENT_STRING = "{{slinger_content}}";

async function inlineCss(htmlWithContent, outputPath, options) {
    inlineCss(htmlWithContent, options)
        .then(async function (outputHtml) {
            let doesDirectoryExists = await fileIO.checkIfDirectoryExists(outputPath);
            if (!doesDirectoryExists) {
                await fileIO.makeOutputDirectory(outputPath);
            }
            await fileIO.writeFile(outputPath + "/index.html", outputHtml);
        });
}

export async function generate() {
    await generate(DEFAULT_TEMPLATE_FILE_PATH, DEFAULT_CSS_FILE_PATH, DEFAULT_MARKDOWN_FILE_PATH,
        DEFAULT_OUTPUT_DIRECTORY);
}

// Self-invoking function used in order to use "await" at entry point of script
export async function generate(htmlPath, cssPath, markdownPath, outputDirectory) {
    const md = new MarkdownIt();

    let html = await readFile(htmlPath);
    let css = "";

    if (cssPath != "") {
        css = await readFile(cssPath);
    }

    let markdown = await readFile(markdownPath);

    let mainContent = md.render(markdown);

    let htmlWithContent = html.replace(TEMPLATE_CONTENT_STRING, mainContent);

    let options = {
        url: "./",
    };

    if (css != "") {
        options.extraCss = css;
    }

    inlineCss(htmlWithContent, options)
        .then(async function (outputHtml) {
            let doesDirectoryExists = await fileIO.checkIfDirectoryExists(outputDirectory);
            if (!doesDirectoryExists) {
                await fileIO.makeOutputDirectory(outputDirectory);
            }
            await fileIO.writeFile(outputDirectory + "/index.html", outputHtml);
        });
}