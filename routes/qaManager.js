var express = require("express");
var router = express.Router();

var data = [
    {
        question: "qustion1",
        answer: "answer1"
    }
]

function authUser(req, res, next) {
  if (req.user == null) {
    res.status(403);
    return res.send("You need to sign in");
  }
  next();
}

function authRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(401);
      return res.send("Not Allowed");
    }
    next();
  };
}


router.get("/", (req, res) => {
  res.status(200).send("Home Page of qaManager");
});

//Questions
router.get("/questions", (req, res) => {
    res.status(200).send("Home Page of Questions");
  });
  

router.put("/questions", (req, res) => {
    res.status(200).send("Questions Created");
});

router.post("/questions", (req, res) => {
    res.status(200).send("Questions Updated");
});

router.delete("/questions", (req, res) => {
    res.status(200).send("Questions Deleted");
});


//Answers
router.get("/answers", (req, res) => {
    res.status(200).send("Home Page of Answers");
  });
  

router.put("/answers", (req, res) => {
    res.status(200).send("answers Created");
});

router.post("/answers", (req, res) => {
    res.status(200).send("answers Updated");
});

router.delete("/answers", (req, res) => {
    res.status(200).send("answers Deleted");
});

module.exports = router;
