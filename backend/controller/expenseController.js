const db = require("../config/db");

const addExpense = (req, res) => {
  const { user_id, category_id, amount, expense_date } = req.body;
  //const user_id = req.user.id;
  console.log(req.body);

  if (!user_id || !category_id || !amount || !expense_date ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const sql = "INSERT INTO Expense (user_id, category_id, amount, expense_date) VALUES (?, ?, ?, ?)";
  db.query(sql, [user_id, category_id, amount, expense_date], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error." });

    res.status(201).json({ message: "Expense added successfully." });
  });
};

const getExpenses = async (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).json({ error: "userId query parameter is required." });
      }
    try{
        const [expenseDetails] = await db.query(`select c.name as category_name, u.username as user_name,e.amount,DATE_FORMAT(e.expense_date,'%d/%m/%Y') as date from Expense e join Category c on e.category_id=c.id join User u on e.user_id = u.id where u.id=?`,[userId]);
        const[totalAmount] = await db.query(`SELECT SUM(e.amount) AS total_amount FROM Expense e JOIN User u ON e.user_id = u.id WHERE u.id =?`,[userId]);
        res.json({
            expenses:expenseDetails,
            total:totalAmount,
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({error: "An error occured while fetching expenses"});
    }
//     const query = `select c.name as category_name, u.username as user_name,e.amount,DATE_FORMAT(e.expense_date,'%d/%m/%Y') as date from Expense e join Category c on e.category_id=c.id join User u on e.user_id = u.id where u.id=?;`;
//     db.query(query, [userId],(err,results)=>{
//         if(err){
//             console.error("error in query",err.message);
//             res.status(500).json({error:"failed to fetch expenses"});
//             return;
//         }
//         if (results.length === 0) {
//             res.status(404).json({ message: "No expenses found for this user." });
//             return;
//           }
//           res.status(200).json(results);
//     });
// //   const user_id = req.user.id;

//   const sql = "SELECT * FROM Expense WHERE user_id = ?";
//   db.query(sql, [user_id], (err, results) => {
//     if (err) return res.status(500).json({ error: "Database error." });

//     res.json(results);
//   });
};

const getCategoryId = async (req,res) => {
  try{
    const[categories] = await db.query(`SELECT id,name from Category`);
    res.json(categories);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories." });
  }

}

const gettotalExpenseByCategory = async (req,res) => {
  const userId =req.query.userId;
  try{
    const[totalExpenseByCategory] = await db.query(`SELECT Category.name AS name, SUM(Expense.amount) AS total FROM Expense INNER JOIN Category ON Expense.category_id = Category.id WHERE Expense.user_id=? GROUP BY Category.name;`,[userId])
    res.json(totalExpenseByCategory);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: "Failed to fetch total Expenses by category." });
  }
}

module.exports = { addExpense, getExpenses, getCategoryId, gettotalExpenseByCategory };
