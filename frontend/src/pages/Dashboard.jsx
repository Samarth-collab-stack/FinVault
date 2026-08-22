import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const [editForm, setEditForm] = useState({
    description: "",
    category: "",
    type: "",
    amount: ""
  });
  const selectedTransaction = transactions.find(
    (transaction) => transaction._id === editingId
  );

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "credit")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "debit")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpense;
  const financialStatus = totalIncome > totalExpense ? "healthy" : totalIncome === totalExpense ? "neutral" : "debt";
  const expenseRatio = totalIncome != 0 ? totalExpense / totalIncome * 100 : 0;
  const spendingLevel = expenseRatio <= 50 ? "healthy" : expenseRatio >= 80 ? "high" : "moderate";
  const categoryExpenses = transactions
    .filter((transaction) => transaction.type === "debit")
    .reduce((acc, transaction) => {
      acc[transaction.category]
        ? (acc[transaction.category] += transaction.amount)
        : (acc[transaction.category] = transaction.amount);
      return acc;
    }, {});
  const categoryPercentages = Object.entries(categoryExpenses).map(
    ([category, amount]) => {
      return {
        category: category,
        percentage: (amount / totalExpense) * 100
      }
    }
  );
  const highestExpenseCategory = categoryPercentages.length > 0
    ? categoryPercentages.reduce(
      (max, current) => (max.percentage > current.percentage) ? max : current
    )
    : null;
  const spendingInsightAbove50 =
    highestExpenseCategory &&
    highestExpenseCategory.percentage > 50;
  const spendingInsight = spendingLevel === "high" ? "highSpendingLevel" : spendingLevel === "healthy" ? "lowSpendingLevel" : "moderateSpendingLevel";
  useEffect(() => {
    if (selectedTransaction) {
      setEditForm({
        description: selectedTransaction.description,
        category: selectedTransaction.category,
        type: selectedTransaction.type,
        amount: selectedTransaction.amount,
      });
    }
  }, [editingId]);
  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:5000/api/transactions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTransactions(response.data.transactions);
      }
      catch (error) {
        setError("Failed to Fetch Transactions");
      }
      finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/transactions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setTransactions((prevTransactions) =>
        prevTransactions.filter(
          (transaction) => transaction._id !== id
        )
      );
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };
  const handleUpdate = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://localhost:5000/api/transactions/${id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction._id === id
            ? response.data.transaction
            : transaction
        )
      );
      setEditingId(null);
    }
    catch (error) {
      console.error("Failed to update Transaction", error);
    }
  }
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .trim()
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesType =
      typeFilter === "all" ||
      transaction.type === typeFilter;
    const matchesCategory =
      categoryFilter === 'all' ||
      transaction.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div className="p-10">
      {loading ? (
        <p>Loading Transactions...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          {transactions.length === 0 ? (
            <div>
              <p> No Transactions Yet</p>
              <p> Upload A CSV to get started</p>
            </div>
          ) : (
            <>
              {/* HEADER */}
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome to FinVault Dashboard
                </h1>
                <p className="mt-2 text-gray-600">
                  Track your Income...
                </p>
              </div>
              {/* Financial Summary*/}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                <div className="p-6 bg-green-100 rounded-lg">
                  <h2 className="text-lg font-semibold">Total Income</h2>
                  <p className="text-2xl font-bold">₹{totalIncome}</p>
                  <p>Money Coming In</p>
                </div>
                <div className="mt-8">
                  <h2 className="text-xl font-bold">Spending Insight</h2>
                  {highestExpenseCategory ? (
                    <p>
                      Your highest expense category is{" "}
                      <strong>{highestExpenseCategory.category}</strong>{" "}
                      at{" "}
                      <strong>{highestExpenseCategory.percentage.toFixed(1)}%</strong>{" "}
                      of your total spending.
                    </p>
                  ):(
                    <p>No expense data available yet</p>
                  )}
                </div>
                <div>
                  {spendingInsightAbove50
                    ? (<p>Your {highestExpenseCategory.category} expenses are very high.
                      Consider reducing your spending in this category.
                    </p>)
                    : (<p>Your spending is distributed across multiple categories.</p>)
                  }
                </div>
                <div className="mt-8">
                  <h2 className="text-x1 font-bold">Expense Breakdown</h2>
                  {Object.entries(categoryExpenses).map(([category, amount]) => (
                    <div key={category}>
                      <span>{category}</span>
                      <span>₹{amount}</span>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-red-100 rounded-lg">
                  <h2 className="text-lg font-semibold">Total Expense</h2>
                  <p className="text-2xl font-bold">₹{totalExpense}</p>
                  <p>Money Going Out</p>
                </div>

                <div className="p-6 bg-blue-100 rounded-lg">
                  <h2 className="text-lg font-semibold">Balance</h2>
                  <p className="text-2xl font-bold">₹{balance}</p>
                  <p>Current Net Balance</p>
                </div>
                <div className="p-6 bg-green-100 rounded-lg">
                  <h2 className="text-lg font-semibold">Financial Health</h2>
                  {financialStatus === "healthy" ? (
                    <div>
                      <p>You are Spending within your Income</p>
                    </div>
                  ) : financialStatus === "debt" ? (
                    <div>
                      <p>Your expenses are Higher than your income</p>
                      <p>You are in a current debt of {totalExpense - totalIncome}</p>
                    </div>
                  ) : (
                    <p>Your income and expenses are currently balanced</p>
                  )}
                  {expenseRatio !== 0 ?
                    (<p>You are spending {expenseRatio.toFixed(2)}% of your Income</p>)
                    : (
                      <p>No income has been recorded for this period.</p>
                    )}
                </div>
                <div>
                  {spendingInsight === "highSpendingLevel" ? (
                    <p>
                      Your {highestExpenseCategory.category} spending is very high.
                      Consider reducing your expenses in this category.
                    </p>
                  ) : spendingInsight === "moderateSpendingLevel" ? (
                    <p>
                      Your spending is moderate. Keep an eye on your{" "}
                      {highestExpenseCategory.category} expenses.
                    </p>
                  ) : (
                    <p>
                      Your expenses are looking healthy
                    </p>
                  )}
                </div>
              </div>
              {/* Recent Transactions */}
              <div className="mt-8">
                <h2>Recent Transactions</h2>
                {recentTransactions.map(transaction => (
                  <div key={transaction._id}>
                    <span>{transaction.description} </span>
                    <span>{transaction.category} </span>
                    {transaction.type === "credit" ? '+' : '-'}
                    <span>{transaction.amount} </span>
                  </div>
                ))}
              </div>
              {/* All Transactions */}
              <div className="mt-8">
                {/* Search */}
                <input
                  type="text"
                  placeholder="Search Transactions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border p-2 rounded w-full md: w-1/2"
                />
                {/* Category */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border p-2 rounded ml-2"
                >
                  <option value="all">All Categories</option>
                  <option value="career">career</option>
                  <option value="food">food</option>
                  <option value="shopping">shopping</option>
                  <option value="transport">transport</option>
                </select>
                {/*Type*/}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="border p-2 rounded ml-2"
                >
                  <option value="all">All</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </div>
              <div className="mt-8 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Description</th>
                      <th className="text-left p-3">Category</th>
                      <th className="text-left p-3">Type</th>
                      <th className="text-left p-3">Amount</th>
                      <th className="text-left p-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      editingId === transaction._id ? (<tr key={transaction._id} className="border-b">
                        <td className="p-3">{transaction.date}</td>

                        <td className="p-3">
                          <input
                            type="text"
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                description: e.target.value,
                              })
                            }
                            className="border p-2 rounded"
                          />
                        </td>

                        <td className="p-3">
                          <input
                            type="text"
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                category: e.target.value,
                              })
                            }
                            className="border p-2 rounded"
                          />
                        </td>

                        <td className="p-3">
                          <select
                            value={editForm.type}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                type: e.target.value,
                              })
                            }
                            className="border p-2 rounded"
                          >
                            <option value="credit">Credit</option>
                            <option value="debit">Debit</option>
                          </select>
                        </td>

                        <td className="p-3">
                          <input
                            type="number"
                            value={editForm.amount}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                amount: e.target.value,
                              })
                            }
                            className="border p-2 rounded"
                          />
                        </td>

                        <td className="p-3">
                          <button
                            onClick={() => handleUpdate(editingId)}
                            className="bg-green-500 text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>
                        </td>

                        <td className="p-3">
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-gray-500 text-white px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>) : (<tr key={transaction._id} className="border-b">
                        <td className="p-3">
                          {new Date(transaction.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="p-3">{transaction.description}</td>
                        <td className="p-3">{transaction.category}</td>
                        <td className="p-3">{transaction.type}</td>
                        <td className="p-3">₹{transaction.amount}</td>
                        <td><button onClick={() => handleDelete(transaction._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                          Delete
                        </button>
                        </td>
                        <td>
                          <button onClick={() => setEditingId(transaction._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                            Update
                          </button>
                        </td>
                      </tr>)
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleLogout}
                className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          )
          }
        </>
      )}
    </div >
  );
}

export default Dashboard;