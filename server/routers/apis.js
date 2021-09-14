// dbm web app private routes
const util = require('util')
const os = require('os')
const exec = util.promisify(require('child_process').exec)
const express = require('express')
const httpStatus = require('http-status')

module.exports = function(app, appName, appVersion, gitRepo) {
  const router = express.Router()

  // user infos
  router.get('/api/user_infos', async function(req, res) {
    let result = {
      err: null,
      userinfo: {
        name: 'Martin Dupont',
        email: 'mdupont@mail.com',
      },
    }
    res
    .status(httpStatus.OK)
    .json(result)
    .end()
  })

  // app news
  router.get('/api/app_news', async function(req, res) {
    let result = {
      err: null,
      titre: `Welcome to SCMPL slack bot application`,
      text1: `One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked. "What's happened to me?" he thought. It wasn't a dream. His room, a proper human`,
      text2: `Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to`,
      news: [
        {
          title: 'This is the title of the latest news',
          text: `Hello this is the latest news content`
        },
        {
          title: 'This is the title of the second news',
          text: `Hello this is the second news content`
        },
      ],
    }
    res
    .status(httpStatus.OK)
    .json(result)
    .end()
  })

  // system infos
  router.get('/api/system_infos', async function(req, res) {
    let result = {
      err: null,
      system: {
        arch: os.arch(),
        cpus: os.cpus(),
        endianness: os.endianness(),
        freemem: os.freemem(),
        hostname: os.hostname(),
        platform: os.platform(),
        totalmem: os.totalmem(),
        type: os.type(),
        version: os.version(),
        os_name: '?',
        os_version: '?',
        docker: false,
        kubepods: false,
      },
      web_app: {
        name: appName,
        version: appVersion,
        dirname: __dirname,
        repository: gitRepo,
      }
    }
    // get nodejs version
    try {
      const { stdout, stderr } = await exec('node -v');
      result.web_app.node_js = stderr&stderr!=''?'':stdout
    } catch(e) {
      result.web_app.node_js = '?'
    }
    // get system os name from cat /etc/os-release
    try{
      // get os Name 
      const { stdout, stderr } = await exec("cat /etc/os-release | grep ^NAME=")
      result.system.os_name = stderr&stderr!=''?'':stdout.split('=')[1]
    } catch(e){
      console.error(`Error trying to get os name`)
    }
    // get system os version from cat /etc/os-release
    try{
      // get os Version 
      const { stdout, stderr } = await exec("cat /etc/os-release | grep ^VERSION=")
      result.system.os_version = stderr&stderr!=''?'':stdout.split('=')[1]
    } catch(e){
      console.error(`Error trying to get os version`)
    }
    
    // get docker info 
    try{
      const { stdout, stderr } = await exec("cat /proc/self/cgroup |grep /docker")
      result.system.docker_self_cgroup = stderr&stderr!=''?'':stdout
      if(result.system.docker_self_cgroup!='') {
        result.system.docker = true
      }
    } catch(e){
      result.system.docker_self_cgroup = ''  // assuming that if the file is not present then this is not a docker container... 
    }
    // get kubernetes infos
    try{
      const { stdout, stderr } = await exec("cat /proc/self/cgroup |grep /kubepods")
      result.system.kubepods_self_cgroup = stderr&stderr!=''?'':stdout
      if(result.system.kubepods_self_cgroup!='') {
        result.system.kubepods = true
      }
    } catch(e){
      result.system.kubepods_self_cgroup = ''  // assuming that if the file is not present then this is not a docker container... 
    }
    
    res
    .status(httpStatus.OK)
    .json(result)
    .end()
  })

  app.use(router)
}

