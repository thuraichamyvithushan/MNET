import HomePageGrid from "./homePageGrid"
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
        </div>
    )
}

export default MainPage;