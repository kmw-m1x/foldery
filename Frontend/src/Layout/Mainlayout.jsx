import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white  text-slate-900"> 
      <Navbar />
    
      <main className="flex-1 pt-16 md:pt-20">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;