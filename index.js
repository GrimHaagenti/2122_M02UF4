#!/usr/bin/node



let http = require("http");

let mongo_client = require("mongodb").MongoClient;

let url = "mongodb://localhost";

let db;

let fs = require("fs");

console.log("iniciando servidor");
mongo_client.connect(url, function(err, conn ){

	console.log("Dentro de Mongo");
	
	if (err){  
		console.log("ERROR!!");
		return;
	}
	
	db = conn.db("tffhd");
});

http.createServer(function(req, res) {
 res.writeHead(200);

	let ret_val = "";
	if (req.url == "/")
	{	
		fs.readFile("index.html",function (err, data) {
			res.writeHead(200, {"Content-Type":"text/html"});		
			res.end(data);
		});
		return;
	}

	if (req.url == "/characters") {
		

		ret_val = "characters";
		

	}else if (req.url == "/items"){

		ret_val = "items";

		
	}else if (req.url == "/weapons"){

		ret_val = "weapons";
	}else
	{	
		res.end();	
		return;
	}
	
	let split_url = req.url.split("/");
	


	let collection_used = db.collection(ret_val).find();
	let col_arr = [];
	let char_string ;


	collection_used.toArray(function(err,data){
	
	char_string = JSON.stringify(data);

	res.end(char_string);
	});



;


/*	characters.forEach(function(character){chara_arr.push(character);

	
	console.log(chara_arr);

	}

	);*/
	



}
).listen(3000);



