import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoggedInShell from "../components/LoggedInShell";
import { clearStoredUser, getStoredUser, setStoredUser } from "../utils/auth";
import "../styles/SettingsPage.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

function SettingsPage() {
    const navigate = useNavigate();
    const storedUser = getStoredUser() || {};
    const token = storedUser?.token || "";

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(true);
    const [savingBasic, setSavingBasic] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            navigate("/auth");
            return;
        }

        const loadSettings = async () => {
            try {
                setLoading(true);

                const response = await fetch(`${API_URL}/api/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    setMessage(data.message || "Unable to load account settings.");
                    setLoading(false);
                    return;
                }

                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    password: "",
                    confirmPassword: "",
                });
            } catch (error) {
                setMessage("Unable to load settings right now.");
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, [token, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setMessage("");
    };

    const handleSaveBasicInfo = async (e) => {
        e.preventDefault();

        if (!token) return;

        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            setSavingBasic(true);
            setMessage("");

            const response = await fetch(`${API_URL}/api/users/me`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password || undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Unable to update account settings.");
                return;
            }

            setStoredUser({
                ...storedUser,
                name: data.user.name,
                email: data.user.email,
                hasCompletedProfile: data.user.hasCompletedProfile,
            });

            setFormData((prev) => ({
                ...prev,
                password: "",
                confirmPassword: "",
            }));

            setMessage("Account settings updated successfully.");
        } catch (error) {
            setMessage("Unable to update settings right now.");
        } finally {
            setSavingBasic(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!token) return;

        const confirmed = window.confirm(
            "Are you sure you want to permanently delete your account?"
        );

        if (!confirmed) return;

        try {
            setDeletingAccount(true);
            setMessage("");

            const response = await fetch(`${API_URL}/api/users/me`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Unable to delete account.");
                return;
            }

            clearStoredUser();
            navigate("/auth");
        } catch (error) {
            setMessage("Unable to delete account right now.");
        } finally {
            setDeletingAccount(false);
        }
    };

    return (
        <LoggedInShell
            activeKey="profile"
            title="Settings"
            subtitle="Manage your account information and password."
        >
            {loading ? (
                <div className="settings-loading-box">Loading account settings...</div>
            ) : (
                <div className="settings-page-grid">
                    <section className="settings-card">
                        <h2>Personal Information</h2>

                        <form className="settings-form" onSubmit={handleSaveBasicInfo}>
                            <label>
                                Full Name
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </label>

                            <label>
                                Email
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </label>

                            <label>
                                New Password
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                />
                            </label>

                            <label>
                                Confirm New Password
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                />
                            </label>

                            <button type="submit" className="settings-primary-btn">
                                {savingBasic ? "Saving..." : "Save Changes"}
                            </button>
                        </form>
                    </section>

                    <section className="settings-card danger-card">
                        <h2>Danger Zone</h2>
                        <p>
                            Deleting your account will permanently remove your profile and progress data.
                        </p>

                        <button
                            type="button"
                            className="settings-danger-btn"
                            onClick={handleDeleteAccount}
                            disabled={deletingAccount}
                        >
                            {deletingAccount ? "Deleting..." : "Delete Account"}
                        </button>
                    </section>

                    {message && <p className="settings-message">{message}</p>}
                </div>
            )}
        </LoggedInShell>
    );
}

export default SettingsPage;