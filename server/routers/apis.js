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
      text1: `The scmpl slack application goal is to provide different information via slack slash commands. It is available in the <a href="https://ibm-cc-mpl.slack.com" target="_blank">IBM Systems Center | Montpellier</a> slack workspace<br /> 
        To use it, type <b>/scmpl help</b> in any channel of the workspace
        `,
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
      cards: [
        {
          title: 'GDPS',
          content: `IBM GDPS® is a collection of system recovery offerings on the IBM Z® platform, each of which uses services, clustering technologies, and server and storage replication and automation`,
          img: {
            src: `images/gdps-logo.png`,
            descr: `IBM GDPS logo`
          },
          link: {
            url: `https://www.ibm.com/it-infrastructure/z/technologies/gdps`,
            text: `IBM GDPS`
          }
        },
        {
          title: 'IBM Montpellier Cloud Datacenter',
          content: `Datacenter map with air cooling measurements (migration in progress)`,
          img: {
            src: `images/IBM_green_DC.jpg`,
            descr: `IBM green datacenter`
          },
          link: {
            url: `https://ccmplbot.eu-gb.mybluemix.net/infradc.html`,
            text: `MPL datacenter`
          }
        },
        {
          title: 'Code source repository',
          content: `<img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/benoitclerget/stage-mathieu-web-server?style=plastic">`,
          img: {
            src: `images/github-logo.png`,
            descr: `Github`
          },
          link: {
            url: `https://github.com/benoitclerget/stage-mathieu-web-server`,
            text: `Stage Mathieu github repository`
          }
        },
        {
          title: 'scmpl architecture diagram',
          content: `Click to see the diagram picture (implementation in progress)`,
          img: {
            src: `images/scmpl_slack_app_overview.png`,
            descr: `scmpl architecture diagram`
          },
          link: {
            url: `images/scmpl_slack_app_overview.png`,
            text: `View`
          }
        },
        {
          title: '3 easy steps to making the perfect guacamole',
          content: `Datacenter map with air cooling measurements (migration in progress)`,
          img: {
            src: `https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-731/taco-2.png`,
            descr: `Taco 2`
          },
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

