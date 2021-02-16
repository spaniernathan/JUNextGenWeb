module.exports = {
    pathParser: (req, res, next) => {
        if (req.url !== '/favicon.ico' && !req.url.includes('/public/')) {
          req.session.previousPath = req.session.currentPath
          req.session.currentPath = req.url
        }
        next()
      },
    redirectIfNotLoggedIn: (req, res, next) => {
      if (!req.session.currentUser) {
        req.session.currentUser = { logged: false }
      }
      if (!['/', '/contact', '/about', '/login', '/signup'].includes(req.session.currentPath) &&
          req.session.currentUser.logged === false) {
        res.redirect('/login');
      } else {
        next();
      }
    }
}
