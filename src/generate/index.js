import constants from '../constants';
import inlineCss from "inline-css";
import MarkdownIt from "markdown-it";

export async function generate() {
    await generate(
      constants.paths.DEFAULT_TEMPLATE_FILE_PATH,
      constants.paths.DEFAULT_CSS_FILE_PATH,
      constants.paths.DEFAULT_MARKDOWN_FILE_PATH,
      constants.paths.DEFAULT_OUTPUT_DIRECTORY
    );
  }
  
  // Self-invoking function used in order to use "await" at entry point of script
  export async function generate(
    htmlPath,
    cssPath,
    markdownPath,
    outputDirectory
  ) {
    const md = new MarkdownIt();
  
    let html = await readFile(htmlPath);
    let css = "";
  
    if (cssPath != "") {
      css = await readFile(cssPath);
    }
  
    let markdown = await readFile(markdownPath);
  
    let mainContent = md.render(markdown);
  
    let htmlWithContent = html.replace(constants.templates.EMPLATE_CONTENT_STRING, mainContent);
  
    let options = {
      url: "./",
    };
  
    if (css != "") {
      options.extraCss = css;
    }
  
    inlineCss(htmlWithContent, options).then(async function (outputHtml) {
      let doesDirectoryExists = await fileIO.checkIfDirectoryExists(
        outputDirectory
      );
      if (!doesDirectoryExists) {
        await fileIO.makeOutputDirectory(outputDirectory);
      }
      await fileIO.writeFile(outputDirectory + "/index.html", outputHtml);
    });
  }

  async function inlineCss(htmlWithContent, outputPath, options) {
    inlineCss(htmlWithContent, options).then(async function (outputHtml) {
      let doesDirectoryExists = await fileIO.checkIfDirectoryExists(outputPath);
      if (!doesDirectoryExists) {
        await fileIO.makeOutputDirectory(outputPath);
      }
      await fileIO.writeFile(outputPath + "/index.html", outputHtml);
    });
  }