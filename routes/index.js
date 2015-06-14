var express = require('express');
var router = express.Router();

router.get('/recorridos/:id', function(req, res, next){
	res.render('recorridos', { id: req.params.id });


});


module.exports = router;
