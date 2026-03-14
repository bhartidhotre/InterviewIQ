import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navItem = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-extrabold text-gray-900"
        >
          <Link to="/">
            Smart<span className="text-blue-600">Interview</span>
          </Link>
        </motion.div>

        {/* DESKTOP LINKS */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-gray-700">
          <motion.div variants={navItem} initial="hidden" animate="show">
            <Link className="hover:text-blue-600 transition" to="/">Home</Link>
          </motion.div>

          <motion.div variants={navItem} initial="hidden" animate="show">
            <Link className="hover:text-blue-600 transition" to="/practice">Practice</Link>
          </motion.div>

          {token && (
            <motion.div variants={navItem} initial="hidden" animate="show">
              <Link className="hover:text-blue-600 transition" to="/dashboard">Dashboard</Link>
            </motion.div>
          )}

          
           <motion.div variants={navItem} initial="hidden" animate="show">
            <Link className="hover:text-blue-600 transition" to="/resume-check">Resume</Link>
          </motion.div>
        
  
          {token && user?.role === "ADMIN" && (
            <motion.div variants={navItem} initial="hidden" animate="show">
              <Link className="hover:text-blue-600 transition" to="/add-question">
                Add Question
              </Link>
            </motion.div>
          )}
        </nav>

        {/* ACTION BUTTONS */}
        <div className="hidden md:flex gap-3">
          {!token ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 hover:scale-[1.03] active:scale-95 shadow-md transition-all"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 hover:scale-[1.03] active:scale-95 transition-all"
            >
              Logout
            </button>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="flex flex-col px-6 py-4 gap-4 text-gray-700 font-medium">
              <Link onClick={() => setOpen(false)} to="/">Home</Link>
              <Link onClick={() => setOpen(false)} to="/practice">Practice</Link>

              {token && (
                <Link onClick={() => setOpen(false)} to="/dashboard">Dashboard</Link>
              )}

               {token && (
                <Link onClick={() => setOpen(false)} to="/resume-check">Resume</Link>
              )}

              {token && user?.role === "ADMIN" && (
                <Link onClick={() => setOpen(false)} to="/add-question">
                  Add Question
                </Link>
              )}

              {!token ? (
                <>
                  <Link to="/login" className="mt-2 text-blue-600">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
