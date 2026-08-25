import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function VaultMark() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      className="shrink-0"
      aria-hidden="true"
    >
      <circle
        cx="17"
        cy="17"
        r="16"
        stroke="#B8925A"
        strokeWidth="1.2"
      />
      <circle
        cx="17"
        cy="17"
        r="11.5"
        stroke="#B8925A"
        strokeWidth="1"
        opacity="0.5"
      />
      <circle cx="17" cy="17" r="3.2" fill="#B8925A" />
      <rect
        x="16.3"
        y="16.4"
        width="1.4"
        height="7"
        rx="0.7"
        fill="#B8925A"
        transform="rotate(35 17 17)"
      />
    </svg>
  );
}

function StatusDot({ tone }) {
  const color =
    tone === "healthy"
      ? "bg-[#1F6F54]"
      : tone === "debt"
        ? "bg-[#B23B3B]"
        : "bg-[#B8925A]";

  return <span className={`inline-block h-2 w-2 rounded-full ${color}`} />;
}

function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = localStorage.getItem("username");
  const hour = new Date().getHours();
  let greeting;
  if (hour < 5 ){
    greeting = "Burning the Midnight Oil?";
  }
  else if (hour < 12 && hour > 5) {
    greeting = "Good Morning...";
  } else if (hour < 16) {
    greeting = "Good Afternoon...";
  } else if (hour < 21) {
    greeting = "Good Evening...";
  } else {
    greeting = "Time to Wind Down...";
  }
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const [editForm, setEditForm] = useState({
    description: "",
    category: "",
    type: "",
    amount: "",
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

  const financialStatus =
    totalIncome > totalExpense
      ? "healthy"
      : totalIncome === totalExpense
        ? "neutral"
        : "debt";

  const expenseRatio =
    totalIncome != 0 ? (totalExpense / totalIncome) * 100 : 0;

  const spendingLevel =
    expenseRatio <= 50
      ? "healthy"
      : expenseRatio >= 80
        ? "high"
        : "moderate";

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
        percentage: (amount / totalExpense) * 100,
      };
    }
  );

  const highestExpenseCategory =
    categoryPercentages.length > 0
      ? categoryPercentages.reduce(
        (max, current) =>
          max.percentage > current.percentage ? max : current
      )
      : null;

  const spendingInsightAbove50 =
    highestExpenseCategory &&
    highestExpenseCategory.percentage > 50;

  const spendingInsight =
    spendingLevel === "high"
      ? "highSpendingLevel"
      : spendingLevel === "healthy"
        ? "lowSpendingLevel"
        : "moderateSpendingLevel";

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
      } catch (error) {
        setError("Failed to Fetch Transactions");
      } finally {
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
    } catch (error) {
      console.error("Failed to update Transaction", error);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .trim()
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesType =
      typeFilter === "all" ||
      transaction.type === typeFilter;

    const matchesCategory =
      categoryFilter === "all" ||
      transaction.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  /* ---------------------------------------------------------------------- */
  /* LOADING                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <VaultMark />
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#171B22]/50">
            FinVault
          </p>

          <p className="mt-2 text-sm text-[#171B22]/60">
            Loading your financial data...
          </p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* ERROR                                                                  */
  /* ---------------------------------------------------------------------- */

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center px-6">
        <div className="w-full max-w-md border border-[#E4E1D8] bg-white p-8 text-center">
          <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center border border-[#B23B3B]/30 text-[#B23B3B]">
            !
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B23B3B]">
            Unable to load dashboard
          </p>

          <p className="mt-3 text-sm leading-6 text-[#171B22]/65">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffefc] text-[#171B22]">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">

        {/* ================================================================= */}
        {/* HEADER                                                            */}
        {/* ================================================================= */}

        <header className="border-b border-[#E4E1D8] pb-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">

              <div>

                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#171B22] sm:text-4xl">
                  {greeting}
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#171B22]/60">
                  Review your income, spending and financial health.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ================================================================= */}
        {/* EMPTY STATE                                                       */}
        {/* ================================================================= */}

        {transactions.length === 0 ? (
          <div className="mt-10 border border-dashed border-[#D8D5CC] bg-white px-6 py-16 text-center">
            <div className="flex justify-center">
              <VaultMark />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-[#171B22]">
              No transactions yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#171B22]/55">
              Upload a CSV file to add your transactions and start
              tracking your financial health.
            </p>
          </div>
        ) : (
          <div className="mt-8">

            {/* ============================================================= */}
            {/* FINANCIAL SUMMARY                                             */}
            {/* ============================================================= */}

            <section>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#171B22]/45">
                    Financial summary
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                {/* Income */}
                <div className="border border-[#E4E1D8] bg-white p-6">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#171B22]/45">
                      Total income
                    </p>

                    <span className="h-2 w-2 rounded-full bg-[#1F6F54]" />
                  </div>

                  <p className="mt-5 font-sans text-3xl font-medium tabular-nums tracking-tight text-[#171B22]">
                    ₹{totalIncome.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Expense */}
                <div className="border border-[#E4E1D8] bg-white p-6">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#171B22]/45">
                      Total expense
                    </p>

                    <span className="h-2 w-2 rounded-full bg-[#B23B3B]" />
                  </div>

                  <p className="mt-5 font-sans text-3xl font-medium tabular-nums tracking-tight text-[#171B22]">
                    ₹{totalExpense.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Balance */}
                <div className="border border-[#E4E1D8] bg-white p-6">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#171B22]/45">
                      Net balance
                    </p>

                    <span
                      className={`h-2 w-2 rounded-full ${balance > 0
                          ? "bg-[#1F6F54]"
                          : balance < 0
                            ? "bg-[#B23B3B]"
                            : "bg-[#B8925A]"
                        }`}
                    />
                  </div>

                  <p
                    className={`mt-5 font-sans text-3xl font-medium tabular-nums tracking-tight ${balance > 0
                        ? "text-[#1F6F54]"
                        : balance < 0
                          ? "text-[#B23B3B]"
                          : "text-[#171B22]"
                      }`}
                  >
                    ₹{balance.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </section>

            {/* ============================================================= */}
            {/* HEALTH + INSIGHT                                              */}
            {/* ============================================================= */}

            <section className="mt-10">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                {/* Financial Health */}
                <div className="border border-[#E4E1D8] bg-white p-6">
                  <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#171B22]/45">
                        Financial health
                      </p>

                      <p className="mt-1 text-sm text-[#171B22]/50">
                        Based on income and expense levels.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusDot tone={financialStatus} />

                      <span className="text-xs font-semibold capitalize text-[#171B22]/70">
                        {financialStatus}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    {financialStatus === "healthy" ? (
                      <p className="text-base font-medium text-[#171B22]">
                        You're spending within your income.
                      </p>
                    ) : financialStatus === "debt" ? (
                      <p className="text-base font-medium text-[#171B22]">
                        Expenses exceed income.
                      </p>
                    ) : (
                      <p className="text-base font-medium text-[#171B22]">
                        Income and expenses are currently balanced.
                      </p>
                    )}

                    {financialStatus === "debt" && (
                      <p className="mt-2 text-sm text-[#B23B3B]">
                        Current shortfall:{" "}
                        <span className="font-sans tabular-nums">
                          ₹
                          {(totalExpense - totalIncome).toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </p>
                    )}

                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#171B22]/50">
                          Expense to income ratio
                        </span>

                        <span className="font-sans text-sm tabular-nums text-[#171B22]">
                          {expenseRatio.toFixed(2)}%
                        </span>
                      </div>

                      <div className="mt-3 h-2 w-full overflow-hidden bg-[#F0EEE8]">
                        <div
                          className={`h-full ${expenseRatio >= 80
                              ? "bg-[#d6471c]"
                              : expenseRatio > 50
                                ? "bg-[#77abe6]"
                                : "bg-[#3eab38]"
                            }`}
                          style={{
                            width: `${Math.min(expenseRatio, 100)}%`,
                          }}
                        />
                      </div>

                      <p className="mt-3 text-xs leading-5 text-[#171B22]/50">
                        {expenseRatio !== 0
                          ? `You're spending ${expenseRatio.toFixed(
                            2
                          )}% of your income.`
                          : "No income has been recorded for this period."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Spending Insight */}
                <div className="border border-[#E4E1D8] bg-white p-6">
                  <div className="border-b border-[#E4E1D8] pb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#171B22]/45">
                      Spending insight
                    </p>

                    <p className="mt-1 text-sm text-[#171B22]/50">
                      Where most of your spending is concentrated.
                    </p>
                  </div>

                  <div className="mt-6">
                    {highestExpenseCategory ? (
                      <>
                        <p className="text-base font-medium text-[#171B22]">
                          {highestExpenseCategory.category
                            .charAt(0)
                            .toUpperCase() +
                            highestExpenseCategory.category.slice(1)}
                        </p>

                        <div className="mt-3 flex items-baseline gap-2">
                          <span className="font-sans text-3xl tabular-nums text-[#171B22]">
                            {highestExpenseCategory.percentage.toFixed(1)}%
                          </span>

                          <span className="text-sm text-[#171B22]/50">
                            of total spending
                          </span>
                        </div>

                        <div className="mt-5 h-2 w-full bg-[#F0EEE8]">
                          <div
                            className={`h-full ${highestExpenseCategory.percentage > 50
                                ? "bg-[#d6471c]"
                                : "bg-[#e8db66]"
                              }`}
                            style={{
                              width: `${Math.min(
                                highestExpenseCategory.percentage,
                                100
                              )}%`,
                            }}
                          />
                        </div>

                        <p className="mt-4 text-sm leading-6 text-[#171B22]/60">
                          {spendingInsight === "highSpendingLevel"
                            ? `Consider reducing spending in ${highestExpenseCategory.category}.`
                            : spendingInsight === "moderateSpendingLevel"
                              ? `Keep an eye on ${highestExpenseCategory.category} expenses.`
                              : spendingInsightAbove50
                                ? `Your ${highestExpenseCategory.category} expenses are concentrated.`
                                : "Spending is distributed across categories."}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-[#171B22]/50">
                        No expense data available yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ============================================================= */}
            {/* ANALYTICS                                                      */}
            {/* ============================================================= */}

            <section className="mt-10">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#171B22]/45">
                  Analytics
                </p>

                <p className="mt-1 text-sm text-[#171B22]/55">
                  A simple view of where your money is going.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                {/* Expense by Category */}
                <div className="border border-[#E4E1D8] bg-white p-6">
                  <div className="flex items-start justify-between border-b border-[#E4E1D8] pb-4">
                    <div>
                      <h2 className="text-sm font-semibold text-[#171B22]">
                        Expense by category
                      </h2>

                      <p className="mt-1 text-xs text-[#171B22]/50">
                        Distribution of recorded expenses.
                      </p>
                    </div>

                    <span className="text-xs text-[#171B22]/40">
                      ₹{totalExpense.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="mt-6 space-y-5">
                    {Object.entries(categoryExpenses).length === 0 ? (
                      <p className="text-sm text-[#171B22]/45">
                        No expense data available.
                      </p>
                    ) : (
                      Object.entries(categoryExpenses)
                        .sort(([, a], [, b]) => b - a)
                        .map(([category, amount]) => {
                          const percentage = totalExpense
                            ? (amount / totalExpense) * 100
                            : 0;

                          return (
                            <div key={category}>
                              <div className="mb-2 flex items-center justify-between gap-4">
                                <span className="text-sm capitalize text-[#171B22]/75">
                                  {category}
                                </span>

                                <div className="flex items-center gap-3">
                                  <span className="font-sans text-xs tabular-nums text-[#171B22]/50">
                                    {percentage.toFixed(1)}%
                                  </span>

                                  <span className="font-sans text-xs tabular-nums text-[#171B22]">
                                    ₹{amount.toLocaleString("en-IN")}
                                  </span>
                                </div>
                              </div>

                              <div className="h-1.5 w-full bg-[#F0EEE8]">
                                <div
                                  className="h-full bg-[#77abe6]"
                                  style={{
                                    width: `${Math.min(
                                      percentage,
                                      100
                                    )}%`,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>

                {/* Income vs Expense */}
                <div className="border border-[#E4E1D8] bg-white p-6">
                  <div className="border-b border-[#E4E1D8] pb-4">
                    <h2 className="text-sm font-semibold text-[#171B22]">
                      Income vs expense
                    </h2>

                    <p className="mt-1 text-xs text-[#171B22]/50">
                      Comparison of total money in and money out.
                    </p>
                  </div>

                  <div className="mt-7 flex h-64 items-end justify-center gap-16 sm:gap-24">

                    {/* Income bar */}
                    <div className="flex h-full flex-col items-center justify-end">
                      <span className="mb-3 font-sans text-sm tabular-nums text-[#1F6F54]">
                        ₹{totalIncome.toLocaleString("en-IN")}
                      </span>

                      <div className="flex h-48 w-14 items-end bg-[#F0EEE8] sm:w-20">
                        <div
                          className="w-full bg-[#3eab38]"
                          style={{
                            height: `${Math.max(totalIncome, totalExpense) > 0
                                ? Math.max(
                                  (totalIncome /
                                    Math.max(
                                      totalIncome,
                                      totalExpense
                                    )) *
                                  100,
                                  4
                                )
                                : 0
                              }%`,
                          }}
                        />
                      </div>

                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#171B22]/50">
                        Income
                      </p>
                    </div>

                    {/* Expense bar */}
                    <div className="flex h-full flex-col items-center justify-end">
                      <span className="mb-3 font-sans text-sm tabular-nums text-[#B23B3B]">
                        ₹{totalExpense.toLocaleString("en-IN")}
                      </span>

                      <div className="flex h-48 w-14 items-end bg-[#F0EEE8] sm:w-20">
                        <div
                          className="w-full bg-[#d6471c]"
                          style={{
                            height: `${Math.max(totalIncome, totalExpense) > 0
                                ? Math.max(
                                  (totalExpense /
                                    Math.max(
                                      totalIncome,
                                      totalExpense
                                    )) *
                                  100,
                                  4
                                )
                                : 0
                              }%`,
                          }}
                        />
                      </div>

                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#171B22]/50">
                        Expense
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ============================================================= */}
            {/* RECENT TRANSACTIONS                                           */}
            {/* ============================================================= */}

            <section className="mt-10">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#171B22]/45">
                    Recent activity
                  </p>

                  <p className="mt-1 text-sm text-[#171B22]/55">
                    Your five most recent transactions.
                  </p>
                </div>
              </div>

              <div className="overflow-hidden border border-[#E4E1D8] bg-white">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex flex-col gap-2 border-b border-[#E4E1D8] px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${transaction.type === "credit"
                            ? "bg-[#1F6F54]"
                            : "bg-[#B23B3B]"
                          }`}
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#171B22]">
                          {transaction.description}
                        </p>

                        <p className="mt-0.5 text-xs capitalize text-[#171B22]/45">
                          {transaction.category}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`font-sans text-sm font-medium tabular-nums ${transaction.type === "credit"
                          ? "text-[#1F6F54]"
                          : "text-[#B23B3B]"
                        }`}
                    >
                      {transaction.type === "credit" ? "+" : "−"}₹
                      {transaction.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* ============================================================= */}
            {/* TRANSACTION MANAGEMENT                                         */}
            {/* ============================================================= */}

            <section className="mt-10 pb-10">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#171B22]/45">
                  Transactions
                </p>

                <p className="mt-1 text-sm text-[#171B22]/55">
                  Search, filter and manage your transaction history.
                </p>
              </div>

              {/* Filters */}
              <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_160px]">

                <div>
                  <label className="sr-only">
                    Search transactions
                  </label>

                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-[#D8D5CC] bg-white px-4 py-3 text-sm text-[#171B22] placeholder:text-[#171B22]/35 focus:border-[#B8925A] focus:outline-none focus:ring-2 focus:ring-[#B8925A]/20"
                  />
                </div>

                <div>
                  <label className="sr-only">
                    Filter by category
                  </label>

                  <select
                    value={categoryFilter}
                    onChange={(e) =>
                      setCategoryFilter(e.target.value)
                    }
                    className="w-full border border-[#D8D5CC] bg-white px-4 py-3 text-sm text-[#171B22] focus:border-[#B8925A] focus:outline-none focus:ring-2 focus:ring-[#B8925A]/20"
                  >
                    <option value="all">All categories</option>
                    <option value="career">Career</option>
                    <option value="food">Food</option>
                    <option value="shopping">Shopping</option>
                    <option value="transport">Transport</option>
                  </select>
                </div>

                <div>
                  <label className="sr-only">
                    Filter by type
                  </label>

                  <select
                    value={typeFilter}
                    onChange={(e) =>
                      setTypeFilter(e.target.value)
                    }
                    className="w-full border border-[#D8D5CC] bg-white px-4 py-3 text-sm text-[#171B22] focus:border-[#B8925A] focus:outline-none focus:ring-2 focus:ring-[#B8925A]/20"
                  >
                    <option value="all">All types</option>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-[#E4E1D8] bg-white">
                <table className="w-full min-w-[850px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#E4E1D8] bg-[#FAF9F6]">
                      <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#171B22]/45">
                        Date
                      </th>

                      <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#171B22]/45">
                        Description
                      </th>

                      <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#171B22]/45">
                        Category
                      </th>

                      <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#171B22]/45">
                        Type
                      </th>

                      <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-[#171B22]/45">
                        Amount
                      </th>

                      <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-[#171B22]/45">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-14 text-center"
                        >
                          <p className="text-sm font-medium text-[#171B22]/65">
                            No transactions found
                          </p>

                          <p className="mt-1 text-xs text-[#171B22]/40">
                            Try changing your search or filters.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((transaction) =>
                        editingId === transaction._id ? (
                          <tr
                            key={transaction._id}
                            className="border-b border-[#E4E1D8] bg-[#B8925A]/5"
                          >
                            <td className="px-5 py-4 font-sans text-xs text-[#171B22]/55">
                              {new Date(
                                transaction.date
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>

                            <td className="px-5 py-3">
                              <input
                                type="text"
                                value={editForm.description}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    description: e.target.value,
                                  })
                                }
                                className="w-full border border-[#D8D5CC] bg-white px-3 py-2 text-sm focus:border-[#B8925A] focus:outline-none focus:ring-2 focus:ring-[#B8925A]/20"
                              />
                            </td>

                            <td className="px-5 py-3">
                              <input
                                type="text"
                                value={editForm.category}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    category: e.target.value,
                                  })
                                }
                                className="w-full border border-[#D8D5CC] bg-white px-3 py-2 text-sm focus:border-[#B8925A] focus:outline-none focus:ring-2 focus:ring-[#B8925A]/20"
                              />
                            </td>

                            <td className="px-5 py-3">
                              <select
                                value={editForm.type}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    type: e.target.value,
                                  })
                                }
                                className="w-full border border-[#D8D5CC] bg-white px-3 py-2 text-sm focus:border-[#B8925A] focus:outline-none focus:ring-2 focus:ring-[#B8925A]/20"
                              >
                                <option value="credit">
                                  Credit
                                </option>

                                <option value="debit">
                                  Debit
                                </option>
                              </select>
                            </td>

                            <td className="px-5 py-3">
                              <input
                                type="number"
                                value={editForm.amount}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    amount: e.target.value,
                                  })
                                }
                                className="w-32 border border-[#D8D5CC] bg-white px-3 py-2 text-right font text-sm focus:border-[#B8925A] focus:outline-none focus:ring-2 focus:ring-[#B8925A]/20"
                              />
                            </td>

                            <td className="px-5 py-3">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() =>
                                    handleUpdate(editingId)
                                  }
                                  className="border border-[#1F6F54] bg-[#1F6F54] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:bg-[#195B45] focus:outline-none focus:ring-2 focus:ring-[#1F6F54]/25"
                                >
                                  Save
                                </button>

                                <button
                                  onClick={() =>
                                    setEditingId(null)
                                  }
                                  className="border border-[#D8D5CC] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#171B22]/65 hover:border-[#171B22]/40 hover:text-[#171B22] focus:outline-none focus:ring-2 focus:ring-[#B8925A]/20"
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <tr
                            key={transaction._id}
                            className="border-b border-[#E4E1D8] last:border-b-0 hover:bg-[#FAF9F6]"
                          >
                            <td className="px-5 py-4 font-sans text-xs tabular-nums text-[#171B22]/55">
                              {new Date(
                                transaction.date
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>

                            <td className="px-5 py-4">
                              <p className="max-w-xs truncate font-medium text-[#171B22]">
                                {transaction.description}
                              </p>
                            </td>

                            <td className="px-5 py-4 capitalize text-[#171B22]/60">
                              {transaction.category}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`text-xs font-medium capitalize ${transaction.type === "credit"
                                    ? "text-[#1F6F54]"
                                    : "text-[#B23B3B]"
                                  }`}
                              >
                                {transaction.type}
                              </span>
                            </td>

                            <td
                              className={`px-5 py-4 text-right font-sans tabular-nums ${transaction.type === "credit"
                                  ? "text-[#1F6F54]"
                                  : "text-[#B23B3B]"
                                }`}
                            >
                              {transaction.type === "credit"
                                ? "+"
                                : "−"}
                              ₹
                              {transaction.amount.toLocaleString(
                                "en-IN"
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() =>
                                    setEditingId(transaction._id)
                                  }
                                  className="border border-[#D8D5CC] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#171B22]/65 hover:border-[#B8925A] hover:text-[#B8925A] focus:outline-none focus:ring-2 focus:ring-[#B8925A]/20"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() =>
                                    handleDelete(transaction._id)
                                  }
                                  className="border border-[#D8D5CC] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#171B22]/65 hover:border-[#B23B3B] hover:text-[#B23B3B] focus:outline-none focus:ring-2 focus:ring-[#B23B3B]/20"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;