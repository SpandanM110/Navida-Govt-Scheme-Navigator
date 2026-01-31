/**
 * Export session report as PDF via browser print (Save as PDF).
 * No server storage - purely client-side. User chooses "Save as PDF" in print dialog.
 */

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+\s*/gm, "")
    .trim();
}

interface ExportReportOptions {
  schemeContext?: string | null;
  messages: { role: string; content: string }[];
  profile?: Record<string, unknown> | null;
  urls?: string[];
  language?: string;
}

export function exportReportAsPdf(options: ExportReportOptions): void {
  const { schemeContext, messages, profile, urls = [], language = "en" } = options;

  const isHi = language === "hi";
  const title = isHi ? "नविदा योजना रिपोर्ट" : "Navida Scheme Report";
  const dateLabel = isHi ? "तारीख" : "Date";
  const guidanceLabel = isHi ? "योजना मार्गदर्शन" : "Scheme Guidance";
  const chatLabel = isHi ? "चैट संवाद" : "Chat Transcript";
  const userLabel = isHi ? "आप" : "You";
  const assistantLabel = isHi ? "नविदा" : "Navida";
  const sourcesLabel = isHi ? "स्रोत लिंक" : "Source Links";
  const profileLabel = isHi ? "प्रोफ़ाइल" : "Profile";

  const dateStr = new Date().toLocaleString(language === "hi" ? "hi-IN" : "en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  let html = `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 24px; color: #1a1a1a; line-height: 1.6; }
    h1 { font-size: 1.5rem; margin-bottom: 4px; color: #0f172a; }
    .meta { font-size: 0.85rem; color: #64748b; margin-bottom: 24px; }
    h2 { font-size: 1.1rem; margin-top: 24px; margin-bottom: 8px; color: #334155; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    .guidance { white-space: pre-wrap; background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px; font-size: 0.9rem; }
    .profile { font-size: 0.85rem; color: #475569; margin-bottom: 16px; }
    .message { margin-bottom: 12px; padding: 10px 14px; border-radius: 8px; }
    .message.user { background: #eff6ff; margin-left: 24px; border-left: 3px solid #3b82f6; }
    .message.assistant { background: #f0fdf4; margin-right: 24px; border-left: 3px solid #22c55e; }
    .message-role { font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 4px; }
    .message-content { white-space: pre-wrap; font-size: 0.9rem; }
    .urls { margin-top: 16px; }
    .urls a { display: block; color: #2563eb; text-decoration: none; font-size: 0.85rem; margin-bottom: 4px; }
    .urls a:hover { text-decoration: underline; }
    @media print { body { padding: 16px; } .message { break-inside: avoid; } }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p class="meta">${dateLabel}: ${dateStr}</p>
`;

  if (profile && Object.keys(profile).length > 0) {
    const profileLines = Object.entries(profile)
      .filter(([, v]) => v != null && v !== "")
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    html += `  <h2>${profileLabel}</h2><p class="profile">${profileLines}</p>\n`;
  }

  if (schemeContext && schemeContext.trim()) {
    html += `  <h2>${guidanceLabel}</h2>\n  <div class="guidance">${stripMarkdown(schemeContext).replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>\n`;
  }

  if (messages.length > 0) {
    html += `  <h2>${chatLabel}</h2>\n`;
    for (const m of messages) {
      const roleLabel = m.role === "user" ? userLabel : assistantLabel;
      const content = stripMarkdown(m.content).replace(/</g, "&lt;").replace(/>/g, "&gt;");
      html += `  <div class="message ${m.role}"><div class="message-role">${roleLabel}</div><div class="message-content">${content}</div></div>\n`;
    }
  }

  if (urls.length > 0) {
    html += `  <h2>${sourcesLabel}</h2>\n  <div class="urls">\n`;
    for (const u of urls.slice(0, 10)) {
      html += `    <a href="${u.replace(/"/g, "&quot;")}">${u}</a>\n`;
    }
    html += `  </div>\n`;
  }

  html += `
  <p class="meta" style="margin-top: 32px;">Navida - Government Scheme Navigator</p>
</body>
</html>`;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("Popup blocked. Please allow popups to export the report.");
  }
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.onload = () => {
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  };
}
