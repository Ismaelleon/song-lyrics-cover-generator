const cheerio = require('cheerio');

function getLyrics (html) {
	const $ = cheerio.load(html);

	let lyrics = $('[data-lyrics-container=true]').html();

	lyrics = lyrics.split('<br>');

	lyrics = lyrics.filter(verse => !verse.includes('<'));
	
	return lyrics;
}

module.exports = {
	getLyrics,
};
