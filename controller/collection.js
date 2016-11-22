const
	express = require("express"),
	oRouter = new express.Router(),
	oCollection = require("../lib/collection");

oRouter.get("/", function(req, res) {
	res.render("index", {
		aVideos: oCollection.getVideos()
	});
});

oRouter.get("/video/:hash", function(req, res) {
	var sPath, oVideo;
	oVideo = oCollection.getVideo(req.params.hash);
	if (oVideo) {
		sPath = oVideo.sPath;
		res.sendFile(sPath);
	} else {
		res.status(400).send("Video not found");
	}
});

module.exports = oRouter;
