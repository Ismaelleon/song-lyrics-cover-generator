const express = require('express'),
	bodyParser = require('body-parser'),
	router = require('./routes/index');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// middlewares
app.use(bodyParser.json());

app.use('/api', router)

app.listen(port, () => {
	console.log(`app running on port ${port}`);
});
