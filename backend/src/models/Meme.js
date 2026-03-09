const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../../data/memes.json');

// Ensure the data file exists
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

class Meme {
    static async findAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(dataFilePath, 'utf8', (err, data) => {
                if (err) return reject(err);
                try {
                    const memes = JSON.parse(data);
                    resolve(memes);
                } catch (parseErr) {
                    reject(parseErr);
                }
            });
        });
    }

    static async create(memeData) {
        const memes = await this.findAll();
        const newMeme = {
            id: Date.now().toString(),
            ...memeData,
            createdAt: new Date().toISOString()
        };
        memes.push(newMeme);

        return new Promise((resolve, reject) => {
            fs.writeFile(dataFilePath, JSON.stringify(memes, null, 2), (err) => {
                if (err) return reject(err);
                resolve(newMeme);
            });
        });
    }
}

module.exports = Meme;
