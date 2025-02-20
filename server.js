const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow cross-origin requests
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Hardcoded mapping of alcohol names to Imgur URLs
const alcoholImages = {
    "vodka": "https://i.imgur.com/gVgm7gt.jpg", // Direct link to the image
    "whiskey": "https://i.imgur.com/xyz123.jpg",
    "rum": "https://i.imgur.com/abc456.jpg"
};

app.get('/image', (req, res) => {
    const name = req.query.name?.toLowerCase();
    if (!name) {
        return res.status(400).json({ error: "Missing 'name' query parameter" });
    }

    const imageUrl = alcoholImages[name];
    if (!imageUrl) {
        return res.status(404).json({ error: "Image not found for the given name" });
    }

    res.json({ name, imageUrl });
});

app.listen(PORT, () => {
    console.log(`Alcohol Image API is running on port ${PORT}`);
});
