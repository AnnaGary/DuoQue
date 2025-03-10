const http = require('http');
const fs = require('fs');
const path = require('path');

const HTML_FOLDER = 'Pages';

// Define the port for your server
const PORT = 3000;

// Create the server
const server = http.createServer((req, res) => {
    // Parse the URL
    let url = req.url;
    
    // Handle the root URL
    if (url === '/') {
        url = '/index.html';
    }
    
    // Handle URLs without .html extension
    if (!path.extname(url) && !url.endsWith('/')) {
        url = `${url}.html`;
    }
    
    let filePath;
    if (path.extname(url) === '.html') {
        filePath = path.join(__dirname, HTML_FOLDER, url);
    } else {
        filePath = path.join(__dirname, url);
    }
    
    // Get the file extension
    const extname = path.extname(url);
    
    // Set the default content type
    let contentType = 'text/html';
    
    // Check the file extension and set the appropriate content type
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }
    
    // Read the file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            // If the file doesn't exist
            if (error.code === 'ENOENT') {
                const notFoundPath = path.join(__dirname, HTML_FOLDER, '404.html');
                fs.readFile(notFoundPath, (err, content404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    
                    // We can make a custom error 404 page later on
                    if (err) {
                        res.end('404 Not Found');
                    } else {
                        res.end(content404, 'utf-8');
                    }
                });
            } else {
                res.writeHead(500);
                res.end('Sorry, there was an error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

// Export if tests need to require() it
module.exports = server;
