const username = localStorage.getItem("username");

function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">
          Dashboard
        </h1>

        <p className="text-sm text-slate-500">
          Your financial overview
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">
            {username || "User"}
          </p>

          <p className="text-xs text-slate-500">
            Personal account
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
          {username ? username.charAt(0).toUpperCase() : "U"}
        </div>
      </div>
    </header>
  );
}

export default Header;