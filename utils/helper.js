const User = require('../models/users')

const userInDB = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}


module.exports = {
    userInDB
}