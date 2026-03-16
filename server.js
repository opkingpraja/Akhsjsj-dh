require("dotenv").config()

const express = require("express")
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const fs = require("fs")

const app = express()

// save image in this folder
const upload = multer({ dest: "uploads/" })

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

// form page
app.get("/", (req, res) => {

  const pass = req.query.pass

  if(pass !== process.env.PASSWORD){
    return res.send("Access Denied")
  }

  res.sendFile(__dirname + "/index.html")
})

// upload route
app.post("/upload", upload.single("image"), async (req, res) => {

  try {

    const result = await cloudinary.uploader.upload(req.file.path)

    // delete local file
    fs.unlinkSync(req.file.path)

    res.send(`
      <h2>Image Uploaded</h2>
      <img src="${result.secure_url}" width="300">
      <p>${result.secure_url}</p>
    `)

  } catch (err) {
    res.send(err)
  }

})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running")
})