var path = require("path"),
	hbs = require("express-hbs"),
	express = require("express"),
	oCollection = require("./lib/collection"),
	oApp = express();

oApp.use("/lib/bootstrap", express.static(path.join(__dirname, "node_modules", "bootstrap", "dist")));
oApp.use("/lib/tether", express.static(path.join(__dirname, "node_modules", "tether", "dist")));
oApp.use("/lib/jquery", express.static(path.join(__dirname, "node_modules", "jquery", "dist")));

oApp.set("view engine", "jade");

oApp.engine("hbs", hbs.express4({
	partialsDir: path.join(__dirname, "views", "partials"),
	layoutsDir: path.join(__dirname, "views", "layouts")
}));
oApp.set("view engine", "hbs");
oApp.set("views", path.join(__dirname, "/views"));

oApp.use("/", require("./controller/collection"));

oCollection.init().then(function() {
	oApp.listen(8080);
	console.log("Server running on port " + 8080);
}, function(err) {
	console.log("Unexpected error:");
	console.log(err);
});
