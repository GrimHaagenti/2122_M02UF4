#!/usr/bin/node
let http = require("http");

let mongo_client = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectID;

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


function create_list(res, ret_value){

	let col;

	if(ret_value == "characters" ){
		col = "characters"
	}else if(ret_value = "items"){
	col = "items";}
	else{ res.end();return;}

	let collection_used = db.collection(col).find();
	let col_arr = [];
	let char_string ;


	collection_used.toArray(function(err,data){
			char_string = JSON.stringify(data);
			res.end(char_string);
			console.log ("list ready")
			})
	};


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

	let split_url  = req.url.split("/");
	
	if (split_url.length == 2) {		

		create_list(res, split_url[1]);
		return;

	
	} if(split_url[2].length != 24){
		res.end()
		return;
		}
	
	if (split_url[1] == "characters"){
		let chara_id = new ObjectId(split_url[2]);
		let chara_data = db.collection("characters").find({"_id":chara_id});

		chara_data.toArray(function(err,data){ 
			let data_string = JSON.stringify(data);
			
			res.end(data_string);
			});

			return;
	}	
	if(split_url[1] == "removeChara"){
		let rChara_id = new ObjectId(split_url[2]);

		let rChara_data = db.collection("characters").find({"_id":rChara_id});
		let data_string; 

		db.collection("characters").deleteOne({"_id":rChara_id});
		rChara_data.toArray(function(err,data){
	
		
		let resEnd_string = "";
		if (data != "" ){	
		resEnd_string = "<H1> Personaje " + data[0].name  + " eliminado! </H1>"; }
		else {
		resEnd_string = "No existe!";
		}
		res.end(resEnd_string);
				
		});
		return;
}
	if (split_url[1] == "items"){
		let item_id = new ObjectId(split_url[2]);
		let item_data = db.collection("items").find({"_id":item_id});

		item_data.toArray(function(err,data){ 
			let data_string = JSON.stringify(data);
			
			res.end(data_string);
			});
			return;
	}	
	if(split_url[1] == "removeItem"){
		let rItem_id = new ObjectId(split_url[2]);

		let rItem_data = db.collection("items").find({"_id":rItem_id});
		let data_string;
		
		db.collection("items").deleteOne({"_id":rItem_id});
		rItem_data.toArray(function(err,data){
		let resEnd_string = "";
		if ( data !=""){
		resEnd_string = "<H1> Objeto " + data[0].item  + " eliminado! </H1>"; 

		}else{resEnd_string = "No hay nada!"}
		res.end(resEnd_string);
		
		});
	return;
	}
	else
	{	
		res.end();	
		return;
	}
	}).listen(3000);



