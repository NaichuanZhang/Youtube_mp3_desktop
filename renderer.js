const ipc = require('electron').ipcRenderer
const saveBtn = document.getElementById('save-dialog');
const fs = require('fs');
const download = require('download');
const {clipboard} = require('electron');
const request = require("request");

//update filename and targetLink automatically
var targetLink
setInterval(function () {
  document.getElementById('input_url').value = clipboard.readText() // automatically paste url after copy
  targetLink = document.getElementById('input_url').value
}, 1000);

function downloadInit (targetLink) {
  var options = {
    method: 'GET',
    url: 'http://www.convertmp3.io/fetch/',
    qs: { 
      format: 'JSON',
      video: targetLink 
    }
  };
  request(options, function(error, response, body){
    if (error) throw new Error(error);
    try {
      var titleStr = JSON.parse(body.toString()).title;
      ipc.send('save-dialog', titleStr);
    } catch(err) {
      alert("this music is unavaliable to download");
    }
  });
}

saveBtn.addEventListener('click', function (event) {
  if (targetLink == undefined){
    alert("empty input");
  } else {
    downloadInit(targetLink);
  }
})

//ipc function
ipc.on('saved-file', function (event, path) {
  if (!path) path = 'No path'
  console.log(`Path selected: ${path}`)
  console.log(path)
  choosed_path = path
  var options = { 
    method: 'GET',
    url: 'http://www.convertmp3.io/fetch/',
    qs:{ 
          format: 'JSON',
          video: targetLink
    },
    headers:{ 
      'postman-token': 'fad29ca6-4d48-649d-8738-2f2b6d929bf6',
       'cache-control': 'no-cache' 
    } 
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(response);
    try {
      body = JSON.parse(body)
      download_link =body.link.toString()
      download_link =download_link.toString()
      download(download_link).then(data => {
        try {
          fs.writeFileSync(path, data);
        } catch( err ){
          console.log("failed");
        }
          
      });
    } catch ( err ) {
      alert("this music is unavaliable to download")
    }
  });
})
