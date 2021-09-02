module.exports = function(app, appName, appVersion, gitRepo){
    // public routes
    // api routes
    require('./apis')(app, appName, appVersion, gitRepo)
    require('./health')(app, appName, appVersion)
    require('./html')(app)
}
