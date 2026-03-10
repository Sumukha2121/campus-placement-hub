const http = require("http");
const path = require("path");
const fs = require("fs");

const publicDir = path.join(__dirname, "..", "public");
const port = process.env.PORT || 5173;

function contentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === ".html") return "text/html; charset=utf-8";
    if (ext === ".css") return "text/css; charset=utf-8";
    if (ext === ".js") return "text/javascript; charset=utf-8";
    if (ext === ".svg") return "image/svg+xml";
    if (ext === ".png") return "image/png";
    if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
    if (ext === ".json") return "application/json; charset=utf-8";
    return "application/octet-stream";
}

const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";
    const filePath = path.join(publicDir, urlPath);

    if (!filePath.startsWith(publicDir)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) {
            fs.createReadStream(filePath)
                .on("open", () => {
                    res.writeHead(200, { "Content-Type": contentType(filePath) });
                })
                .on("error", () => {
                    res.writeHead(500);
                    res.end("Internal Server Error");
                })
                .pipe(res);
        } else {
            const indexFile = path.join(publicDir, "index.html");
            fs.createReadStream(indexFile)
                .on("open", () => {
                    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                })
                .on("error", () => {
                    res.writeHead(404);
                    res.end("Not Found");
                })
                .pipe(res);
        }
    });
});

server.listen(port, () => {
    console.log(`Campus Placement Hub running at http://localhost:${port}/`);
});
