import './App.css';
import Navbar from './components/navbar';
import { HashRouter, Route, Routes } from 'react-router-dom';
import BusinessSub from './components/BusinessSub';
import Social from './components/Social';
import MainPage from './components/mainPage';
import HuntsmanThermo from './components/HuntsmanThermo';
import CoastOutdoor from './components/CoastOutdoor';
import DemoDeals from './components/DemoDeals';
import SperosFlashlight from './components/SperosFlashlight';
import SignInSignUpForm from './components/SignInSignUpForm';
import MagneTech from './components/MageTech';

import NewsPage from './components/NewsPage';
import PrivateRoute from './PrivateRoute';
import { auth } from './firebase'; // Only need auth now
import { useState, useEffect } from 'react';
import Loader from './components/Loader';
import DealerLocate from './components/DealerLocate';
import Clearance from './components/ccd';
import FJD from './components/fjdynamic';
import Drive from './components/drive';
import Image1 from './components/image1';
import Image2 from './components/image2';
import Image3 from './components/image3';
import Navbar2 from './components/navdrive';
import AdminPage from './components/AdminMainPage';
import AdminPanel from './components/AdminPanel';
import CompanyDashboard from './components/CompanyDashboard';
import UserPanel from './components/UserPanel';
import LeaveApplication from './components/LeaveApplication';
import CalendarPage from './components/CalendarPage';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthLoaded(true); // Just wait for Firebase to load
    });

    return () => unsubscribe();
  }, []);

  if (!isAuthLoaded) {
    return <Loader />;
  }

  return (
    <AuthProvider>
      <div className="App">
        <HashRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Route: Login Page */}
            <Route path="/" element={<SignInSignUpForm />} />

            {/* All authenticated users go straight to AdminPage */}
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <Navbar />
                  <Routes>
                    {/* Main dashboard after login */}
                    <Route index element={<MainPage />} />
                    <Route path="home" element={<MainPage />} />

                    {/* Admin Panel - Role protected inside component */}
                    <Route path="admin-panel" element={<AdminPanel />} />
                    <Route path="user-panel" element={<UserPanel />} />
                    <Route path="leave-application" element={<LeaveApplication />} />

                    {/* All other pages (still accessible) */}
                    <Route path="company-dashboard" element={<CompanyDashboard />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="business" element={<BusinessSub />} />
                    <Route path="social" element={<Social />} />
                    <Route path="huntsman-thermo" element={<HuntsmanThermo />} />
                    <Route path="coast-outdoor" element={<CoastOutdoor />} />
                    <Route path="demo-deals" element={<DemoDeals />} />
                    {/* <Route path="news-updates" element={<News />} /> */}
                    <Route path="news-list" element={<NewsPage />} />
                    <Route path="speros-flashlight" element={<SperosFlashlight />} />
                    <Route path="magnetech" element={<MagneTech />} />
                    <Route path="dealer-locate" element={<DealerLocate />} />
                    <Route path="clearance" element={<Clearance />} />
                    <Route path="fjd" element={<FJD />} />
                    <Route path="drive" element={<Drive />} />

                    <Route
                      path="img3"
                      element={
                        <>
                          <Navbar2 />
                          <Image3 />
                        </>
                      }
                    />
                    <Route
                      path="img2"
                      element={
                        <>
                          <Navbar2 />
                          <Image2 />
                        </>
                      }
                    />
                    <Route
                      path="img1"
                      element={
                        <>
                          <Navbar2 />
                          <Image1 />
                        </>
                      }
                    />
                  </Routes>
                  <Footer />
                </PrivateRoute>
              }
            />
          </Routes>
        </HashRouter>
      </div>
    </AuthProvider>
  );
}

export default App;