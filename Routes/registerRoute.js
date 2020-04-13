const express = require("express");
const router = express.Router();
const {
  registerUser,
  retryUser,
  verifyUser,
} = require("../controller/registerController");

router.post("/register", (req, res) => {
  registerUser(req.body)
    .then((data) => {
      res.status(data.status).json(data.data);
    })
    .catch((err) => {
      res.status(err.status).json(err.data);
    });
});
router.get("/:id", (req, res) => {
  retryUser(req.params)
    .then((data) => {
      res.status(data.status).json(data.data);
    })
    .catch((err) => {
      res.status(err.status).json(err.data);
    });
});
router.post("/verify", (req, res) => {
  verifyUser(req.body)
    .then((data) => {
      res.status(data.status).json(data.data);
    })
    .catch((err) => {
      res.status(err.status).json(err.data);
    });
});

module.exports = router;
