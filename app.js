// app.js

const express = require('express');
const bodyParser = require('body-parser');
const {exec} = require('child_process');

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('/styles.css'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/join-page.html');
});
// Route to handle form submission
app.post('/submit-form', (req, res) => {
    const { orgName, walletAddress, websiteLink } = req.body;
    values = [orgName, walletAddress];
    command = 'python nonprofit-data.py ' + values.join(' ');
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`Python Output: ${stdout}`);
        if (stdout.includes("Name: ")) {
            const responseHtml = `
            <html>
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700&display=swap" rel="stylesheet">
                <link href = "/styles.css" rel="stylesheet" />
                <style>
                    body {
                        font-family: 'Outfit', sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: #28282c;
                    }
                    .message {
                        padding: 20px;
                        border: 1px solid #ddd;
                        color: #ffffff;
                        background-color: #1d9848;
                        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
                    }
                </style>
                <script>
                    function redirectToLinkTree() {
                        window.location.href = "/linktree.html";
                    }
                </script>
            </head>
            <body>
                <button class="message" onclick="redirectToLinkTree()">
                    ${stdout.includes("Name: ") ? 'Organization is a 501c3!' : 'Organization is not a 501c3.'}
                </button>
            </body>
            </html>`;

            res.send(responseHtml);

            let isVerified = true;
        }
        else {
            const responseHtml = `
            <html>
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700&display=swap" rel="stylesheet">
                <link href = "/styles.css" rel="stylesheet" />
                <style>
                    body {
                        font-family: 'Outfit', sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: #28282c;
                    }
                    .message {
                        padding: 20px;
                        border: 1px solid #ddd;
                        color: #ffffff;
                        background-color: #1d9848;
                        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
                    }
                </style>
            </head>
            <body>
                <div class="message">
                    ${stdout.includes("Name: ") ? 'Organization is a 501c3!' : 'Organization is not a 501c3.'}
                </div>
            </body>
            </html>`;

            res.send(responseHtml);
            let isVerified = false;
        }
    });
});
//need to add to blockchain here?

// if (isVerified) {
//     return
// }

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
