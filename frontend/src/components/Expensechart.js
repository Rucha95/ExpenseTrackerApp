import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Box, Typography } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);


function Expensechart(){
    const[chartData,setChartData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const userId = 1;
            try{
                const response = await axios.get("http://localhost:3000/expenses/totalExpenseByCategory", {
                    params: {userId},
                })
                const data =response.data;
                const categories = data.map((item)=> item.name);
                const totals = data.map((item)=>item.total);
                setChartData({
                    labels:categories,
                    datasets:[{
                        //label:"Expenses by Category",
                        data:totals,
                        backgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56",
                            "#4BC0C0",
                            "#9966FF",
                            "#FF9F40",
                            "#2ECC71",
                            "#E74C3C",
                            "#27AE60",
                          ],
                          hoverBackgroundColor: [
                            "#FF6384", // Light Red
                            "#36A2EB", // Light Blue
                            "#FFCE56", // Light Yellow
                            "#4BC0C0", // Light Teal
                            "#9966FF", // Light Purple
                            "#FF9F40", // Light Orange
                            "#2ECC71", // Light Green
                            "#E74C3C", // Crimson Red
                            "#3498DB",
                          ],

                    },],
                });
            }catch(err){
                console.error("Failed to fetch data.",err);
            }
        }; fetchData();
    },[]);

    return (
        <Box sx={{ maxWidth: 600,height:400, margin: "2rem auto", textAlign: "center" }}>
          {/* <Typography variant="h4" gutterBottom>
            Expense Breakdown by Category
          </Typography> */}
          {chartData ? (
            <Doughnut
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          ) : (
            <Typography variant="body1">Loading...</Typography>
          )}
        </Box>
      );
    }

export default Expensechart;
