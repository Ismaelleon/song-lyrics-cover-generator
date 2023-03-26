const cheerio = require('cheerio'),
	axios = require('axios'),
	fs = require('fs'),
	path = require('path'),
	{ createCanvas, loadImage, Image } = require('canvas');


function getLyrics (html) {
	const $ = cheerio.load(html);

	let lyrics = $('[data-lyrics-container=true]').html();

	lyrics = lyrics.split('<br>');

	lyrics = lyrics.filter(verse => !verse.includes('<'));
	
	return lyrics;
}

async function generateCover (verses, imageURL) {
	try {
		const canvas = createCanvas(512, 512);
		const ctx = canvas.getContext('2d');

		const image = await loadImage(imageURL);
		ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

		ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		for (let i = 0; i < verses.length; i++) {
			ctx.font = '18px Arial';
			let text = ctx.measureText(verses[i]);
			ctx.fillStyle = '#fff';
			ctx.fillText(verses[i], canvas.width / 2 - text.width / 2, canvas.height / 2 + 25 * i);
		}

		let splitURL = imageURL.split('/');
		let fileName = splitURL[splitURL.length - 1];

		fs.writeFileSync(path.join(__dirname, '..', 'public', 'covers', fileName), canvas.toBuffer());
	} catch (err) {
		console.log(err);
	}
}

module.exports = {
	getLyrics,
	generateCover,
};
