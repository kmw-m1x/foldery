import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#ece4d4]"> 
      {/* --- Navbar User --- */}
      <nav className="bg-[#33691e] text-white p-4 shadow-md flex justify-between">
        <h1 className="text-xl font-bold text-[#ffc857]">Mission App</h1>
        <div className="space-x-4">
          <a href="/" className="hover:text-[#ffc857]">Home</a>
          <a href="/events" className="hover:text-[#ffc857]">Events</a>
        </div>
      </nav>

      {/* --- Content (เนื้อหาจะมาโผล่ตรงรู Outlet นี้) --- */}
      <main className="flex-grow container mx-auto p-4">
        <Outlet /> 
      </main>

      {/* --- Footer --- */}
      <footer className="bg-[#33691e] text-center p-4 text-white mt-auto">
        <p>© 2025 Mission Church - God Bless You</p>
      </footer>
    </div>
  );
};

export default UserLayout;