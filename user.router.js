// create user router

var express = require('express');
var router = express.Router();
var user_controller = require('./user.controller.js');

router.post('/create',()=> user_controller.user_create);
router.get('/:id', user_controller.user_details);
router.put('/:id/update', user_controller.user_update);
router.delete('/:id/delete', user_controller.user_delete);
router.post('/login', user_controller.user_login);
router.get('/', user_controller.user_list);

module.exports = router;
