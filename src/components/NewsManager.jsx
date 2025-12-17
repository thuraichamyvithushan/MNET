import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper, faPlus, faTrash, faEdit, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

const NewsManager = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const unsubscribe = firestore.collection("news")
            .orderBy("createdAt", "desc")
            .onSnapshot((snapshot) => {
                const newsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setNews(newsList);
            }, (error) => {
                console.error("Error fetching news:", error);
                toast.error("Failed to fetch news updates");
            });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            toast.warning("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const newsData = {
                title,
                content,
                updatedAt: new Date()
            };

            if (editingId) {
                await firestore.collection("news").doc(editingId).update(newsData);
                toast.success("News updated successfully");
            } else {
                await firestore.collection("news").add({
                    ...newsData,
                    createdAt: new Date()
                });
                toast.success("News added successfully");
            }
            resetForm();
        } catch (error) {
            console.error("Error saving news:", error);
            toast.error("Failed to save news");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this news item?")) {
            try {
                await firestore.collection("news").doc(id).delete();
                toast.success("News deleted successfully");
            } catch (error) {
                console.error("Error deleting news:", error);
                toast.error("Failed to delete news");
            }
        }
    };

    const handleEdit = (item) => {
        setTitle(item.title);
        setContent(item.content);
        setEditingId(item.id);
        setShowForm(true);
    };

    const resetForm = () => {
        setTitle("");
        setContent("");
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="admin-section-container">
            <div className="section-header">
                <div>
                    <h2><FontAwesomeIcon icon={faNewspaper} className="header-icon" /> News Management</h2>
                    <p>Add, update, or remove news and announcements.</p>
                </div>
                {!showForm && (
                    <button className="add-btn" onClick={() => setShowForm(true)}>
                        <FontAwesomeIcon icon={faPlus} /> Add News
                    </button>
                )}
            </div>

            {showForm && (
                <div className="news-form-container">
                    <h3>{editingId ? "Edit News" : "Add New News"}</h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="News Headline"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="News content details..."
                                rows="5"
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="save-btn" disabled={loading}>
                                <FontAwesomeIcon icon={faSave} /> {loading ? "Saving..." : (editingId ? "Update News" : "Post News")}
                            </button>
                            <button type="button" className="cancel-btn" onClick={resetForm} disabled={loading}>
                                <FontAwesomeIcon icon={faTimes} /> Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="news-list">
                {news.length === 0 ? (
                    <p className="no-data">No news items found.</p>
                ) : (
                    news.map((item) => (
                        <div key={item.id} className="news-admin-card">
                            <div className="news-content-preview">
                                <h4>{item.title}</h4>
                                <p>{item.content}</p>
                                <span className="news-date">
                                    {item.createdAt?.toDate().toLocaleDateString()}
                                </span>
                            </div>
                            <div className="news-actions">
                                <button className="icon-btn edit-btn" onClick={() => handleEdit(item)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button className="icon-btn delete-btn" onClick={() => handleDelete(item.id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NewsManager;
