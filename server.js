//express setup
const express = require("express");
const app = express();
const PORT = process.env.PORT || 9550;
const path = require("path");

app.use(express.static(path.join(__dirname, "./public")));

// Send the app
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message || "Internal server error");
});

app.listen(PORT, () =>
    console.log(`
        Listening on Port ${PORT}
        http://localhost:${PORT}
`),
);

process.on("SIGINT", () => {
    console.log("Bye bye!");
    process.exit();
});
