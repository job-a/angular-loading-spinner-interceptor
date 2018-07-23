module.exports = (req, res, next) => {
  if (req.method === 'POST' && req.url === '/data') {
    // doSomething()
  }
  next()
}
