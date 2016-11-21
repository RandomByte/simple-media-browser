var dir = require("node-dir"),
	path = require("path"),
	fs = require("fs"),
	crypto = require("crypto"),
	hbs = require("express-hbs"),
	express = require("express"),
	oApp = express(),
	sPath,
	oCollection = {
		aVideos: []
	};


oApp.use("/lib/bootstrap", express.static(path.join(__dirname, "node_modules", "bootstrap", "dist")));
oApp.use("/lib", express.static(path.join(__dirname, "public", "lib")));

oApp.set("view engine", "jade");

oApp.engine("hbs", hbs.express4({  
	partialsDir: path.join(__dirname, "views", "partials"),
	layoutsDir: path.join(__dirname, "views", "layouts")
}));
oApp.set("view engine", "hbs");
oApp.set('views', path.join(__dirname, '/views'));

oApp.get("/", function(req, res) {
	res.render("index", {
		aVideos: oCollection.aVideos
	});
});

oApp.get("/video/:hash", function(req, res) {
	var sPath, oVideo;
	oVideo = oCollection.aVideos.find(function(oVid) {
		return oVid.sHash === req.params.hash;
	});
	if (oVideo) {
		sPath = oVideo.sPath;
		res.sendFile(sPath);
	} else {
		res.status(400).send("Video not found");
	}
});


function initCollection() {
	return new Promise(function(resolve, reject) {
		sPath = process.argv[2];
		dir.files(sPath, function(err, aFilePaths) {
			if (err) {
				console.log(err);
			} else {
				oRegex = new RegExp(/^.*.(mp4|avi)$/i); // TODO flv
				aVideos = aFilePaths.filter(function(sPath) {
					return oRegex.test(sPath);
				});
				processVideos(aVideos).then(resolve, reject);
			}
		});
	});	
}

function processVideos(aVideoPaths) {
	return new Promise(function(resolve, reject) {
		var aPromises = [];
		console.log("Found " + aVideoPaths.length + " videos");
		for (var i = 0; i < aVideoPaths.length; i++) {
			aPromises.push(createVideoObject(aVideoPaths[i]));
		}
		Promise.all(aPromises).then(function() {
			oCollection.aVideos.sort(function(a, b) {
				return b.iTimestamp - a.iTimestamp;
			})
			resolve();
		}, reject);
	});
}

function createVideoObject(sPath) {
	return new Promise(function(resolve, reject) {
		fs.stat(sPath, function(err, stats) {
			if (err) {
				reject(err);
			} else {
				var sHash, oVideo;
				sHash = getHashForString(sPath);
				oVideo = {
					sPath: sPath,
					iTimestamp: stats.birthtime.getTime(),
					sHash: sHash
				};
				oCollection.aVideos.push(oVideo);
				resolve();
			}
		});
	});
}

function getHashForString(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

initCollection().then(function() {
	oApp.listen(8080);
	console.log("Server running on port " + 8080);
}, function(err) {
	console.log("Error!");
	console.log(err);
})
