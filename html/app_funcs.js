
// first page loading: show list of employess
document.addEventListener("DOMContentLoaded", async function() {
  if (window.fetch) {
    try{
      let response = await fetch('/api/app_news')
      if(response.ok) {
        response.json().then(function(myJson) {
          if (!myJson.err) {
            // set values into the dom
			document.getElementById("app_titre").innerHTML = myJson.titre;
            document.getElementById("app_texte_1").innerHTML = myJson.news[1].text;
            document.getElementById("app_texte_2").innerHTML = myJson.text2;
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