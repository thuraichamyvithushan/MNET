
import "./HomePageGrid.css";
import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import ITSupportPopup from "./ITSupportPopup";
import ReimbursementPopup from "./ReimbursementPopup";
import LeavePopup from "./LeavePopup";

const HomePageGrid = function () {
    const [showITPopup, setShowITPopup] = useState(false);
    const [showReimbursementPopup, setShowReimbursementPopup] = useState(false);
    const [showLeavePopup, setShowLeavePopup] = useState(false);

    return (
        <div>
            {showITPopup && <ITSupportPopup onClose={() => setShowITPopup(false)} />}
            {showReimbursementPopup && <ReimbursementPopup onClose={() => setShowReimbursementPopup(false)} />}
            {showLeavePopup && <LeavePopup onClose={() => setShowLeavePopup(false)} />}

            <div className="container main-cent">
                <div className="cent">
                    <div className="market">

                        <hr style={{ margin: "0", borderTop: "5px solid #ddd" }}></hr>
                        <div className="row no-gutters mt-5 home_row">
                            {/*1st  Single Row with 7 Columns */}
                            <div className="col-xl-2 col-md-4 col-sm-6 mt-3 anime-2 center-card">
                                <div className="card home_card">
                                    <div className="card-body" style={{ textAlign: "center" }}>
                                        <a href="https://my.workshopsoftware.com.au/" target="_blank" rel="noreferrer">
                                            <img height="100px" width="100px" src="./images/workshop 1.png" alt="Worshop software" />
                                        </a>
                                        <h4 className="card-title">Worshop software</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-2 col-md-4 col-sm-6 mt-3 anime-2 center-card">
                                <div className="card home_card">
                                    <div className="card-body" style={{ textAlign: "center" }}>
                                        <a href="https://moto-trekkin.monday.com/boards/3314909587" target="_blank" rel="noreferrer">
                                            <img height="100px" width="100px" src="./images/suppliers1.png" alt="Suppliers" />
                                        </a>
                                        <h4 className="card-title">Suppliers</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-2 col-md-4 col-sm-6 mt-3 anime-2 center-card">
                                <div className="card home_card">
                                    <div className="card-body" style={{ textAlign: "center" }}>
                                        <a href=" https://moto-trekkin.monday.com/boards/289759393" target="_blank" rel="noreferrer">
                                            <img height="100px" width="100px" src="./images/Teamtask.jpg" alt="Team task" />
                                        </a>
                                        <h4 className="card-title">Team task</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-2 col-md-4 col-sm-6 mt-3 anime-2 center-card">
                                <div className="card home_card">
                                    <div className="card-body" style={{ textAlign: "center" }}>
                                        <a href=" #" target="_blank" rel="noreferrer">
                                            <img height="100px" width="100px" src="./images/policies.png" alt="Policies and procedures" />
                                        </a>
                                        <h4 className="card-title">Policies and procedures</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-2 col-md-4 col-sm-6 mt-3 anime-2 center-card">
                                <div className="card home_card">
                                    <div className="card-body" style={{ textAlign: "center" }}>
                                        <div
                                            onClick={() => setShowLeavePopup(true)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <img height="100px" width="100px" src="./images/leave application.png" alt=" Leave application" />
                                        </div>
                                        <h4 className="card-title"> Leave application</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-2 col-md-4 col-sm-6 mt-3 anime-2 center-card">
                                <div className="card home_card">
                                    <div className="card-body" style={{ textAlign: "center" }}>
                                        <div
                                            onClick={() => setShowReimbursementPopup(true)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <img height="100px" width="100px" src="./images/r12.png" alt="Reimbursements and receipts" />
                                        </div>
                                        <h4 className="card-title">Reimbursements and receipts</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-2 col-md-4 col-sm-6 mt-3 anime-2 center-card">
                                <div className="card home_card">
                                    <div className="card-body" style={{ textAlign: "center" }}>
                                        <a href="https://moto-trekkin.monday.com/boards/18392251832" target="_blank" rel="noreferrer">
                                            <img height="100px" width="100px" src="./images/ec.png" alt="Emergency contacts" />
                                        </a>
                                        <h4 className="card-title">Emergency contacts</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-2 col-md-4 col-sm-6 mt-3 anime-2 center-card">
                                <div className="card home_card">
                                    <div className="card-body" style={{ textAlign: "center" }}>
                                        <a href="#" target="_blank" rel="noreferrer">
                                            <img height="100px" width="100px" src="./images/sd.png" alt="Staff Directory" />
                                        </a>
                                        <h4 className="card-title">Staff Directory</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-2 col-md-4 col-sm-6 mt-3 anime-2 center-card">
                                <div className="card home_card">
                                    <div className="card-body" style={{ textAlign: "center" }}>
                                        <Link to="#">
                                            <img height="100px" width="100px" src="./images/rsi.png" alt="Report safety issue" />
                                        </Link>
                                        <h4 className="card-title"> Report safety issue </h4>

                                    </div>
                                </div>
                            </div>



                            <div className="col-xl-2 col-md-4 col-sm-6 mt-3 anime-2 center-card">
                                <div className="card home_card">
                                    <div className="card-body" style={{ textAlign: "center" }}>
                                        <a href="occupational health and safety nsw - https://www.safework.nsw.gov.au/?gad_source=1&gad_campaignid=22723294241&gbraid=0AAAAA9oe9XHhIgMMrpm4mCNeWl8OIRJUS&gclid=Cj0KCQiAo4TKBhDRARIsAGW29bcwTg7ZXrjpTWSV6LWyyU6aDDwr-8ERAaYk2XLXCpXzj9Yt6tVvo_IaAvAtEALw_wcB" target="_blank" rel="noreferrer">
                                            <img height="100px" width="100px" src="./images/ohs.png" alt="Occupation Health and safety" />
                                        </a>
                                        <h4 className="card-title">Occupation Health and safety
                                        </h4>

                                    </div>
                                </div>
                            </div>


                            <div className="col-xl-2 col-md-4 col-sm-6 mt-3 anime-2 center-card">
                                <div className="card home_card">
                                    <div className="card-body" style={{ textAlign: "center" }}>
                                        <a href="#" target="_blank" rel="noreferrer">
                                            <img height="100px" width="100px" src="./images/in.png" alt="Inductions" />
                                        </a>
                                        <h4 className="card-title"> Inductions</h4>

                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-2 col-md-4 col-sm-6 mt-3 anime-2 center-card">
                                <div className="card home_card">
                                    <div className="card-body" style={{ textAlign: "center" }}>
                                        <div
                                            onClick={() => setShowITPopup(true)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <img height="100px" width="100px" src="./images/cit.png" alt="Create IT issue ticket" />
                                        </div>
                                        <h4 className="card-title"> Create IT issue ticket</h4>

                                    </div>
                                </div>
                            </div>









                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HomePageGrid;
