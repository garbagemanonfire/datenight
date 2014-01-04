var http = require('http');
var url = require('url');
 
yelp = require('yelp').createClient({
  consumer_key: "sOpnEMjxxOJT9o2-TuczeQ",
  consumer_secret: "URVFfpTxXkfx55Jt74IuvKmGz2k",
  token: "Qx_zcTVcrma7NBQkyUw9n8e3N-uRsyal",
  token_secret: "EnPUU_HlKUY9FmtSQBc1yFKTJsA"
});

http.createServer(function (req, resp) {
  var searchObject = url.parse(req.url, true).query
  yelp.search(searchObject, function (err, data) {
    if(!err) {
      resp.end(JSON.stringify(data));
    }
  });
}).listen(7357);
 
console.log("Server Listening on 7357");


// you can query items by using a statment like: http://localhost:7357/?term=food&location=Portland