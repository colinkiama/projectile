# Projectile
Generate HTML email content for Slinger. 

## How it works
1. Create CSS File with definitions for Headings and body
2. Create HTML template file with a link to where the CSS is and a special template string that will be replaced.
3. Write markdown file
4. Render HTML from markdown file with "markdown-it" library
5. Parse HTML Template and replace special template string with rendered content from markdown file.
6. Now with the string from the last step, apply inline the css into style attributes using the inline-css library.
7. The final HTML string generated will be put added into a new HTML file output. The generated file in the output directory will be used to send emails via slinger.

## How to use
You can just call `generate` and it will automatically get files from `index.css`, `index.html` and `index.md` the `/src` directory within your current one, then generate the final html file called `index.html` in the `/output` directory within your current one.

If you would like to modify this behaviour call `generate(options)`.

If you don't specify a field, the default behaviour will occur for for that option.

Full options object possible values
```javascript
{
    templatePath: string,
    useCssFile: bool,
    cssPath: string,
    markdownPath: string,
    outputDirectory: string,
    outputFileName: string
}
```

## Important Notes
CSS support in emails is different from the rest of the web.

## Contributing
Found a bug or would like to help out with the project? Check this out: [Contributing to the project](CONTRIBUTING.md).

Read these for more info:
https://www.campaignmonitor.com/dev-resources/guides/coding-html-emails/

https://www.campaignmonitor.com/css/style-element/style-in-head/
