import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <div className="twoColumnscontainerHomePage">

                <div className="item">
                    {/* <button className="buttonHomePage" > */}
                    <Link to="/Classification" className="linkRouting">Classification</Link>
                    {/* </button> */}
                </div>

                <div className="item">
                    {/* <button className="buttonHomePage" > */}
                    <Link to="/IBT" className="linkRouting">IBT</Link>
                    {/* </button> */}
                </div>

                <div className="item">
                    {/* <button className="buttonHomePage" > */}
                    <Link to="/Low_Income_IBT" className="linkRouting">Low Icome IBT</Link>
                    {/* </button> */}
                </div>

            </div>
        </>
    )
};

export default Layout;