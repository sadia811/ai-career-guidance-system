import { Link } from "react-router-dom";
import "../styles/AuthPage.css";

function Footer({ homePath = "/" }) {
    return (
        <footer className="site-footer">
            <Link to={homePath} className="site-brand footer-brand brand-link">
                <BrandLogo />
                <span>Career Guidance</span>
            </Link>

            <div className="footer-links">
                <Link to="/privacy-policy">Privacy Policy</Link>
                <Link to="/terms-of-service">Terms of Service</Link>
                <Link to="/contact">Contact</Link>
            </div>

            <div className="social-icons">
                <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                >
                    <FacebookIcon />
                </a>

                <a
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                >
                    <TwitterIcon />
                </a>

                <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                >
                    <LinkedinIcon />
                </a>
            </div>
        </footer>
    );
}

function BrandLogo() {
    return (
        <svg
            className="brand-logo"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <circle cx="31" cy="32" r="17" stroke="#4B84E5" strokeWidth="7" />
            <circle cx="31" cy="32" r="7" stroke="#1F3767" strokeWidth="4" />
            <circle cx="14" cy="31" r="4" fill="#1F3767" />
            <circle cx="48" cy="15" r="4" fill="#1F3767" />
            <circle cx="48" cy="49" r="4" fill="#1F3767" />
            <path
                d="M18 21C22 15 28 12 35 12"
                stroke="#8FB8F4"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M43 43C39 48 34 51 27 51"
                stroke="#8FB8F4"
                strokeWidth="4"
                strokeLinecap="round"
            />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M13.2 20V12.9H15.6L16 10.1H13.2V8.3C13.2 7.49 13.44 6.94 14.6 6.94H16.1V4.44C15.84 4.4 14.97 4.32 13.95 4.32C11.83 4.32 10.38 5.62 10.38 8V10.1H8V12.9H10.38V20H13.2Z"
                fill="white"
            />
        </svg>
    );
}

function TwitterIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M19 7.35C18.49 7.58 17.94 7.73 17.35 7.8C17.96 7.44 18.43 6.88 18.65 6.21C18.08 6.55 17.45 6.79 16.78 6.93C16.24 6.36 15.47 6 14.61 6C12.99 6 11.68 7.31 11.68 8.93C11.68 9.16 11.71 9.38 11.75 9.58C9.31 9.46 7.15 8.29 5.7 6.5C5.45 6.92 5.31 7.42 5.31 7.95C5.31 8.97 5.83 9.87 6.63 10.4C6.16 10.39 5.72 10.25 5.34 10.03V10.07C5.34 11.5 6.36 12.68 7.72 12.95C7.48 13.02 7.21 13.06 6.94 13.06C6.76 13.06 6.58 13.04 6.42 13C6.77 14.14 7.84 14.96 9.1 14.98C8.11 15.76 6.87 16.23 5.52 16.23C5.27 16.23 5.03 16.22 4.79 16.18C6.07 17 7.58 17.47 9.2 17.47C14.61 17.47 17.57 12.99 17.57 9.1L17.56 8.72C18.14 8.3 18.64 7.78 19 7.35Z"
                fill="white"
            />
        </svg>
    );
}

function LinkedinIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M6.08 8.98C6.99 8.98 7.73 8.24 7.73 7.33C7.73 6.42 6.99 5.68 6.08 5.68C5.17 5.68 4.43 6.42 4.43 7.33C4.43 8.24 5.17 8.98 6.08 8.98Z"
                fill="white"
            />
            <path d="M4.71 10.26H7.39V18.38H4.71V10.26Z" fill="white" />
            <path
                d="M9.08 10.26H11.65V11.37H11.69C12.05 10.69 12.93 9.97 14.24 9.97C16.96 9.97 17.47 11.76 17.47 14.08V18.38H14.79V14.57C14.79 13.66 14.77 12.49 13.52 12.49C12.25 12.49 12.05 13.48 12.05 14.5V18.38H9.08V10.26Z"
                fill="white"
            />
        </svg>
    );
}

export default Footer;