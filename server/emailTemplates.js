const generateSafetyReportHtml = (data) => {
    const {
        fullName, email, phone, department, issueType,
        location, date, time, title, description,
        severity, isInjured, reportedBefore, immediateAction
    } = data;

    const severityColor = severity === 'Critical' ? '#ef4444' : (severity === 'High' ? '#f59e0b' : '#10b981');
    const injuryAlert = isInjured === 'true' ? '<strong style="color: red;">YES</strong>' : 'No';
    const immediateAlert = immediateAction === 'true' ? '<strong style="color: red;">YES</strong>' : 'No';
    const reportedAlert = reportedBefore === 'true' ? 'Yes' : 'No';

    return `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background: ${severityColor}; padding: 20px; color: white; text-align: center;">
            <h2 style="margin: 0;">&#9888; Safety Issue Report</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Severity: <strong>${severity}</strong></p>
        </div>
        
        <div style="padding: 20px;">
            <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 0;">Issue Details</h3>
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Type:</strong> ${issueType || 'Unspecified'}</p>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Date of Incident:</strong> ${date} ${time ? '@ ' + time : ''}</p>
            
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin-top: 0;"><strong>Description:</strong></p>
                <p style="white-space: pre-wrap;">${description}</p>
            </div>

            <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Risk Assessment</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0;"><strong>Injury Reported:</strong></td>
                    <td style="padding: 8px 0;">${injuryAlert}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0;"><strong>Immediate Action Required:</strong></td>
                    <td style="padding: 8px 0;">${immediateAlert}</td>
                </tr>
                 <tr>
                    <td style="padding: 8px 0;"><strong>Reported Before:</strong></td>
                    <td style="padding: 8px 0;">${reportedAlert}</td>
                </tr>
            </table>

            <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 20px;">Reporter Information</h3>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Department:</strong> ${department || 'N/A'}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> ${phone}</p>
        </div>
        
        <div style="background: #f1f1f1; padding: 10px; text-align: center; font-size: 0.8rem; color: #666;">
            System Generated Report - Do Not Reply Directly
        </div>
      </div>
    `;
};

module.exports = { generateSafetyReportHtml };
