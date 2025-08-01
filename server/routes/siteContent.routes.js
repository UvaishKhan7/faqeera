const express = require('express');
const router = express.Router();
const { getActiveHeroSlides } = require('../controllers/siteContent.controller');

router.route('/hero-slides').get(getActiveHeroSlides);

module.exports = router;