# Projectile
Generate HTML email contnet for Slinger. 

## The plan
### Steps
1. Create CSS File with definitions for Headings and body
2. Create HTML template file with a link to where the CSS is and a special template string that will be replaced.
3. Write markdown file
4. Render HTML from markdown file with "markdown-it" library
5. Parse HTML Template and replace special template string with rendered content from markdown file.
6. Now with the string from the last step, apply inline the css into style attributes using the inline-css library.
7. The final HTML string generated will be output into a new HTML file. This will be the email that will be sent!