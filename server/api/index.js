const express = require("express")
const cors = require("cors")
const { generateData } = require("../generateData")

const app = express()
app.use(cors())
app.use(express.json())

app.post("/", async (req, res) => {
  const prompt = req.body.prompt
  console.log(prompt)
  // if (!prompt) {
  //   res.send("Please provide a prompt")
  //   return
  // }
  // if (prompt.length > 100) {
  //   res.send("Prompt must be less than 100 characters")
  //   return
  // }
  // if (prompt.length < 1) {
  //   res.send("Prompt must be at least 1 character")
  //   return
  // }

  console.log("Generating data")
  const data = await generateData(prompt)
  console.log(data)
  res.send(data)
})

app.listen(3000, () => {
  console.log("app listening on port 3000!")
})
