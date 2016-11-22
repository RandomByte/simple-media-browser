const
	express = require("express"),
	oRouter = new express.Router(),
	oCollection = require("../lib/collection"),
	PAGE_SIZE = 20;

oRouter.get("/all", function(req, res) {
	res.render("index", {
		aVideos: oCollection.getVideos()
	});
});

oRouter.get("/:page?", function(req, res) {
	var iPage, iTotalPages, aVideos, aPages,
		idx, i;
	iPage = parseInt(req.params.page, 10);

	if (!iPage) {
		// Defaulting and to make 0 -> 1 (so UI sees first page as "one")
		iPage = 1;
	}

	idx = PAGE_SIZE * (iPage - 1); // Start at 0
	aVideos = oCollection.getVideos();

	// Calculate pages
	iTotalPages = Math.ceil(aVideos.length / PAGE_SIZE);
	aPages = [];
	i = 0;
	while (i < iTotalPages) {
		aPages[i] = {
			iPage: i + 1,
			bCurrent: i === iPage - 1
		};
		i++;
	}

	res.render("index", {
		aVideos: aVideos.slice(idx, idx + PAGE_SIZE),
		aPages: aPages,
		bFirstPage: iPage === 1,
		bLastPage: iPage === iTotalPages,
		iCurrentPage: iPage,
		iPreviousPage: iPage === 1 ? null : iPage - 1,
		iNextPage: iPage < iTotalPages ? iPage + 1 : null
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
