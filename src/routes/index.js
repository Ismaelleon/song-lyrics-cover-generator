const router = require('express').Router(),
	axios = require('axios');

router.post('/search', async (req, res) => {
	try {
		const { query } = req.body;

		const res = await axios.get(`https://api.genius.com/search?q=${query}`, {
			headers: {
				'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
				'Content-Type': 'application/json',
			},
		});

		if (res.status === 200) {
			let songs = res.data.response.hits.map(result => {
				if (result.type === 'song') {
					let songData = result.result;

					return {
						title: songData.title,
						artist: songData.artist_names,
						geniusID: songData.id,
					};
				}
			});

			console.log(songs)
		}

	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
