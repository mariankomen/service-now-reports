import React from 'react';
import { successToast } from '../../utils/toast';
import './support.css';

const APP_NAME = 'Peeklogic ServiceNow Reports';
const APP_VERSION = '1.0.0';

export default function SupportTab() {
    const instanceUrl = window.location.origin;
    const appInfo = `${APP_NAME} v${APP_VERSION}`;

    const template = `Instance URL: ${instanceUrl}
Application: ${appInfo}
User Role: [Your role here]
Issue Description: [Describe your issue]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Result: [What you expected]
Actual Result: [What actually happened]

Screenshots: [Attach if applicable]`;

    return (
        <div className="support-tab">
            <div className="support-header">
                <h2>📞 Support</h2>
                <p>Need help? We're here to assist you with any questions or issues.</p>
            </div>

            <div className="support-section">
                <h3>Contact Information</h3>
                <div className="support-info-grid">
                    <div className="support-info-item">
                        <strong>Support Contact:</strong>
                        <span>Peeklogic Support Team</span>
                    </div>
                    <div className="support-info-item">
                        <strong>Support Email:</strong>
                        <a href="mailto:support@peeklogic.com" target="_blank" rel="noopener noreferrer nofollow">
                            support@peeklogic.com
                        </a>
                    </div>
                    <div className="support-info-item">
                        <strong>Support Portal:</strong>
                        <a href="https://support.peeklogic.com" target="_blank" rel="noopener noreferrer nofollow">
                            https://support.peeklogic.com
                        </a>
                    </div>
                    <div className="support-info-item">
                        <strong>Support Hours:</strong>
                        <span>Mon–Fri 9:00–18:00 UTC+2</span>
                    </div>
                    <div className="support-info-item">
                        <strong>Response Expectation:</strong>
                        <span>We aim to respond within 24 hours during business hours</span>
                    </div>
                </div>
            </div>

            <div className="support-section">
                <h3>What to Include in a Support Request</h3>
                <p className="support-description">
                    To help us assist you quickly and effectively, please include the following information when contacting support:
                </p>

                <div className="support-checklist">
                    <div className="checklist-item">
                        <div className="checklist-icon">✓</div>
                        <div className="checklist-content">
                            <strong>Instance URL</strong>
                            <div className="checklist-value">{instanceUrl}</div>
                        </div>
                    </div>

                    <div className="checklist-item">
                        <div className="checklist-icon">✓</div>
                        <div className="checklist-content">
                            <strong>Application Name & Version</strong>
                            <div className="checklist-value">{appInfo}</div>
                        </div>
                    </div>

                    <div className="checklist-item">
                        <div className="checklist-icon">✓</div>
                        <div className="checklist-content">
                            <strong>User Role</strong>
                            <div className="checklist-value">e.g., admin, itil, or your specific role</div>
                        </div>
                    </div>

                    <div className="checklist-item">
                        <div className="checklist-icon">✓</div>
                        <div className="checklist-content">
                            <strong>Steps to Reproduce</strong>
                            <div className="checklist-value">Detailed steps that lead to the issue</div>
                        </div>
                    </div>

                    <div className="checklist-item">
                        <div className="checklist-icon">✓</div>
                        <div className="checklist-content">
                            <strong>Expected vs Actual Result</strong>
                            <div className="checklist-value">What you expected to happen vs what actually happened</div>
                        </div>
                    </div>

                    <div className="checklist-item">
                        <div className="checklist-icon">✓</div>
                        <div className="checklist-content">
                            <strong>Screenshots</strong>
                            <div className="checklist-value">If it's a UI issue, please include screenshots</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="support-section support-quick-copy">
                <h3>Quick Copy Template</h3>
                <p className="support-description">
                    Copy the template below and fill it out when contacting support:
                </p>
                <div className="support-template">
                    <pre>{template}</pre>
                    <button
                        className="copy-button"
                        onClick={() => {
                            navigator.clipboard.writeText(template).then(() => {
                                successToast('Template copied to clipboard!');
                            });
                        }}
                    >
                        📋 Copy Template
                    </button>
                </div>
            </div>
        </div>
    );
}
