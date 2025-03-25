const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser); //criar usuario
router.get('/', userController.getAllUsers); //pegar todos os usuarios
router.get('/:id', userController.getUserById); //pegar um usuario pelo id
router.put('/:id', userController.updateUser); //atualizar um usuario pelo id
router.delete('/:id', userController.deleteUser); //deletar um usuario pelo id

module.exports = router;