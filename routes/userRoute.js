const express = require('express')
const router = express.Router()

const {getAllUsers,createUsers,getUser,updateUser,deleteUser} = require("./../controllers/userController")
const {signUp,login} = require('./../controllers/authController')

router.route('/signup').post(signUp)
router.route('/login').post(login)

router.route('/').get(getAllUsers).post(createUsers)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router