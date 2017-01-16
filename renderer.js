const ipc = require('electron').ipcRenderer
var choosed_path
const saveBtn = document.getElementById('save-dialog')
const fs = require('fs');
const download = require('download');
const request = require("request");
const {clipboard} = require('electron')

var target_link
setInterval(function () {
  document.getElementById('input_url').value = clipboard.readText() // automatically paste url after copy
  target_link = document.getElementById('input_url').value
  console.log(target_link)
}, 1000);
saveBtn.addEventListener('click', function (event) {
  if (target_link == undefined){
    alert("empty input")
  }
  ipc.send('save-dialog')
})

//ipc function
ipc.on('saved-file', function (event, path) {
  if (!path) path = 'No path'
  console.log(`Path selected: ${path}`)
  console.log(path)
  choosed_path = path
  console.log(typeof choosed_path)
  var download_link
  //Make the api request  TODO: Modify the video string
  var video_link = target_link// this string
  var options = { method: 'GET',
    url: 'http://www.youtubeinmp3.com/fetch/',
    qs:
     { format: 'JSON',
       video: video_link },
    headers:
     { 'postman-token': 'fad29ca6-4d48-649d-8738-2f2b6d929bf6',
       'cache-control': 'no-cache' } };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    body = JSON.parse(body)
    //is able to get the download link from the api
    //console.log(body.link);
    download_link =body.link.toString()
    download_link =download_link.toString()
    //console.log(typeof download_link)
    download(download_link).then(data => {
        fs.writeFileSync(path, data);
    });
  });
  console.log(typeof download_link) //variable type change when the scope changes
})
