require("dotenv").config()
const express = require("express");
const cors = require("cors")
const { userRoute } = require("./user/index")
const app = express();

app.use(express.json())
app.use(cors("*"))
app.use("/user/v1", userRoute)


function main() {
    app.listen(3001, () => {
        console.log("server is running on port 3001")
    })
}
main()