import constants from "../constants/index.js";
import inlineCss from "inline-css";
import MarkdownIt from "markdown-it";
import * as fileIO from "../fileIO/index.js";

let md;

export async function generate(...args) {
  let cssPathToUse, htmlPathToUse, markdownPathToUse, outputDirectoryToUse;
  if (Array.isArray(args) && args.length > 0) {
    let options = args[0];

    if (options.hasOwnProperty("cssPath")) {
      cssPathToUse = options.cssPath;
    } else if (options.hasOwnProperty("useCssFile")) {
      if (options.useCSSFile === false) {
        cssPathToUse = "";
      } else {
        cssPathToUse = constants.paths.DEFAULT_CSS_FILE_PATH;
      }
    }

    if (options.hasOwnProperty("templatePath")) {
      htmlPathToUse = options.templatePath;
    }

    // handle markdown options
    if (options.hasOwnProperty("markdownPath")) {
      markdownPathToUse = options.markdownPath;
    }

    if (options.hasOwnProperty("outputDirectory")) {
      outputDirectoryToUse = options.outputDirectory;
    }
    generateEmailHTML(
      cssPathToUse,
      htmlPathToUse,
      markdownPathToUse,
      outputDirectoryToUse
    );
  } else {
    cssPathToUse = constants.paths.DEFAULT_CSS_FILE_PATH;
    generateEmailHTML(cssPathToUse);
  }
}

async function generateEmailHTML(
  cssPath,
  htmlPath = constants.paths.DEFAULT_TEMPLATE_FILE_PATH,
  markdownPath = constants.paths.DEFAULT_MARKDOWN_FILE_PATH,
  outputDirectory = constants.paths.DEFAULT_OUTPUT_DIRECTORY,
  outputFileName = constants.names.DEFAULT_OUTPUT_FILE_NAME
) {

  console.log("outputDirectory:", outputDirectory);
  console.log("outputFileName:", outputFileName);
  let canUseCSSFile = cssPath != "";
  let html = await fileIO.readFile(htmlPath);
  let css = "";

  // Cache MarkdownIt object.
  if (!md) {
    md = new MarkdownIt();
  }

  if (canUseCSSFile) {
    css = await fileIO.readFile(cssPath);
  }

  let markdown = await fileIO.readFile(markdownPath);

  let mainContent = md.render(markdown);

  let htmlWithContent = html.replace(
    constants.templates.TEMPLATE_CONTENT_STRING,
    mainContent
  );

  let options = {
    url: "./",
  };

  if (css != "") {
    options.extraCss = css;
  }

  createOutputFile(htmlWithContent, outputDirectory, outputFileName, options);
}

async function createOutputFile(
  htmlWithContent,
  outputDirectory,
  outputFileName,
  options
) {
  let outputHtml = await inlineCss(htmlWithContent, options);

  let doesDirectoryExists = await fileIO.checkIfDirectoryExists(
    outputDirectory
  );

  if (!doesDirectoryExists) {
    await fileIO.makeOutputDirectory(outputDirectory);
  }
  let outputPath = `${outputDirectory}/${outputFileName}`;
  console.log(outputPath);
  await fileIO.writeFile(outputPath, outputHtml);
  
}
