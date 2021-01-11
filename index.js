import inlineCss from 'inline-css';
import fs from "fs";
import MarkdownIt from 'markdown-it';

const fsPromises = fs.promises;

const TEMPLATE_FILE_PATH = "./src/index.html";
const CSS_FILE_PATH = "./src/index.css";
const MARKDOWN_FILE_PATH = "./src/index.md";
const OUTPUT_DIRECTORY = "./output";

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

// Self-invoking function used in order to use "await" at entry point of script
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
        .then(async function (outputHtml) {
            let doesDirectoryExists = await checkIfDirectoryExists(OUTPUT_DIRECTORY);
            if (!doesDirectoryExists) {
                await makeOutputDirectory(OUTPUT_DIRECTORY);
            }
            await writeFile(OUTPUT_DIRECTORY + "/index.html", outputHtml);
        });
})();