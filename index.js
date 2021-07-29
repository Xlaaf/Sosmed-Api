const express = require("express");
const app = express();
const port = process.env.port || 8080 || 5000 || 3000
const cors = require("cors");
const http = require("http");
const https = require("https");
const path = require("path")
const Client = require('brainly-client')
const brainly = new Client({ server: 'ID' }) // Spain server
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

app.use(cors());

app.get("/", (req, res) => {
  setImmediate(() => {
    try {
      res.setHeader("Cache-Control", "public,max-age=0");
      res.sendFile(path.join(__dirname, "../index.html"));
    } catch (e) {
      res.status(400).send("Something went wrong");
    }
  });
});

app.get("/br", (req, res) => {
    const soal = req.query.soal
    res.setHeader("Cache-Control", "public,max-age=3600,s-maxage=30");
    setImmediate(() => {
      try {
        if(soal == '' || soal == null){
          res.status(400).send({
            code: res.statusCode,
            success: false,
            message: "Soal Silahkan Diisi",
            creator: "kurayantod"
          });
        }else{
          brainly.search(soal)
          .then(questions => {
                const question = questions[0]
                const answer = question.answers[0]
                res.json({
                    status : true,
                    creator : 'kanzaki',
                    soal : question,
                    jawaban : answer
                })
            })
            .catch((err) => console.log(err));
        }
      } catch (e) {
        res.status(400).send("Mungkin ada yang error");
      }
    });
});

app.use(express.urlencoded({ extended: false }));
app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});
