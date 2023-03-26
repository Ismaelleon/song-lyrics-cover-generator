const cheerio = require('cheerio');

function getLyrics (html) {
	const $ = cheerio.load(html);

	let lyrics = $('[data-lyrics-container=true]').text();

	lyrics = lyrics.split(/(?=[A-Z])/);
	
	return lyrics;
}

module.exports = {
	getLyrics,
};
