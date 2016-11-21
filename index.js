var dir = require('node-dir'),
	sPath;


sPath = process.argv[2];

dir.files(sPath, function(err, aFilePaths) {
    if (err) {
    	console.log(err);
    } else {
    	oRegex = new RegExp(/^.*.(mp4|avi|flv)$/i);
    	aVideos = aFilePaths.filter(function(sPath) {
    		return oRegex.test(sPath);
    	});
    	processVideos(aVideos);
    }
});

function processVideos(aVideos) {
	console.log(aVideos);
}