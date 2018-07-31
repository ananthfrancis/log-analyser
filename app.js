const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('mz/fs');
var concat = require('concat-files');
const app = express();
const util = require('util');
var process = require('process');

 
// default options
app.use(fileUpload());
 
app.post('/upload/:name', function(req, res) {
  let serverName = req.params.name;
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
  console.log(req.params)
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  let path= process.env.log_location
  //const path = '/Users/ananthfrancis/Documents/test/central_log/'+serverName + '/';
  //const path = path+serverName + '/';
  console.log(sampleFile)
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(path + serverName + '/' +req.files.sampleFile.name)
  		.then(function(){ 
  			return fs.readdir(path+serverName)
  		})
  		.then(function(files) {
  			const concatPromise = util.promisify(concat);
  			console.log(files)
  			files = files.map(filename => path + filename);
  			return concatPromise(files, path+serverName+'/access.log' );
  		}).then(function(){
  			console.log("Deleting function called")
  			return fs.unlink(path+serverName+'/'+req.files.sampleFile.name)
  		})
  		.then(function(){
  						console.log("deleted")
  			  			return res.send('File uploaded!');
  		})	
  		
});

app.get('/getData/kong/:name', function(req,res){
	let error_number = req.params.name;
	res.status(200).sendFile('/Users/ananthfrancis/Documents/401.log')
});


app.listen(3000, () => console.log('app listening on port 3000!'))