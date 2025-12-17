import HomePageGrid from "./homePageGrid"
import Footer from "./Footer";
import Navimage from './navimage';
import Navbar from "./navbar";
import NewsSection from "./NewsSection";
// import NoticeBoard from './NoticeBoard'

const MainPage = function () {
    return (
        <div>
            <Navbar />
            <Navimage />
            <NewsSection />
            {/* <NoticeBoard/> */}
            <HomePageGrid />
            <Footer />
        </div>
    )
}

export default MainPage;