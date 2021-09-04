function log(req, resp, next) {
    console.log('Logging...');
    next();
}

module.exports = log;