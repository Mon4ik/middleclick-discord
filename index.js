const express = require("express")
const path = require("path")
const fs = require("fs")
const mime = require("mime-types")
const seedrandom = require("seedrandom")

const config = require("./config.json")

const app = express()

function choose(choices, rand) {
    return choices[Math.floor(rand() * choices.length)];
}

app.get("/:seed.gif", (req, res) => {
    const seed = req.params.seed
    const rand = seedrandom(seed)

    const isDiscord = req.header("user-agent").includes("Discordbot")
        || req.header("user-agent").includes("(Macintosh; Intel Mac OS X 11.6; rv:92.0)")

    if (isDiscord) {
        const filesPath = path.join(__dirname, config.imagesDir ?? "images");
        const files = fs.readdirSync(filesPath).map((f) => path.join(filesPath, f))
        const file = choose(files, rand)

        res.sendFile(file)
    } else {
        res.redirect(config.redirectURL)
    }
})

app.get("*", (req, res) => {
    res.status(404).send("Do /seed.gif man")
})

app.listen(config.port, () => console.log(`Server started at :${config.port}`))