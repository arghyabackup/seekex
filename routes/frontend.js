const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');
const { siteAuth } = require('../config/authentication');
const indexCon = require('../controller');

router.get('/', indexCon.getHome);
router.get('/product', indexCon.getProduct);
router.get('/suggest-space', indexCon.getSuggestedSpace);
router.get('/rack', indexCon.getRack);
router.get('/rack/order', indexCon.getRackOrder);
router.post('/rack/post-order', indexCon.getRackPostOrder);
router.post('/delete', indexCon.dataDelete);
router.post('/add-product-sku', indexCon.addProductSku);
router.post('/rack-store', indexCon.rackStore);
router.post('/get-suggest-space', indexCon.getSuggestedSpaceLists);



router.get('/error', indexCon.errorPage);
router.post('*', indexCon.errorPage);
router.get('*', indexCon.errorPage);

module.exports = router;