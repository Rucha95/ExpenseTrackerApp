import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";
import "./Addexpense.css";

function Addexpense() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/expenses/categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to fetch categories.");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !amount || !date) {
      alert("Please fill in all fields!");
      return;
    }

    const user_id = 1;
    const payload = {
      user_id,
      category_id: selectedCategory,
      amount,
      expense_date: date,
    };

    try {
      await axios.post("http://localhost:3000/expenses/add", payload);
      alert("Expense added successfully!");
      setSelectedCategory("");
      setAmount("");
      setDate("");
    } catch (err) {
      console.error("Failed to add expense:", err);
      alert("Failed to add expense. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" className="add-expense-container">
      <Paper elevation={3} className="add-expense-paper">
        <Typography variant="h4" className="title">
          Add Expense
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit} className="add-expense-form">
          <FormControl fullWidth className="form-control">
            <InputLabel id="category-label">Expense Type</InputLabel>
            <Select
              labelId="category-label"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="number"
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Amount"
            required
            className="form-control"
          />
          <TextField
            fullWidth
            type="date"
            label="Expense Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            required
            className="form-control"
          />
          <Box className="button-container">
            <Button type="submit" variant="contained" color="primary">
              Add Expense
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default Addexpense;
