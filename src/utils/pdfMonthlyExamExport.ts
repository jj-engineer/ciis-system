/**
 * Official Monthly Examination Result Sheet PDF & Print Exporter
 * Replicates the CIIS School July Computer Exam Sheet with full Khmer & English support
 */

import { MonthlyExam, MonthlyExamStudentScore } from '../types';

export interface MonthlyExamPdfOptions {
  schoolNameKhmer?: string;
  schoolNameEnglish?: string;
  centerTitle?: string;
  reportTitle?: string;
  subject?: string;
  shift?: string;
  dateStr?: string;
  teacherName?: string;
  directorName?: string;
  records: MonthlyExamStudentScore[];
}

export const downloadMonthlyExamPdf = (options: MonthlyExamPdfOptions) => {
  const {
    schoolNameKhmer = 'សាលារៀនស៊ី អាយ អាយ អេស',
    schoolNameEnglish = 'COMMUNITY INTERNAL INSPIRATION SCHOOL',
    centerTitle = 'SHORT COURSES AND FOREIGN LANGUAGES TRAINING CENTER',
    reportTitle = 'Result for July',
    subject = 'Computer',
    shift = 'Shift Evening 5:30-6:30',
    dateStr = 'CIIS, Date: Friday, July 31, 2026',
    teacherName = 'NUN LANGDY',
    directorName = 'ផល ស្រីណាខ',
    records = []
  } = options;

  // Build an isolated print window with exact styling matching the official paper document
  const printWindow = window.open('', '_blank', 'width=900,height=1100');
  if (!printWindow) {
    alert('Please allow popups to print/export the official examination document.');
    return;
  }

  const rowsHtml = records.map((r, idx) => {
    const isEven = idx % 2 === 1;
    const isFemale = r.gender === 'female' || r.gender === 'ស';
    const sexChar = isFemale ? 'ស' : 'ប';
    const mentionClass = 
      r.mention === 'A' || r.mention === 'B' 
        ? 'font-bold text-zinc-900' 
        : r.mention === 'F' 
        ? 'font-bold text-rose-700' 
        : 'text-zinc-800';

    return `
      <tr style="background-color: ${isEven ? '#fafafa' : '#ffffff'}; text-align: center; font-size: 11px;">
        <td style="border: 1px solid #18181b; padding: 4px 6px; font-weight: bold;">${r.no || idx + 1}</td>
        <td style="border: 1px solid #18181b; padding: 4px 8px; text-align: left; font-weight: bold; font-family: 'Kantumruy Pro', 'Khmer OS Siemreap', sans-serif;">${r.studentName}</td>
        <td style="border: 1px solid #18181b; padding: 4px 6px; font-weight: bold;">${sexChar}</td>
        <td style="border: 1px solid #18181b; padding: 4px 6px;">${r.attendance}</td>
        <td style="border: 1px solid #18181b; padding: 4px 6px; font-weight: 600;">${r.typing}</td>
        <td style="border: 1px solid #18181b; padding: 4px 6px;">${r.quiz}</td>
        <td style="border: 1px solid #18181b; padding: 4px 6px;">${r.monthlyTest}</td>
        <td style="border: 1px solid #18181b; padding: 4px 6px; font-weight: bold;">${r.total}</td>
        <td style="border: 1px solid #18181b; padding: 4px 6px; font-weight: bold;">${typeof r.average === 'number' ? r.average.toFixed(2) : r.average}</td>
        <td style="border: 1px solid #18181b; padding: 4px 6px; font-weight: bold;">${r.rank}</td>
        <td style="border: 1px solid #18181b; padding: 4px 6px; font-weight: bold;" class="${mentionClass}">${r.mention}</td>
        <td style="border: 1px solid #18181b; padding: 4px 6px; text-align: left; font-size: 10px; color: #3f3f46;">${r.other || ''}</td>
      </tr>
    `;
  }).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="km">
    <head>
      <meta charset="UTF-8">
      <title>${reportTitle} - ${subject} (${shift})</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Kantumruy+Pro:wght@400;600;700;800&family=Moul&family=Siemreap&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4 portrait;
          margin: 12mm 15mm;
        }
        body {
          font-family: 'Inter', 'Kantumruy Pro', sans-serif;
          color: #09090b;
          margin: 0;
          padding: 0;
          background: #ffffff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .sheet-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 10px;
        }
        .header-logo-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid #18181b;
          padding-bottom: 8px;
          margin-bottom: 12px;
        }
        .logo-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-img {
          width: 46px;
          height: 46px;
          object-contain: contain;
        }
        .school-names h2 {
          margin: 0;
          font-size: 14px;
          font-family: 'Moul', 'Kantumruy Pro', cursive;
          color: #09090b;
          letter-spacing: 0.5px;
        }
        .school-names p {
          margin: 1px 0 0 0;
          font-size: 10px;
          font-weight: 800;
          color: #3f3f46;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .center-tag {
          font-size: 9px;
          font-weight: 800;
          color: #18181b;
          background: #f4f4f5;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #e4e4e7;
          text-transform: uppercase;
        }
        .title-block {
          text-align: center;
          margin-bottom: 12px;
        }
        .title-block h1 {
          margin: 0;
          font-size: 18px;
          font-weight: 900;
          color: #09090b;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .title-block .subj {
          margin: 3px 0 0 0;
          font-size: 14px;
          font-weight: 800;
          color: #18181b;
        }
        .title-block .shift {
          margin: 2px 0 0 0;
          font-size: 12px;
          font-weight: 700;
          color: #3f3f46;
        }
        table.exam-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          border: 1.5px solid #18181b;
        }
        table.exam-table th {
          background-color: #f4f4f5;
          border: 1px solid #18181b;
          padding: 6px 4px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          color: #09090b;
          text-align: center;
        }
        .footer-date {
          text-align: right;
          font-size: 11px;
          font-weight: 700;
          margin-top: 14px;
          color: #18181b;
        }
        .signature-row {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          padding: 0 20px;
        }
        .sig-block {
          text-align: center;
          width: 220px;
        }
        .sig-block .role {
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 45px;
          color: #18181b;
        }
        .sig-block .name {
          font-size: 12px;
          font-weight: 900;
          font-family: 'Kantumruy Pro', 'Inter', sans-serif;
          color: #09090b;
          border-top: 1px dashed #71717a;
          padding-top: 4px;
        }
        .stamp-badge {
          display: inline-block;
          border: 1.5px solid #09090b;
          padding: 2px 6px;
          font-size: 9px;
          font-weight: 800;
          border-radius: 4px;
          margin-bottom: 4px;
          background: #fafafa;
        }
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="sheet-container">
        
        <!-- Header -->
        <div class="header-logo-row">
          <div class="logo-left">
            <div style="font-weight: 900; font-size: 20px; background: #18181b; color: #fff; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
              CIIS
            </div>
            <div class="school-names">
              <h2>${schoolNameKhmer}</h2>
              <p>${schoolNameEnglish}</p>
            </div>
          </div>
          <div class="center-tag">
            ${centerTitle}
          </div>
        </div>

        <!-- Title Block -->
        <div class="title-block">
          <h1>${reportTitle}</h1>
          <p class="subj">${subject}</p>
          <p class="shift">${shift}</p>
        </div>

        <!-- Table -->
        <table class="exam-table">
          <thead>
            <tr>
              <th style="width: 28px;">Nº</th>
              <th style="text-align: left; padding-left: 8px; width: 140px;">NAME</th>
              <th style="width: 32px;">Sex</th>
              <th style="width: 58px;">Attendance</th>
              <th style="width: 48px;">Typing</th>
              <th style="width: 45px;">Quiz</th>
              <th style="width: 70px;">Monthly test</th>
              <th style="width: 45px;">Total</th>
              <th style="width: 52px;">Average</th>
              <th style="width: 40px;">Rank</th>
              <th style="width: 50px;">Mention</th>
              <th>Other</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <!-- Date -->
        <div class="footer-date">
          ${dateStr}
        </div>

        <!-- Signatures -->
        <div class="signature-row">
          <div class="sig-block">
            <div class="stamp-badge">Seen and Approved</div>
            <div class="role">Director</div>
            <div class="name">${directorName}</div>
          </div>

          <div class="sig-block">
            <div class="role">Class Teacher</div>
            <div class="name">${teacherName}</div>
          </div>
        </div>

      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 400);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
