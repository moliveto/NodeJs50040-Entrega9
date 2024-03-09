const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const handlebars = require("express-handlebars");
const displayRoutes = require("express-routemap");
const viewsRoutes = require("./routes/views.routes");
const sessionRoutes = require("./routes/session.routes");
const productsRoutes = require("./routes/products.routes");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const passport = require('passport');
const initializePassport = require("./config/passport.config");

const cfg = require('./config.cjs');
const { mongoURI } = cfg;

const app = express();
const PORT = 3000;
const SECRET_SESSION = "session-secret";
const sessionOptions = {
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
        mongoUrl: mongoURI,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 1 * 24 * 60 * 60,
    }),
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session(sessionOptions));

initializePassport();
app.use(passport.initialize())

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

mongoose
    .connect(mongoURI)
    .then((conn) => {
        console.log("Mongo CONECTADO!");
    })
    .catch((err) => {
        console.log("Mongo ~ err:", err);
    });

app.use("/", viewsRoutes);
app.use("/api/session/", sessionRoutes);
app.use("/api/products", productsRoutes);

app.listen(PORT, () => {
    displayRoutes(app);
    console.log(`Listening on ${PORT}`);
});