var dir = require("node-dir"),
	fs = require("fs"),
	crypto = require("crypto"),
	sPath,
	oCollection = {
		aVideos: []
	};

const Collection = {
	init() {
		var that = this;
		return new Promise(function(resolve, reject) {
			sPath = process.argv[2];
			dir.files(sPath, function(err, aFilePaths) {
				if (err) {
					console.log(err);
				} else {
					let oRegex, aVideos;
					oRegex = new RegExp(/^.*.(mp4|avi)$/i); // TODO flv
					aVideos = aFilePaths.filter(function(sPath) {
						return oRegex.test(sPath);
					});
					that._processVideos(aVideos).then(resolve, reject);
				}
			});
		});
	},

	getVideos() {
		return oCollection.aVideos;
	},

	getVideo(sHash) {
		return oCollection.aVideos.find(function(oVid) {
			return oVid.sHash === sHash;
		});
	},

	_processVideos(aVideoPaths) {
		var that = this;
		return new Promise(function(resolve, reject) {
			var aPromises = [],
				i;

			console.log("Found " + aVideoPaths.length + " videos");
			for (i = 0; i < aVideoPaths.length; i++) {
				aPromises.push(that._createVideoObject(aVideoPaths[i]));
			}
			Promise.all(aPromises).then(function() {
				oCollection.aVideos.sort(function(a, b) {
					return b.iTimestamp - a.iTimestamp;
				});
				resolve();
			}, reject);
		});
	},

	_createVideoObject(sPath) {
		var that = this;
		return new Promise(function(resolve, reject) {
			fs.stat(sPath, function(err, stats) {
				if (err) {
					reject(err);
				} else {
					var sHash, oVideo;
					sHash = that._getHashForString(sPath);
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
	},

	_getHashForString(str) {
		return crypto.createHash("md5").update(str).digest("hex");
	}
};

module.exports = Collection;
