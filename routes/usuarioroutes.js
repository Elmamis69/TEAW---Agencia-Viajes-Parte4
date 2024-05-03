const express = require('express');
const router = express.Router();

router.get('/registrar', (req, res) => {
    res.sendFile(__dirname + '/registrar/registrar.html');
});

module.exports = router;
