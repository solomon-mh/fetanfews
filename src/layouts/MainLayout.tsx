import { Outlet } from "react-router-dom";
import Header from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { useError } from "../contexts/ErrorContext";

const MainLayout = () => {
  const { error } = useError();

  if (error) {
    // Network error handling
    if (error.toLowerCase().includes("failed to fetch")) {
      return (
        <div className="">
          <div className="w-full h-screen flex justify-center items-center">
            <p className="text-xl text-center font-bold">
              <span className="text-3xl">⚠️</span>
              <br />
              There was a problem connecting to the server. <br /> Please check
              your internet connection and try again.
            </p>
          </div>
        </div>
      );
    }
    // Generic error handling
    return (
      <div className="message-container">
        <div className="w-full h-screen flex justify-center items-center">
          <p className="text-xl text-center font-bold">
            <span className="text-3xl">💥</span>
            <br />
            Something went wrong while fetching the data. <br /> Please try
            again later.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
