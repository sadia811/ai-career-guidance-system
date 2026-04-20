import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoggedInShell from "../components/LoggedInShell";
import { getStoredUser } from "../utils/auth";
import "../styles/AdminDashboardPage.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

function AdminDashboardPage() {
    const navigate = useNavigate();
    const storedUser = getStoredUser() || {};
    const token = storedUser?.token || "";

    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState("");
    const [dashboardData, setDashboardData] = useState({
        overview: {
            totalUsers: 0,
            completedProfiles: 0,
            totalCareers: 0,
            totalCourses: 0,
            unreadMessages: 0,
        },
        recentUsers: [],
        recentMessages: [],
        popularCareers: [],
    });

    useEffect(() => {
        if (!token) {
            navigate("/auth");
            return;
        }

        if (!storedUser?.isAdmin) {
            navigate("/dashboard");
            return;
        }

        const loadAdminDashboard = async () => {
            try {
                setLoading(true);
                setPageError("");

                const response = await fetch(`${API_URL}/api/admin/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    setPageError(data.message || "Unable to load admin dashboard.");
                    setLoading(false);
                    return;
                }

                setDashboardData(data);
            } catch (error) {
                setPageError("Unable to connect to admin dashboard right now.");
            } finally {
                setLoading(false);
            }
        };

        loadAdminDashboard();
    }, [token, storedUser?.isAdmin, navigate]);

    const { overview, recentUsers, recentMessages, popularCareers } = dashboardData;

    return (
        <LoggedInShell
            activeKey="dashboard"
            title="Admin Dashboard"
            subtitle="Monitor users, careers, courses, and incoming contact messages."
        >
            {loading ? (
                <div className="admin-dashboard-state">Loading admin dashboard...</div>
            ) : pageError ? (
                <div className="admin-dashboard-state error">{pageError}</div>
            ) : (
                <div className="admin-dashboard-grid">
                    <section className="admin-overview-grid">
                        <StatCard label="Total Users" value={overview.totalUsers} />
                        <StatCard label="Completed Profiles" value={overview.completedProfiles} />
                        <StatCard label="Total Careers" value={overview.totalCareers} />
                        <StatCard label="Total Courses" value={overview.totalCourses} />
                        <StatCard label="Unread Messages" value={overview.unreadMessages} />
                    </section>

                    <section className="admin-panel-grid">
                        <article className="admin-panel-card">
                            <div className="admin-panel-head">
                                <h3>Recent Users</h3>
                            </div>

                            {recentUsers.length > 0 ? (
                                <div className="admin-list">
                                    {recentUsers.map((user) => (
                                        <div key={user._id} className="admin-list-item">
                                            <div>
                                                <h4>{user.name}</h4>
                                                <p>{user.email}</p>
                                            </div>

                                            <div className="admin-list-meta">
                                                <span
                                                    className={`admin-badge ${user.hasCompletedProfile ? "success" : "neutral"
                                                        }`}
                                                >
                                                    {user.hasCompletedProfile ? "Profile Complete" : "Incomplete"}
                                                </span>

                                                {user.isAdmin ? (
                                                    <span className="admin-badge admin">Admin</span>
                                                ) : null}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="admin-empty-text">No recent users found.</p>
                            )}
                        </article>

                        <article className="admin-panel-card">
                            <div className="admin-panel-head">
                                <h3>Recent Messages</h3>

                                <button
                                    type="button"
                                    className="admin-link-btn"
                                    onClick={() => navigate("/admin/messages")}
                                >
                                    View All
                                </button>
                            </div>

                            {recentMessages.length > 0 ? (
                                <div className="admin-list">
                                    {recentMessages.map((message) => (
                                        <div key={message._id} className="admin-list-item">
                                            <div>
                                                <h4>{message.subject || "No Subject"}</h4>
                                                <p>
                                                    {message.name} · {message.email}
                                                </p>
                                            </div>

                                            <span
                                                className={`admin-badge ${message.status === "Unread" ? "warning" : "success"
                                                    }`}
                                            >
                                                {message.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="admin-empty-text">No messages found.</p>
                            )}
                        </article>

                        <article className="admin-panel-card full-span">
                            <div className="admin-panel-head">
                                <h3>Popular Careers</h3>
                            </div>

                            {popularCareers.length > 0 ? (
                                <div className="admin-career-grid">
                                    {popularCareers.map((career) => (
                                        <div key={career._id} className="admin-career-card">
                                            <h4>{career.title}</h4>
                                            <p>{career.industry || "Industry not set"}</p>

                                            <div className="admin-career-meta">
                                                <span>Score: {career.popularityScore || 0}</span>
                                                <span>{formatSalary(career.salaryMin, career.salaryMax)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="admin-empty-text">No popular careers found.</p>
                            )}
                        </article>
                    </section>
                </div>
            )}
        </LoggedInShell>
    );
}

function StatCard({ label, value }) {
    return (
        <article className="admin-stat-card">
            <span>{label}</span>
            <strong>{value}</strong>
        </article>
    );
}

function formatSalary(min, max) {
    if (!min && !max) return "Salary not available";
    if (min && max) return `$${Math.round(min / 1000)}k - $${Math.round(max / 1000)}k`;
    if (min) return `From $${Math.round(min / 1000)}k`;
    return `Up to $${Math.round(max / 1000)}k`;
}

export default AdminDashboardPage;