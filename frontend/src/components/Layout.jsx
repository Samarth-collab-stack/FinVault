import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-h-screen pl-64">
        <Header />

        {children}
      </main>
    </div>
  );
}

export default Layout;