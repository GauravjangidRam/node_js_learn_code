const fs = require('node:fs');

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