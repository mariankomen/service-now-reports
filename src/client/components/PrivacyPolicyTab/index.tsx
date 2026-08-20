import React from 'react';
import '../SupportTab/support.css';

export default function PrivacyPolicyTab() {
    return (
        <div className="support-tab">
            <div className="support-header">
                <h2>🔒 App Privacy Policy</h2>
                <p>How Peeklogic ServiceNow Reports handles your data.</p>
            </div>

            <div className="support-section">
                <h3>Overview</h3>
                <p className="support-description">
                    This application connects your ServiceNow instance to your own Salesforce organization,
                    enabling you to build and run reports over data from both systems. All data exchanged by
                    this application flows directly between your ServiceNow instance and your Salesforce
                    organization. Peeklogic does not operate any intermediary servers, and Peeklogic does not
                    have access to your data, your ServiceNow instance, or your Salesforce organization.
                </p>
            </div>

            <div className="support-section">
                <h3>What Data Is Collected</h3>
                <p className="support-description">
                    The application stores the following information within your ServiceNow instance, in
                    custom tables created and owned by this application:
                </p>
                <div className="support-checklist">
                    <div className="checklist-item">
                        <div className="checklist-icon">✓</div>
                        <div className="checklist-content">
                            <strong>Salesforce OAuth Credentials</strong>
                            <div className="checklist-value">
                                Client ID, Client Secret, Access Token, and Refresh Token for the Salesforce
                                connection you configure. These are stored per user using ServiceNow&#x2019;s
                                built-in two-way encryption (Password2 field type) and are never displayed
                                in plain text in the user interface.
                            </div>
                        </div>
                    </div>
                    <div className="checklist-item">
                        <div className="checklist-icon">✓</div>
                        <div className="checklist-content">
                            <strong>Report & Folder Definitions</strong>
                            <div className="checklist-value">
                                The reports and folders you create — their names, descriptions, selected
                                objects and fields, filters, chart settings, and folder structure.
                            </div>
                        </div>
                    </div>
                    <div className="checklist-item">
                        <div className="checklist-icon">✓</div>
                        <div className="checklist-content">
                            <strong>Sharing Settings & User Preferences</strong>
                            <div className="checklist-value">
                                Which reports and folders are shared with which users, and personal
                                preferences such as favorites.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="support-section">
                <h3>How Data Is Used</h3>
                <p className="support-description">
                    The stored OAuth credentials are used solely to authenticate with your Salesforce
                    organization on your behalf, in order to query the Salesforce data needed to render the
                    reports you configure. Report results are retrieved on demand and displayed in the user
                    interface; they are not permanently stored by this application.
                </p>
            </div>

            <div className="support-section">
                <h3>Where Data Is Transferred and Stored</h3>
                <div className="support-checklist">
                    <div className="checklist-item">
                        <div className="checklist-icon">✓</div>
                        <div className="checklist-content">
                            <strong>Storage Location</strong>
                            <div className="checklist-value">
                                All application data is stored within your own ServiceNow instance. No data
                                is stored on servers operated by Peeklogic or any third party.
                            </div>
                        </div>
                    </div>
                    <div className="checklist-item">
                        <div className="checklist-icon">✓</div>
                        <div className="checklist-content">
                            <strong>Data Transfer Destination</strong>
                            <div className="checklist-value">
                                Data is exchanged only with the Salesforce organization that you connect
                                using your own Salesforce credentials. You control which Salesforce org is
                                connected and can disconnect at any time.
                            </div>
                        </div>
                    </div>
                    <div className="checklist-item">
                        <div className="checklist-icon">✓</div>
                        <div className="checklist-content">
                            <strong>Third-Party Sharing</strong>
                            <div className="checklist-value">
                                Peeklogic does not collect, receive, or have access to any data processed by
                                this application. No data is shared with Peeklogic or any party other than
                                the Salesforce organization you configure.
                            </div>
                        </div>
                    </div>
                    <div className="checklist-item">
                        <div className="checklist-icon">✓</div>
                        <div className="checklist-content">
                            <strong>Security</strong>
                            <div className="checklist-value">
                                OAuth credentials are encrypted at rest using ServiceNow&#x2019;s native two-way
                                encryption (Password2). Access to application data is protected by ServiceNow
                                roles and access controls, and all communication with Salesforce occurs over HTTPS.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="support-section">
                <h3>Removing Your Data</h3>
                <p className="support-description">
                    Disconnecting your Salesforce connection from the Connection tab removes the stored
                    OAuth tokens from your ServiceNow instance. Reports and folders you created can be
                    deleted at any time from within the application.
                </p>
            </div>
        </div>
    );
}
