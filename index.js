import inlineCss from 'inline-css';
import fs from "fs";
import MarkdownIt from 'markdown-it';

const fsPromises = fs.promises;

const DEFAULT_TEMPLATE_FILE_PATH = "./src/index.html";
const DEFAULT_CSS_FILE_PATH = "./src/index.css";
const DEFAULT_MARKDOWN_FILE_PATH = "./src/index.md";
const DEFAULT_OUTPUT_DIRECTORY = "./output";

const TEMPLATE_CONTENT_STRING = "{{slinger_content}}";

async function readFile(filePath) {
    try {
        const data = await fsPromises.readFile(filePath);
        return data.toString();
    } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
    }
}

function isErrorNotFound(err) {
    return err.code === "ENOENT";
}

async function checkIfDirectoryExists(directory) {
    return fsPromises
        .stat(directory)
        .then(fsStat => {
            return fsStat.isDirectory();
        })
        .catch(err => {
            if (isErrorNotFound(err)) {
                return false;
            }
            throw err;
        });
}

async function makeOutputDirectory(directory) {
    fsPromises.mkdir(directory, { recursive: true })
        .then(() => { return true; })
        .catch(err => {
            throw err;
        })
}

async function writeFile(file, content) {
    try {
        await fsPromises.writeFile(file, content);
    } catch (error) {
        console.error(`Got an error trying to write to a file: ${error.message}`);
    }
}



async function inlineCss(htmlWithContent, outputPath, options) {
    inlineCss(htmlWithContent, options)
        .then(async function (outputHtml) {
            let doesDirectoryExists = await checkIfDirectoryExists(outputPath);
            if (!doesDirectoryExists) {
                await makeOutputDirectory(outputPath);
            }
            await writeFile(outputPath + "/index.html", outputHtml);
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
            let doesDirectoryExists = await checkIfDirectoryExists(outputDirectory);
            if (!doesDirectoryExists) {
                await makeOutputDirectory(outputDirectory);
            }
            await writeFile(outputDirectory + "/index.html", outputHtml);
        });
}