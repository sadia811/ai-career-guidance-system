import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/ProfileSetupPage.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const profileNavLinks = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Explore Careers", to: "/app/explore-careers" },
    { label: "About", to: "/about" },
];

const technicalSkillOptions = ["Python", "Java", "JavaScript", "React", "SQL", "HTML"];
const softSkillOptions = ["Communication", "Leadership", "Problem Solving", "Teamwork"];
const careerInterestOptions = [
    "Artificial Intelligence",
    "Data Science",
    "Software",
    "Cyber Security",
    "Networking",
];
const experienceTagOptions = [
    "Artificial Intelligence",
    "Data Science",
    "Cyber Security",
    "Networking",
    "Software Development",
];

function ProfileSetupPage() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("userInfo") || "{}");

    const [formData, setFormData] = useState({
        degree: "",
        major: "",
        technicalSkills: [],
        softSkills: [],
        careerInterests: [],
        experienceTags: [],
        experienceText: "",
    });

    const [loadingProfile, setLoadingProfile] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            if (!storedUser?.token) {
                setLoadingProfile(false);
                setErrorMessage("You need to log in first.");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/profile/me`, {
                    headers: {
                        Authorization: `Bearer ${storedUser.token}`,
                    },
                });

                if (response.status === 404) {
                    setLoadingProfile(false);
                    return;
                }

                const data = await response.json();

                if (!response.ok) {
                    setErrorMessage(data.message || "Failed to load profile.");
                    setLoadingProfile(false);
                    return;
                }

                setFormData({
                    degree: data.degree || "",
                    major: data.major || "",
                    technicalSkills: data.technicalSkills || [],
                    softSkills: data.softSkills || [],
                    careerInterests: data.careerInterests || [],
                    experienceTags: data.experienceTags || [],
                    experienceText: data.experienceText || "",
                });
            } catch (error) {
                setErrorMessage("Unable to load profile right now.");
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchProfile();
    }, [storedUser?.token]);

    const handleTextChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleCheckboxToggle = (fieldName, value) => {
        setFormData((prev) => {
            const alreadySelected = prev[fieldName].includes(value);

            return {
                ...prev,
                [fieldName]: alreadySelected
                    ? prev[fieldName].filter((item) => item !== value)
                    : [...prev[fieldName], value],
            };
        });

        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!storedUser?.token) {
            setErrorMessage("You need to log in first.");
            return;
        }

        if (!formData.degree || !formData.major) {
            setErrorMessage("Please complete your education details.");
            return;
        }

        if (formData.technicalSkills.length === 0) {
            setErrorMessage("Please select at least one technical skill.");
            return;
        }

        if (formData.careerInterests.length === 0) {
            setErrorMessage("Please select at least one career interest.");
            return;
        }

        try {
            setSavingProfile(true);

            const response = await fetch(`${API_URL}/api/profile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedUser.token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || "Failed to save profile.");
                return;
            }

            setSuccessMessage("Profile saved successfully. Redirecting...");

            setTimeout(() => {
                navigate("/dashboard");
            }, 900);
        } catch (error) {
            setErrorMessage("Unable to connect to server. Please try again.");
        } finally {
            setSavingProfile(false);
        }
    };

    return (
        <div className="profile-setup-page">
            <Header
                navLinks={profileNavLinks}
                homePath="/dashboard"
                showProfileButton={true}
                profilePath="/dashboard"
            />

            <main className="profile-setup-main">
                <section className="profile-setup-shell">
                    <div className="profile-setup-heading-wrap">
                        <h1 className="profile-setup-title">Profile Setup</h1>
                        <p className="profile-setup-subtitle">
                            Complete your profile to get personalized career recommendations.
                        </p>
                    </div>

                    {loadingProfile ? (
                        <div className="profile-loading-box">Loading profile...</div>
                    ) : (
                        <form className="profile-form-card" onSubmit={handleSubmit}>
                            <section className="profile-block">
                                <h2>Education</h2>

                                <div className="profile-two-col">
                                    <div className="profile-field">
                                        <label>Degree</label>
                                        <div className="profile-select-wrap">
                                            <select
                                                name="degree"
                                                value={formData.degree}
                                                onChange={handleTextChange}
                                            >
                                                <option value="">Select degree</option>
                                                <option value="Diploma">Diploma</option>
                                                <option value="Bachelor">Bachelor</option>
                                                <option value="Master">Master</option>
                                                <option value="PhD">PhD</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="profile-field">
                                        <label>Major</label>
                                        <div className="profile-select-wrap">
                                            <select
                                                name="major"
                                                value={formData.major}
                                                onChange={handleTextChange}
                                            >
                                                <option value="">Select major</option>
                                                <option value="Computer Science">Computer Science</option>
                                                <option value="Software Engineering">Software Engineering</option>
                                                <option value="Information Technology">Information Technology</option>
                                                <option value="Data Science">Data Science</option>
                                                <option value="Cyber Security">Cyber Security</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="profile-block">
                                <div className="profile-block-header">
                                    <h2>Technical Skills</h2>
                                    <button type="button" className="add-skill-btn">+ Add Skill</button>
                                </div>

                                <div className="skill-grid">
                                    {technicalSkillOptions.map((skill) => (
                                        <label key={skill} className={`skill-pill ${formData.technicalSkills.includes(skill) ? "checked" : ""}`}>
                                            <input
                                                type="checkbox"
                                                checked={formData.technicalSkills.includes(skill)}
                                                onChange={() => handleCheckboxToggle("technicalSkills", skill)}
                                            />
                                            <span className="checkmark-box">{formData.technicalSkills.includes(skill) ? "✓" : ""}</span>
                                            <span>{skill}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <section className="profile-block">
                                <div className="profile-block-header">
                                    <h2>Soft Skills</h2>
                                    <button type="button" className="add-skill-btn">+ Add Skill</button>
                                </div>

                                <div className="skill-grid">
                                    {softSkillOptions.map((skill) => (
                                        <label key={skill} className={`skill-pill ${formData.softSkills.includes(skill) ? "checked" : ""}`}>
                                            <input
                                                type="checkbox"
                                                checked={formData.softSkills.includes(skill)}
                                                onChange={() => handleCheckboxToggle("softSkills", skill)}
                                            />
                                            <span className="checkmark-box">{formData.softSkills.includes(skill) ? "✓" : ""}</span>
                                            <span>{skill}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <section className="profile-block">
                                <div className="profile-block-header">
                                    <h2>Career Interests</h2>
                                    <button type="button" className="add-skill-btn">+ Add Skill</button>
                                </div>

                                <div className="skill-grid">
                                    {careerInterestOptions.map((skill) => (
                                        <label key={skill} className={`skill-pill ${formData.careerInterests.includes(skill) ? "checked" : ""}`}>
                                            <input
                                                type="checkbox"
                                                checked={formData.careerInterests.includes(skill)}
                                                onChange={() => handleCheckboxToggle("careerInterests", skill)}
                                            />
                                            <span className="checkmark-box">{formData.careerInterests.includes(skill) ? "✓" : ""}</span>
                                            <span>{skill}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <section className="profile-block">
                                <h2>Experience</h2>

                                <div className="skill-grid">
                                    {experienceTagOptions.map((skill) => (
                                        <label key={skill} className={`skill-pill ${formData.experienceTags.includes(skill) ? "checked" : ""}`}>
                                            <input
                                                type="checkbox"
                                                checked={formData.experienceTags.includes(skill)}
                                                onChange={() => handleCheckboxToggle("experienceTags", skill)}
                                            />
                                            <span className="checkmark-box">{formData.experienceTags.includes(skill) ? "✓" : ""}</span>
                                            <span>{skill}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <section className="profile-block">
                                <h2>Experience Details</h2>

                                <div className="profile-field">
                                    <textarea
                                        name="experienceText"
                                        rows="5"
                                        placeholder="Describe your work experience, internships, and projects"
                                        value={formData.experienceText}
                                        onChange={handleTextChange}
                                    />
                                </div>
                            </section>

                            {errorMessage && (
                                <p className="profile-message profile-error">{errorMessage}</p>
                            )}

                            {successMessage && (
                                <p className="profile-message profile-success">{successMessage}</p>
                            )}

                            <div className="profile-submit-wrap">
                                <button type="submit" className="profile-save-btn">
                                    {savingProfile ? "Saving..." : "Save Profile"}
                                </button>
                            </div>
                        </form>
                    )}
                </section>
            </main>

            <Footer homePath="/dashboard" />
        </div>
    );
}

export default ProfileSetupPage;