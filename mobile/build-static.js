const fs = require('fs');
const path = require('path');

// Create web-build directory
const webBuildDir = path.join(__dirname, 'web-build');
if (!fs.existsSync(webBuildDir)) {
  fs.mkdirSync(webBuildDir, { recursive: true });
}

// Create a simple index.html
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DesiDine - Food Delivery App</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        h1 {
            font-size: 2.5em;
            margin-bottom: 20px;
        }
        p {
            font-size: 1.2em;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .download-btn {
            display: inline-block;
            background: #4CAF50;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 1.1em;
            margin: 10px;
            transition: background 0.3s;
        }
        .download-btn:hover {
            background: #45a049;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🍽️ DesiDine</h1>
        <p>Your favorite food delivery app is coming soon!</p>
        <p>We're working hard to bring you the best food delivery experience.</p>
        
        <div>
            <a href="#" class="download-btn">📱 Download Android App</a>
            <a href="#" class="download-btn">🍎 Download iOS App</a>
        </div>
        
        <p style="margin-top: 40px; font-size: 0.9em; opacity: 0.8;">
            Powered by React Native & Expo
        </p>
    </div>
</body>
</html>
`;

fs.writeFileSync(path.join(webBuildDir, 'index.html'), htmlContent);
console.log('✅ Static HTML build completed successfully!');
console.log('📁 Files generated in: web-build/'); 