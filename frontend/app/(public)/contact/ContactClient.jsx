"use client"; 

import useService from "../../hooks/useServiceSearch";


const benefits = [
  { icon: "fas fa-user-tie", label: "Client-oriented" },
  { icon: "fas fa-shield-alt", label: "Independent" },
  { icon: "fas fa-brain", label: "Competent" },
  { icon: "fas fa-chart-line", label: "Results-driven" },
  { icon: "fas fa-puzzle-piece", label: "Problem-solving" },
  { icon: "fas fa-eye", label: "Transparent" },
];


export default function ContactPage() {
  const serviceCategoryId = 3;
  const { settingData } = useService(serviceCategoryId) || {};

  return (
    <>
      <style>{`
        /* ─── Reset helpers ─────────────────────────────── */
        *, *::before, *::after { box-sizing: border-box; }

        /* ─── Split Section ─────────────────────────────── */
        .contact-split-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
        }

        /* Tablet */
        @media (max-width: 991px) {
          .contact-split-section {
            grid-template-columns: 1fr;
          }
        }

        /* ─── Left Panel ────────────────────────────────── */
        .contact-left-panel {
          background: linear-gradient(135deg, #0a1628 0%, #0f2347 60%, #1a3a6e 100%);
          padding: 80px 60px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .contact-left-panel::before {
          content: '';
          position: absolute;
          top: -120px; right: -120px;
          width: 380px; height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,180,255,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .contact-left-panel::after {
          content: '';
          position: absolute;
          bottom: -80px; left: -80px;
          width: 260px; height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,120,255,0.10) 0%, transparent 70%);
          pointer-events: none;
        }

        @media (max-width: 991px) {
          .contact-left-panel {
            padding: 60px 40px;
          }
        }

        @media (max-width: 575px) {
          .contact-left-panel {
            padding: 48px 24px;
          }
        }

        /* ─── Left Panel Typography ─────────────────────── */
        .contact-eyebrow {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #00c2ff;
          margin-bottom: 20px;
          background: rgba(0,194,255,0.10);
          border: 1px solid rgba(0,194,255,0.25);
          padding: 6px 16px;
          border-radius: 30px;
          width: fit-content;
        }

        .contact-left-panel h2 {
          font-size: 2.4rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 20px;
        }

        .contact-left-panel h2 span { color: #00c2ff; }

        @media (max-width: 1199px) {
          .contact-left-panel h2 { font-size: 2rem; }
        }

        @media (max-width: 575px) {
          .contact-left-panel h2 { font-size: 1.7rem; }
        }

        .contact-left-desc {
          font-size: 1rem;
          color: rgba(255,255,255,0.70);
          line-height: 1.8;
          margin-bottom: 40px;
          max-width: 100%;
        }

        @media (max-width: 575px) {
          .contact-left-desc { font-size: 0.93rem; margin-bottom: 30px; }
        }

        /* ─── Benefits ──────────────────────────────────── */
        .benefits-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.40);
          margin-bottom: 16px;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        @media (max-width: 400px) {
          .benefits-grid {
            grid-template-columns: 1fr;
          }
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 13px 15px;
          transition: all 0.3s ease;
        }

        .benefit-item:hover {
          background: rgba(0,194,255,0.10);
          border-color: rgba(0,194,255,0.30);
          transform: translateY(-2px);
        }

        .benefit-item i {
          font-size: 15px;
          color: #00c2ff;
          width: 18px;
          text-align: center;
          flex-shrink: 0;
        }

        .benefit-item span {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          white-space: nowrap;
        }

        /* ─── Right Panel ───────────────────────────────── */
        .contact-right-panel {
          background: #fff;
          padding: 80px 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        @media (max-width: 991px) {
          .contact-right-panel {
            padding: 60px 40px;
          }
        }

        @media (max-width: 575px) {
          .contact-right-panel {
            padding: 48px 24px;
          }
        }

        .form-panel-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0a1628;
          margin-bottom: 6px;
        }

        @media (max-width: 575px) {
          .form-panel-title { font-size: 1.35rem; }
        }

        .form-panel-sub {
          font-size: 14px;
          color: #777;
          margin-bottom: 28px;
        }

        /* ─── Form Grid ─────────────────────────────────── */
        .contact-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 18px;
        }

        @media (max-width: 575px) {
          .contact-form-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ─── Fancy Inputs ──────────────────────────────── */
        .fancy-input {
          position: relative;
          margin-bottom: 18px;
        }

        .fancy-input input,
        .fancy-input textarea {
          width: 100%;
          border: 1.5px solid #e0e8f0;
          border-radius: 10px;
          padding: 13px 14px 13px 46px;
          font-size: 14px;
          color: #333;
          background: #f8faff;
          transition: all 0.25s ease;
          outline: none;
          resize: none;
          font-family: inherit;
          -webkit-appearance: none;
        }

        .fancy-input textarea {
          min-height: 120px;
          padding-top: 13px;
        }

        .fancy-input input:focus,
        .fancy-input textarea:focus {
          border-color: #00c2ff;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(0,194,255,0.08);
        }

        .fancy-input .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #aab8cc;
          font-size: 13px;
          pointer-events: none;
        }

        .fancy-input.textarea-wrap .input-icon {
          top: 17px;
          transform: none;
        }

        /* ─── Checkbox ──────────────────────────────────── */
        .terms-check {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin: 4px 0 22px;
        }

        .terms-check input[type="checkbox"] {
          width: 16px;
          height: 16px;
          margin-top: 2px;
          accent-color: #00c2ff;
          cursor: pointer;
          flex-shrink: 0;
        }

        .terms-check label {
          font-size: 13px;
          color: #666;
          cursor: pointer;
          line-height: 1.5;
        }

        .terms-check label a {
          color: #0a6ebd;
          text-decoration: none;
          font-weight: 600;
        }

        /* ─── Submit Button ─────────────────────────────── */
        .btn-send {
          background: linear-gradient(135deg, #0a1628, #1a3a6e);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 14px 32px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.5px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          font-family: inherit;
          width: auto;
        }

        @media (max-width: 400px) {
          .btn-send {
            width: 100%;
            justify-content: center;
          }
        }

        .btn-send::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #007bbd, #00c2ff);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .btn-send:hover::before { opacity: 1; }

        .btn-send span,
        .btn-send i {
          position: relative;
          z-index: 1;
        }

        .btn-send:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,194,255,0.30);
        }

        /* ─── Info Strip ────────────────────────────────── */
        .contact-info-strip {
          background: #f8faff;
          border-top: 1px solid #e8eef8;
          border-bottom: 1px solid #e8eef8;
          padding: 40px 40px;
        }

        @media (max-width: 767px) {
          .contact-info-strip {
            padding: 32px 24px;
          }
        }

        .info-strip-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }

        @media (max-width: 991px) {
          .info-strip-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px 0;
          }
        }

        @media (max-width: 575px) {
          .info-strip-row {
            grid-template-columns: 1fr;
            gap: 20px 0;
          }
        }

        .info-strip-cell {
          padding: 0 24px;
          border-right: 1px solid #e0e8f5;
        }

        .info-strip-cell:last-child {
          border-right: none;
        }

        @media (max-width: 991px) {
          /* On 2-col layout: remove right border from even cells */
          .info-strip-cell:nth-child(2),
          .info-strip-cell:nth-child(4) {
            border-right: none;
          }
          /* Add bottom border between rows */
          .info-strip-cell:nth-child(1),
          .info-strip-cell:nth-child(2) {
            padding-bottom: 24px;
            border-bottom: 1px solid #e0e8f5;
          }
          .info-strip-cell:nth-child(3),
          .info-strip-cell:nth-child(4) {
            padding-top: 0;
          }
        }

        @media (max-width: 575px) {
          .info-strip-cell {
            border-right: none;
            border-bottom: 1px solid #e0e8f5;
            padding: 16px 0;
          }
          .info-strip-cell:last-child {
            border-bottom: none;
          }
        }

        .info-strip-box {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .info-strip-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: linear-gradient(135deg, #0a1628, #1a3a6e);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .info-strip-icon i { color: #00c2ff; font-size: 15px; }

        .info-strip-text h5 {
          font-size: 11px;
          font-weight: 700;
          color: #0a1628;
          margin: 0 0 4px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .info-strip-text p,
        .info-strip-text a {
          font-size: 13.5px;
          color: #555;
          margin: 0;
          text-decoration: none;
          line-height: 1.55;
          display: block;
        }

        .info-strip-text a:hover { color: #0a6ebd; }

        /* ─── Map ───────────────────────────────────────── */
        .map-wrapper {
          width: 100%;
          height: 420px;
          overflow: hidden;
          position: relative;
        }

        @media (max-width: 767px) {
          .map-wrapper { height: 300px; }
        }

        .map-wrapper iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
          filter: grayscale(15%);
        }
      `}</style>

      <div>
      

        {/* Page Title */}
        <div className="page-title-area transparent-bg5">
          <div className="container">
            <div className="page-title-content text-start">
              <h2>Contact Us</h2>
              <ul>
                <li><a href="/">Home</a></li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Split Section ── */}
        <div className="contact-split-section">

          {/* Left: brand + benefits */}
          <div className="contact-left-panel">
            <span className="contact-eyebrow">Get In Touch</span>
            <h2>We'd Love to <span>Hear From You.</span></h2>
            <p className="contact-left-desc">
              At our IT solution company, we are committed to providing
              exceptional customer service and support. If you are experiencing
              technical difficulties or need assistance with one of our
              services, our team is ready to help.
            </p>
            <p className="benefits-label">Your Benefits</p>
            <div className="benefits-grid">
              {benefits.map((b) => (
                <div className="benefit-item" key={b.label}>
                  <i className={b.icon} />
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="contact-right-panel">
            <h3 className="form-panel-title">Send Us a Message</h3>
            <p className="form-panel-sub">Fill in the form and we'll get back to you within 24 hours.</p>

            <form id="contactForm">
              <div className="contact-form-grid">
                <div className="fancy-input">
                  <input type="text" name="name" id="name" required placeholder="Full Name" />
                  <i className="fas fa-user input-icon" />
                </div>
                <div className="fancy-input">
                  <input type="email" name="email" id="email" required placeholder="Email Address" />
                  <i className="fas fa-envelope input-icon" />
                </div>
                <div className="fancy-input">
                  <input type="text" name="phone_number" id="phone_number" required placeholder="Phone Number" />
                  <i className="fas fa-phone input-icon" />
                </div>
                <div className="fancy-input">
                  <input type="text" name="msg_subject" id="msg_subject" required placeholder="Subject" />
                  <i className="fas fa-tag input-icon" />
                </div>
              </div>

              <div className="fancy-input textarea-wrap">
                <textarea name="message" id="message" required placeholder="Tell us about your project or issue..." defaultValue={""} />
                <i className="fas fa-comment-alt input-icon" />
              </div>

              <div className="terms-check">
                <input type="checkbox" id="checkme" />
                <label htmlFor="checkme">
                  I accept the <a href="/terms-conditions">Terms of Services</a> and{" "}
                  <a href="/privacy-policy">Privacy Policy</a>
                </label>
              </div>

              <button type="submit" className="btn-send">
                <span>Send Message</span>
                <i className="fas fa-paper-plane" />
              </button>
              <div id="msgSubmit" className="h3 text-center hidden" />
            </form>
          </div>
        </div>

        {/* ── Info Strip ── */}
        <div className="contact-info-strip">
          <div className="info-strip-row">
            <div className="info-strip-cell">
              <div className="info-strip-box">
                <div className="info-strip-icon"><i className="fas fa-map-marker-alt" /></div>
                <div className="info-strip-text">
                  <h5>Address</h5>
                  <a href="https://maps.google.com/?q=6065+Hillcroft+St+Houston+TX+77081" target="_blank" rel="noreferrer">
                   {settingData.address ||
                    "6065 Hillcroft St, Suite 511, Houston, TX 77081"}
                  </a>
                </div>
              </div>
            </div>
            <div className="info-strip-cell">
              <div className="info-strip-box">
                <div className="info-strip-icon"><i className="fas fa-phone-volume" /></div>
                <div className="info-strip-text">
                  <h5>Phone</h5>
                  <a href="tel:+13463283273">{settingData.tel || "+1 (346) 328-3273"}</a>
                </div>
              </div>
            </div>
            <div className="info-strip-cell">
              <div className="info-strip-box">
                <div className="info-strip-icon"><i className="far fa-envelope" /></div>
                <div className="info-strip-text">
                  <h5>Email</h5>
                  <a href="mailto:info@astute360corp.com">{settingData.email || "info@astute360corp.com"}</a>
                </div>
              </div>
            </div>
            <div className="info-strip-cell">
              <div className="info-strip-box">
                <div className="info-strip-icon"><i className="fas fa-hourglass-half" /></div>
                <div className="info-strip-text">
                  <h5>Working Hours</h5>
                  <p>Sunday – Friday</p>
                  <p>8:00 AM – 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Map ── */}
        <div id="maps" className="map-wrapper">
          <iframe
            src="https://maps.google.com/maps?hl=en&q=6065+Hillcroft+St,+Houston,+TX+77081,+USA&z=14&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>

     
    </>
  );
}
