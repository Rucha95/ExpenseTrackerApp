import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import "./Expensetable.css";
import Expensechart from "./Expensechart";

function Expensetable() {
  const [data, setData] = useState({ expenses: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const goToAddExpense = () => {
    navigate("/add");
  };

  useEffect(() => {
    const getExpenses = async () => {
      const userId = 1;
      try {
        const response = await axios.get("http://localhost:3000/expenses/get", {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImlhdCI6MTc0NDcwMTU1NiwiZXhwIjoxNzQ0NzA1MTU2fQ.98xtxaxjs4LfFbdI5_MEKze1SZgTfN6Q_0zWfdIMRZ8",
          },
          params: { userId },
        });
        const { expenses, total } = response.data;
        const totalAmount = total[0]?.total_amount || 0;
        setData({ expenses, total: totalAmount });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch expenses.");
        setLoading(false);
      }
    };

    getExpenses();
  }, []);

  if (loading) {
    return (
      <Box
        className="loading-container"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" className="expense-container">
      <Paper elevation={3} className="expense-paper">
        <Box className="header">
          <Typography variant="h4" component="h1" className="title">
            Expense Tracker
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={goToAddExpense}
          >
            + Add Expense
          </Button>
        </Box>
        <Box className="total-box">
          <Typography variant="h6">Total: ₹{data.total}</Typography>
        </Box>
        <Expensechart />
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Category</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Amount (₹)</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.expenses.map((expense, index) => (
                  <TableRow key={index}>
                    <TableCell>{expense.category_name}</TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>{expense.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
}

export default Expensetable;
