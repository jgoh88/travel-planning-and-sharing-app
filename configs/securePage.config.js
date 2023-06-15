function autheticatedUserPage(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect("/user/login")
    } else {
        next()
    }
}

function adminUserPage(req, res, next) {
    if (req.user.role != 'admin') {
        res.render('error/403')
    } else {
        next()
    }
}

module.exports = {autheticatedUserPage, adminUserPage}