import inlineCss from 'inline-css';
var html = "<style>div{color:red;}</style><div/>";
 
let options = {
    url: "http://localhost:8080"
}

inlineCss(html, options)
    .then(function(html) { console.log(html); });