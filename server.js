import http from 'http';
import fs from 'fs';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import { connectDB, addUser, getAllUsers, findUserByUsername, updateUser } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HTML_FOLDER = 'Pages';
const PORT = 3000;

//connecting to the database
connectDB().catch(err => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
})

//function to read request body
const getRequestBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(error);
            }
        });

        req.on('error', (error) => {
            reject(error);
        });
    });
};

//server creation
const server = http.createServer(async (req, res) => {
    let url = req.url;
    const method = req.method;
    
    if (url.startsWith('/api/')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

    if (url === '/api/users/signup' && method === 'POST') {
        try {
        const userData = await getRequestBody(req);
        const { username, password } = userData;

        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Username already exists' }));
            return;
        }

        const newUser = await addUser({
            username,
            password,
            bio: '',
            hobbies: [],
            matches: [],
            createdAt: new Date().toISOString()
        });

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'User created successfully',
            userId: newUser._id
        }));
    } catch (error) {
        console.error(`Error adding user: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Server error' }));
    }
    return;
}

if (url === '/api/users/login' && method === 'POST') {
    try {
        const userData = await getRequestBody(req);
        const { username, password } = userData;

        const user = await findUserByUsername(username);
        if (!user) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid username or password' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                hobbies: user.hobbies
            }
        }));
    } catch (error) {
        console.error(`Error finding user: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Server error' }));
    }

    return;
}

if (url === '/api/users/update-bio' && method === 'POST') {
    try {
        const data = await getRequestBody(req);
        const { username, bio } = data;

        if(!username) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Username is required' }));
            return;
        }

        const user = await findUserByUsername(username);
        if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
            return;
        }

        const updatedUser = await updateUser(user._id, { bio });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Bio updated successfully',
            bio: updatedUser.bio
        }));
    } catch (error) {
        console.error(`Error updating bio: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Server error' }));
    }
    return;
}

if (url.startsWith('/api/users/profile') && method === 'GET') {
    try {
        // Extract username from query string
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const username = urlObj.searchParams.get('username');

        if (!username) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Username is required' }));
            return;
        }

        const user = await findUserByUsername(username);
        if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            username: user.username,
            bio: user.bio,
            hobbies: user.hobbies,
            createdAt: user.createdAt
        }));
    } catch (error) {
        console.error(`Error getting user profile: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Server error' }));
    }
    return;
}

if (url === '/api/users/update-hobbies' && method === 'POST') {
    try {
        const data = await getRequestBody(req);
        const { username, hobbies } = data;

        if(!username || !hobbies || !Array.isArray(hobbies) || hobbies.length === 0) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid request data' }));
            return;
        }

        const user = await findUserByUsername(username);
        if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
            return;
        }

        const updatedUser = await updateUser(user._id, { hobbies });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Hobbies updated successfully',
            hobbies: updatedUser.hobbies
        }));
    } catch (error) {
        console.error(`Error updating user: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Server error' }));
    }
    return;
}
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'API endpoint not found' }));
    return;
}

if (url === '/' || url === '') {
    url = 'index.html';
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

    fs.stat(filePath, (err, stats) => {
        if (err) {
            const notFoundPath = path.join(__dirname, HTML_FOLDER, '404.html');
            fs.readFile(notFoundPath, (err, content) => {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                
                if (err) {
                    res.end('404 Not Found');
                } else {
                    res.end(content, 'utf-8');
                }
            });
            return;
        }
        
        if (stats.isDirectory()) {
            const indexPath = path.join(filePath, 'index.html');
            fs.stat(indexPath, (err, indexStats) => {
                if (err || !indexStats.isFile()) {
                    const notFoundPath = path.join(__dirname, HTML_FOLDER, '404.html');
                    fs.readFile(notFoundPath, (err, content) => {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        
                        if (err) {
                            res.end('404 Not Found');
                        } else {
                            res.end(content, 'utf-8');
                        }
                    });
                } else {
                    fs.readFile(indexPath, (err, content) => {
                        if (err) {
                            res.writeHead(500);
                            res.end('Sorry, there was an error: ' + err.code);
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(content, 'utf-8');
                        }
                    });
                }
        });
        return;
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
                fs.readFile(notFoundPath, (err, content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    
                    // We can make a custom error 404 page later on
                    if (err) {
                        res.end('404 Not Found');
                    } else {
                        res.end(content, 'utf-8');
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

});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});