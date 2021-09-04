const express = require('express');
const router = express.Router();

router.get('/', (req, resp) => {
    resp.render('index', { title: 'My express App', message: 'Hello' });
    // resp.send('Hello world - api restful');
});

module.exports = router;