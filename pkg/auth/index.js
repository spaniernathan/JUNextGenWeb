const bcrypt = require('bcryptjs')
const index = bcrypt.genSaltSync(10);

module.exports = {
    salt: index,
}