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
  const [editForm, setEditForm] = useState({
    description: "",
    category: "",
    type: "",
    amount: ""
  });
  const selectedTransaction = transactions.find(
    (transaction) => transaction._id === editingId
  );
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
        console.error("failed to fetch transactions: ", error);
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
      .toLowerCase()
      .includes(search.toLowerCase());
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
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "credit")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "debit")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const balance = totalIncome - totalExpense;
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Welcome to FinVault Dashboard
      </h1>
      <div className="mt-8">
        <input
          type="text"
          placeholder="Search Transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md: w-1/2"
        />
      </div>
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
      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        className="border p-2 rounded ml-2"
      >
        <option value="all">All</option>
        <option value="credit">Credit</option>
        <option value="debit">Debit</option>
      </select>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="test-left p-3">Date</th>
              <th className="test-left p-3">Description</th>
              <th className="test-left p-3">Catecory</th>
              <th className="test-left p-3">Type</th>
              <th className="test-left p-3">Amount</th>
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
                <td className="p-3">{transaction.date}</td>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <div className="p-6 bg-green-100 rounded-lg">
            <h2 className="text-lg font-semibold">Total Income</h2>
            <p className="text-2xl font-bold">₹{totalIncome}</p>
          </div>

          <div className="p-6 bg-red-100 rounded-lg">
            <h2 className="text-lg font-semibold">Total Expense</h2>
            <p className="text-2xl font-bold">₹{totalExpense}</p>
          </div>

          <div className="p-6 bg-blue-100 rounded-lg">
            <h2 className="text-lg font-semibold">Balance</h2>
            <p className="text-2xl font-bold">₹{balance}</p>
          </div>

        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div >
  );
}

export default Dashboard;