const fs = require('node:fs');
const { log } = require('node:util');

// create a file using this method
fs.writeFile('text.txt'," Hello ,My Name is Gaurav",function(err){
    if(err) console.log(err);
    else console.log("all done");
})
 // add some text using append method
fs.appendFile('text.txt'," What are you doing ,I Hope you are very well ",function(err){ 
    if(err) console.log(err);
    else console.log("all set");
});

// rename the file 
 fs.rename('text.txt','node_js.js',function(err){
    if(err) console.log(err);
    else console.log('done');
 });

 // copy any file using copy file 
 fs.copyFile('node_js.js',"./new/node_js1.js",function(err){
    //jab folder exist nahi hoga to error aaye ge agar folder exist karta hai to error nahi aayege 
    if(err) console.log(err.message);
    else console.log('copied');
 })

 //any file to delete using unlink
 fs.unlink('./node_js.js',(err)=>{
    if(err) console.log(err);
    else console.log('deleted');
 });

 // creating a server in basic 
 const http = require('node:http');
 const server = http.createServer((req,res)=>{
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.end('Hello ,My Name is Gaurav What are you doing ,I Hope you are very well \n');
 });
 server.listen(8080);
 console.log('server started on port 8080');
