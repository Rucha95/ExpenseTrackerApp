const express = require("express");
const db = require("../config/db");
const { addExpense, getExpenses, getCategoryId, gettotalExpenseByCategory } = require("../controller/expenseController");
const authenticate = require("../middleware/authentication");

const router = express.Router();

router.post("/add", addExpense);
//router.get("/get", authenticate, getExpenses);
router.get("/get", getExpenses);
router.get("/categories",getCategoryId);
router.get("/totalExpenseByCategory",gettotalExpenseByCategory);



module.exports = router;
