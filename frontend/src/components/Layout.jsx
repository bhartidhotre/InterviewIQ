import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      {/* Top Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex justify-center items-start p-6">
        {children}
      </main>
    </div>
  );
}
