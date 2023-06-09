const router = require('express').Router(),
	axios = require('axios'),
	{ getLyrics, generateCover } = require('../utils/index'),
	{ image_search } = require('duckduckgo-images-api');

router.post('/search', async (req, res) => {
	try {
		const { query } = req.body;

		const response = await axios.get(`https://api.genius.com/search?q=${query}`, {
			headers: {
				'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
				'Content-Type': 'application/json',
			},
		});

		if (response.status === 200) {
			let songs = response.data.response.hits.map(result => {
				if (result.type === 'song') {
					let songData = result.result;

					return {
						title: songData.title,
						artist: songData.artist_names,
						geniusID: songData.id,
					};
				}
			});
			
			return res.json({ results: songs }).end();
		} else {
			return res.sendStatus(404).end();
		}
	} catch (err) {
		console.log(err);
	}
});

router.post('/lyrics', async (req, res) => {
	try {
		const { geniusID } = req.body;

		let response = await axios.get(`https://api.genius.com/songs/${geniusID}?text_format=plain`, {
			headers: {
				'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
			},
		});

		if (response.status === 200) {
			response = await axios.get(response.data.response.song.url);
			
			if (response.status === 200) {
				const html = response.data;
				const lyrics = getLyrics(html);

				return res.json({ lyrics }).end();
			} else {
				return res.sendStatus(404).end();
			}
		}
	} catch (err) {
		console.log(err);
	}
});

router.post('/images', async (req, res) => {
	try {
		const { artist } = req.body;

		let results = await image_search({ query: artist, moderate: true });
		results = results.filter(({ width, height }) => width === height && width > 512);

		res.json({ results }).end();
	} catch (err) {
		console.log(err);
	}
})

router.post('/generate', async (req, res) => {
	try {
		const { verses, imageURL } = req.body;

		generateCover(verses, imageURL);


		res.end();
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
