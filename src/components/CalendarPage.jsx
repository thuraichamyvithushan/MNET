import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../context/AuthContext';
import { firestore } from '../firebase'; // Import Firestore
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCalendarPlus, faTrash, faChevronLeft, faChevronRight, faCalendarDay } from '@fortawesome/free-solid-svg-icons';

const localizer = momentLocalizer(moment);

const CustomToolbar = (toolbar) => {
    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
        toolbar.onNavigate('TODAY');
    };

    const goToView = (view) => {
        toolbar.onView(view);
    };

    const label = () => {
        const date = moment(toolbar.date);
        return (
            <span style={{ fontWeight: "800", fontSize: "1.2rem", color: "#333", textTransform: "uppercase", letterSpacing: "1px" }}>
                {date.format('MMMM')} <span style={{ color: "#f59e0b" }}>{date.format('YYYY')}</span>
            </span>
        );
    };

    return (
        <div className="rbc-toolbar" style={{
            marginBottom: "20px",
            justifyContent: "space-between",
            padding: "10px",
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #eee",
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
            flexWrap: "wrap",
            gap: "10px"
        }}>
            <div style={{ display: "flex", gap: "10px" }}>
                <button className="toolbar-btn today-btn" onClick={goToCurrent}>
                    <FontAwesomeIcon icon={faCalendarDay} style={{ marginRight: "5px" }} />
                    Today
                </button>
            </div>

            <div style={{ display: "flex", gap: "5px" }}>
                {['month', 'week', 'day'].map((view) => (
                    <button
                        key={view}
                        onClick={() => goToView(view)}
                        className={`toolbar-btn ${toolbar.view === view ? 'active-view' : ''}`}
                        style={{ textTransform: 'capitalize' }}
                    >
                        {view}
                    </button>
                ))}
            </div>

            <div className="rbc-toolbar-label" style={{ flexGrow: 1, textAlign: "center", margin: "0" }}>
                {label()}
            </div>

            <div style={{ display: "flex", gap: "5px" }}>
                <button className="toolbar-btn nav-btn" onClick={goToBack}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button className="toolbar-btn nav-btn" onClick={goToNext}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
        </div>
    );
};

const CalendarPage = () => {
    const { isAdmin } = useAuth(); // Get admin status
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
    const [selectedSlot, setSelectedSlot] = useState(null);

    // Fetch events from Firestore
    useEffect(() => {
        const unsubscribe = firestore.collection("events").onSnapshot(snapshot => {
            const fetchedEvents = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title,
                    start: data.start.toDate(), // Convert Firestore Timestamp to Date
                    end: data.end.toDate(),     // Convert Firestore Timestamp to Date
                };
            });
            setEvents(fetchedEvents);
        }, error => {
            console.error("Error fetching events:", error);
        });

        return () => unsubscribe();
    }, []);

    const handleSelectSlot = (slotInfo) => {
        if (!isAdmin) {
            alert("Only admins can create events.");
            return;
        }
        setSelectedSlot(slotInfo);
        // Pre-fill modal with selected times
        setNewEvent({
            title: "",
            start: moment(slotInfo.start).format("YYYY-MM-DDTHH:mm"),
            end: moment(slotInfo.end).format("YYYY-MM-DDTHH:mm")
        });
        setShowModal(true);
    };

    const handleSaveEvent = async () => {
        if (newEvent.title && newEvent.start && newEvent.end) {
            setIsSaving(true);
            try {
                await firestore.collection("events").add({
                    title: newEvent.title,
                    start: new Date(newEvent.start),
                    end: new Date(newEvent.end),
                    createdAt: new Date(),
                    createdBy: "admin" // You could use user.uid here if available
                });
                setShowModal(false);
            } catch (error) {
                console.error("Error saving event:", error);
                alert("Failed to save event.");
            } finally {
                setIsSaving(false);
            }
        } else {
            alert("Please fill in all fields.");
        }
    };

    const handleSelectEvent = async (event) => {
        if (!isAdmin) return;
        const action = window.confirm(`Delete event "${event.title}"?`);
        if (action) {
            try {
                await firestore.collection("events").doc(event.id).delete();
            } catch (error) {
                console.error("Error deleting event:", error);
                alert("Failed to delete event.");
            }
        }
    };

    return (
        <>
            <div style={{
                minHeight: "100vh",
                background: "#f8f9fa", // White/Grey theme
                color: "#333",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "120px 20px 40px" // Boost top padding significantly
            }}>
                <style>
                    {`
                    .rbc-calendar {
                        background: #ffffff;
                        border-radius: 16px;
                        padding: 20px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                        border: 1px solid rgba(0,0,0,0.05);
                        font-family: 'Inter', sans-serif;
                    }
                    .rbc-toolbar button {
                        color: #555;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        transition: all 0.2s;
                    }
                    /* Custom Toolbar Styles */
                    .toolbar-btn {
                        background: white;
                        border: 1px solid #eee;
                        color: #555;
                        padding: 8px 16px;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .toolbar-btn:hover {
                        background: #f59e0b;
                        color: white !important;
                        border-color: #f59e0b;
                        transform: translateY(-1px);
                    }
                    .active-view {
                        background: #f59e0b !important;
                        color: white !important;
                        border-color: #f59e0b !important;
                    }
                    .nav-btn {
                        padding: 8px 12px; /* Square-ish for arrows */
                    }
                    /* Remove default toolbar styling that might conflict */
                    .rbc-toolbar {
                        border: none !important;
                        background: transparent !important;
                    }

                    .rbc-header {
                        padding: 10px 0;
                        font-weight: 600;
                        color: #555;
                        border-bottom: 1px solid #eee;
                    }
                    .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
                        border: 1px solid #eee;
                    }
                    .rbc-day-bg + .rbc-day-bg {
                        border-left: 1px solid #eee;
                    }
                    .rbc-row-segment .rbc-row-content .rbc-row { 
                        border-top: 1px solid #eee;
                    }
                    .rbc-event {
                        background-color: #f59e0b;
                        border-radius: 6px;
                    }
                    .rbc-today {
                        background-color: rgba(245, 158, 11, 0.05);
                    }
                    .modal-overlay {
                        position: fixed;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: rgba(0,0,0,0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1000;
                        backdrop-filter: blur(5px);
                    }
                    .modal-content {
                        background: white;
                        border-radius: 20px;
                        padding: 30px;
                        width: 90%;
                        max-width: 400px;
                        box-shadow: 0 20px 50px rgba(0,0,0,0.2);
                        animation: scaleUp 0.3s ease;
                        color: #000; /* Ensure text is black */
                    }
                    @keyframes scaleUp {
                        from { transform: scale(0.9); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                    .form-group {
                        margin-bottom: 20px;
                    }
                    .form-label {
                        display: block;
                        font-size: 0.9rem;
                        color: #333; /* Darker label */
                        margin-bottom: 8px;
                        font-weight: 600;
                    }
                    .form-input {
                        width: 100%;
                        padding: 12px;
                        border: 1px solid #ccc;
                        background: #ffffff !important; /* Force white background */
                        color: #000000 !important; /* Force black text */
                        border-radius: 8px;
                        font-size: 1rem;
                        outline: none;
                        transition: border-color 0.2s;
                    }
                    .form-input:focus {
                        border-color: #f59e0b;
                    }
                    .btn-primary {
                        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 10px;
                        font-weight: 600;
                        cursor: pointer;
                        width: 100%;
                        font-size: 1rem;
                        transition: transform 0.2s;
                    }
                    .btn-primary:hover {
                        transform: translateY(-2px);
                    }
                    .close-btn {
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: #999;
                        font-size: 1.2rem;
                    }
                `}
                </style>

                <div style={{
                    width: "100%",
                    maxWidth: "1000px",
                    marginTop: "0",
                    flex: "1 0 auto" // Push footer down
                }}>
                    <h1 style={{
                        textAlign: "center",
                        marginBottom: "10px",
                        color: "#1a1a1a",
                        fontSize: "2rem",
                        fontWeight: "800",
                        letterSpacing: "-0.5px"
                    }}>
                        Events & Schedules
                    </h1>
                    <p style={{ textAlign: "center", color: "#666", marginBottom: "40px" }}>
                        Keep track of upcoming activities. {isAdmin ? "(Admin Mode)" : ""}
                    </p>

                    <div style={{ height: "65vh" }}>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: "100%" }}
                            selectable
                            onSelectSlot={handleSelectSlot}
                            onSelectEvent={handleSelectEvent}
                            defaultView='month'
                            views={['month', 'week', 'day']}
                            components={{
                                toolbar: CustomToolbar
                            }}
                        />
                    </div>
                </div>

                {/* Add Event Modal */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content" style={{ position: "relative", color: "#000" }}>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                            <h2 style={{ marginBottom: "25px", color: "#000" }}>Add New Event</h2>

                            <div className="form-group">
                                <label className="form-label" style={{ color: "#333" }}>Event Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Meeting, Webinar, etc."
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ color: "#333" }}>Start Date & Time</label>
                                <input
                                    type="datetime-local"
                                    className="form-input"
                                    value={newEvent.start}
                                    onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ color: "#333" }}>End Date & Time</label>
                                <input
                                    type="datetime-local"
                                    className="form-input"
                                    value={newEvent.end}
                                    onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                                />
                            </div>

                            <button
                                className="btn-primary"
                                onClick={handleSaveEvent}
                                disabled={isSaving}
                                style={{ opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}
                            >
                                <FontAwesomeIcon icon={faCalendarPlus} style={{ marginRight: "8px" }} />
                                {isSaving ? "Creating..." : "Create Event"}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
};

export default CalendarPage;
