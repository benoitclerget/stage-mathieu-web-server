
// first page loading: show list of employess
document.addEventListener("DOMContentLoaded", async function() {
  if (window.fetch) {
    try{
      let response = await fetch('/api/system_infos')
      if(response.ok) {
        response.json().then(function(myJson) {
          if (!myJson.err) {
            // set values into the dom
            let app_div_webapp_infos_elem = document.getElementById('app_webapp_infos');
            app_div_webapp_infos_elem.innerHTML = `<span class="app--type-mono-scale_4">Name: ${myJson.web_app.name}</span><br />
            <span class="app--type-mono-scale_4">Version: ${myJson.web_app.version}</span><br />
            <span class="app--type-mono-scale_4">Nodejs: ${myJson.web_app.node_js}</span><br />
            <span class="app--type-mono-scale_4"><a href="${myJson.web_app.repository.url}" target="_blank">Git repository</a></span>
            `
            let app_div_system_infos_elem = document.getElementById('app_system_infos');
            let system_infos_tmp = ``
            if(myJson.system.docker) {
              system_infos_tmp.innerHTML = `<span class="app--type-mono-scale_4">Run in docker container: <span style="color: green">Yes</span></span><br />`
            }
            if(myJson.system.kubepods) {
              system_infos_tmp += `<span class="app--type-mono-scale_4">Run in Kubernetes pods: <span style="color: green">Yes</span></span><br />`
            }
            system_infos_tmp += `<span class="app--type-mono-scale_4">Hostname: ${myJson.system.hostname}</span><br />
            <span class="app--type-mono-scale_4">OS name: ${myJson.system.os_name}</span><br />
            <span class="app--type-mono-scale_4">OS version: ${myJson.system.os_version}</span><br />
            <span class="app--type-mono-scale_4">Architecture: ${myJson.system.arch}</span><br />
            <span class="app--type-mono-scale_4">Platform: ${myJson.system.platform}</span><br />
            <span class="app--type-mono-scale_4">Type: ${myJson.system.type}</span><br />
            <span class="app--type-mono-scale_4">Cpus Nb: ${myJson.system.cpus.length}</span><br />
            <span class="app--type-mono-scale_4">Endianness: ${myJson.system.endianness}</span><br />
            <span class="app--type-mono-scale_4">Mem free / total: ${formatMemNb(myJson.system.freemem)} / ${formatMemNb(myJson.system.totalmem)}</span>
            `
            app_div_system_infos_elem.innerHTML = system_infos_tmp
          } else {
            console.error('API error: ' + myJson.message);
          }
        });
      } else {
        console.error('response error: ' + response.ok);
      }
  
    } catch(error) {
      console.error('Error with fetch operation: ' + error);
    }
  } else {
    console.error('fetch not supported');
  }

})


function formatMemNb(bytes) {
	let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
	if (bytes == 0) a = '0 Byte'
	let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
	return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}