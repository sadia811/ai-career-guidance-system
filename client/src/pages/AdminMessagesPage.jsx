import { useEffect, useState } from "react";
import LoggedInShell from "../components/LoggedInShell";
import { getStoredUser } from "../utils/auth";
import "../styles/AdminMessagesPage.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

function AdminMessagesPage() {
    const storedUser = getStoredUser() || {};
    const token = storedUser?.token || "";

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageMessage, setPageMessage] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);

                const response = await fetch(`${API_URL}/api/contact/admin/messages`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    setPageMessage(data.message || "Unable to load admin messages.");
                    setMessages([]);
                    return;
                }

                setMessages(Array.isArray(data) ? data : []);
            } catch (error) {
                setPageMessage("Unable to load messages right now.");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchMessages();
        }
    }, [token]);

    const handleMarkRead = async (messageId) => {
        try {
            const response = await fetch(`${API_URL}/api/contact/admin/messages/${messageId}/read`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setPageMessage(data.message || "Unable to update message.");
                return;
            }

            setMessages((prev) =>
                prev.map((item) =>
                    item._id === messageId ? { ...item, status: "Read" } : item
                )
            );
        } catch (error) {
            setPageMessage("Unable to update message right now.");
        }
    };

    const handleDelete = async (messageId) => {
        try {
            const response = await fetch(`${API_URL}/api/contact/admin/messages/${messageId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setPageMessage(data.message || "Unable to delete message.");
                return;
            }

            setMessages((prev) => prev.filter((item) => item._id !== messageId));
        } catch (error) {
            setPageMessage("Unable to delete message right now.");
        }
    };

    return (
        <LoggedInShell
            activeKey="dashboard"
            title="Admin Messages"
            subtitle="Review contact messages sent by users and visitors."
        >
            {pageMessage && <div className="admin-message-banner">{pageMessage}</div>}

            {loading ? (
                <div className="admin-messages-state">Loading messages...</div>
            ) : messages.length === 0 ? (
                <div className="admin-messages-state">No contact messages yet.</div>
            ) : (
                <div className="admin-messages-list">
                    {messages.map((item) => (
                        <article key={item._id} className="admin-message-card">
                            <div className="admin-message-top">
                                <div>
                                    <h3>{item.subject || "No Subject"}</h3>
                                    <p>
                                        {item.name} · {item.email}
                                    </p>
                                </div>

                                <span className={`admin-message-status ${item.status.toLowerCase()}`}>
                                    {item.status}
                                </span>
                            </div>

                            <p className="admin-message-body">{item.message}</p>

                            <div className="admin-message-actions">
                                <button
                                    type="button"
                                    className="admin-read-btn"
                                    onClick={() => handleMarkRead(item._id)}
                                    disabled={item.status === "Read"}
                                >
                                    {item.status === "Read" ? "Read" : "Mark Read"}
                                </button>

                                <button
                                    type="button"
                                    className="admin-delete-btn"
                                    onClick={() => handleDelete(item._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </LoggedInShell>
    );
}

export default AdminMessagesPage;