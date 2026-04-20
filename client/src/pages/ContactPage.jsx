import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getStoredUser } from "../utils/auth";
import "../styles/StaticInfoPage.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const visitorNavLinks = [
    { label: "Home", to: "/" },
    { label: "Explore Careers", to: "/app/explore-careers" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
];

function ContactPage() {
    const storedUser = getStoredUser() || {};

    const [formData, setFormData] = useState({
        name: storedUser.name || "",
        email: storedUser.email || "",
        subject: "",
        message: "",
    });

    const [sending, setSending] = useState(false);
    const [feedback, setFeedback] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setFeedback("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            setFeedback("Please fill in name, email, and message.");
            return;
        }

        try {
            setSending(true);
            setFeedback("");

            const response = await fetch(`${API_URL}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(storedUser?.token
                        ? { Authorization: `Bearer ${storedUser.token}` }
                        : {}),
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setFeedback(data.message || "Unable to send message.");
                return;
            }

            setFeedback("Message sent successfully.");
            setFormData((prev) => ({
                ...prev,
                subject: "",
                message: "",
            }));
        } catch (error) {
            console.error("Contact form error:", error);
            setFeedback("Unable to connect to server right now.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="static-page">
            <Header
                navLinks={visitorNavLinks}
                homePath="/"
                rightAction={{ label: "Login / Register", to: "/auth" }}
                mode="guest"
            />

            <main className="static-page-main">
                <section className="static-page-card">
                    <span className="static-page-chip">Contact Us</span>
                    <h1>Get in touch</h1>
                    <p>
                        Send your questions, feedback, or support requests. Your message will be stored
                        and visible to admins in the system.
                    </p>

                    <form className="static-contact-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleChange}
                        />

                        <textarea
                            rows="6"
                            name="message"
                            placeholder="Write your message here"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit" className="static-submit-btn">
                            {sending ? "Sending..." : "Send Message"}
                        </button>
                    </form>

                    {feedback && <p className="static-success-text">{feedback}</p>}
                </section>
            </main>

            <Footer homePath="/" />
        </div>
    );
}

export default ContactPage;