const https = require("https"); // For creating HTTPS server
const fs = require("fs"); // To access the file system through which files will be loaded
const path = require("path"); // For functions like path.join and path.resolve
const querystring = require("querystring"); // For converting browser query string into an object
const port = 3000;

const options = {
    host: "localhost",
    port: port,
    rejectUnauthorized: false,
    requestCert: true,
    agent: false,
    key: fs.readFileSync(path.join(path.resolve(__dirname, "../../"), "/certs/myLocalhost.key")),
    cert: fs.readFileSync(path.join(path.resolve(__dirname, "../../"), "/certs/myLocalhost.crt")),
    ca: fs.readFileSync(path.join(path.resolve(__dirname, "../../"), "/certs/myCA.pem")),
};

const server = https.createServer(options, (req, res) => {
    if(req.url == "/") {
        res.writeHead(200, {"Content-Type" : "text/html"}); // 200: OK
        fs.readFile("../home_page/homePage.html", (err, data) => {
            if(err) {
                res.writeHead(404);
                res.write("Error: Page not found");
            } else {
                res.end(data);
            }
        })
    }
    else if (req.url.match(/.css$/)) {
        const cssPath = path.join(path.resolve(__dirname, "../"), req.url);
        let fileStream = fs.createReadStream(cssPath); // Create a readstream to read file
        res.writeHead(200, {"Content-Type" : "text/css"});
        fileStream.pipe(res); // pipe helps us directly write without needing a write stream
    }else if (req.url.match(/.png$/)) {
        const imgPath = path.join(path.resolve(__dirname, "../"), req.url);
        let fileStream = fs.createReadStream(imgPath);
        res.writeHead(200, {"Content-Type" : "image/png"});
        fileStream.pipe(res);
    }else if (req.url.match(/.jpg$/)) {
        const imgPath = path.join(path.resolve(__dirname, "../"), req.url);
        let fileStream = fs.createReadStream(imgPath);
        res.writeHead(200, {"Content-Type" : "image/jpg"});
        fileStream.pipe(res);
    }
});

server.listen(port, (err) => {
    if (err) throw err;
    console.log("Server started at port: " + port);
});
