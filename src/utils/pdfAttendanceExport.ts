/**
 * Professional Khmer & English Attendance PDF & Print Exporter
 * Minimalist, Executive Academic Styling (Subtle Dual-Tone Slate & Monochrome)
 * Fully supports Khmer Unicode typography (Kantumruy Pro / Inter)
 * Includes day-of-the-week detection e.g. "2026-08-25 (Tuesday • ថ្ងៃអង្គារ)"
 */

export interface StudentAttendanceRecord {
  no: number;
  studentName: string;
  gender?: string;
  studentId?: string;
  isPresent: boolean;
  isAbsent: boolean;
  isLate: boolean;
  isPermission: boolean;
  isSick: boolean;
  notes?: string;
}

export interface AttendancePdfOptions {
  schoolName?: string;
  reportTitle?: string;
  className: string;
  date: string;
  teacherName?: string;
  academicYear?: string;
  records: StudentAttendanceRecord[];
}

/**
 * Formats date string with exact Day of the Week in English & Khmer e.g. "2026-08-25 (Tuesday • ថ្ងៃអង្គារ)"
 */
export const formatAttendanceDateWithDay = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      
      const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const daysKm = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
      
      const dayNameEn = daysEn[d.getDay()];
      const dayNameKm = daysKm[d.getDay()];
      return `${dateStr} (${dayNameEn} • ថ្ងៃ${dayNameKm})`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

/**
 * Formats teacher names cleanly without role suffixes like "(Assistant Teacher)".
 */
export const formatTeacherNameForPdf = (rawName?: string): string => {
  if (!rawName) return 'Choeurn Tekchas (ជឿន តេជៈ)';

  // Remove role suffixes
  let cleaned = rawName
    .replace(/\(Assistant\s*Teacher\)/gi, '')
    .replace(/\(Head\s*Teacher\)/gi, '')
    .replace(/\(Senior\s*Teacher\)/gi, '')
    .replace(/\(Lead\s*TA\)/gi, '')
    .replace(/\(Teacher\)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return cleaned || rawName;
};

/**
 * Universal print & PDF export engine with full Khmer Unicode support.
 * Minimalist, executive styling: Clean slate, crisp typography, no excessive colors.
 */
export const printAttendanceDocument = ({
  schoolName = 'សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស (CIIS)',
  reportTitle = 'តារាងស្រង់វត្តមានសិស្សផ្លូវការ (OFFICIAL STUDENT ATTENDANCE REPORT)',
  className,
  date,
  teacherName = 'Choeurn Tekchas',
  academicYear = '2026-2027',
  records
}: AttendancePdfOptions) => {
  const totalStudents = records.length;
  const totalPresent = records.filter(r => r.isPresent).length;
  const totalAbsent = records.filter(r => r.isAbsent).length;
  const totalLate = records.filter(r => r.isLate).length;
  const totalPermission = records.filter(r => r.isPermission).length;
  const totalSick = records.filter(r => r.isSick).length;
  const attendanceRate = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 100;

  const cleanTeacher = formatTeacherNameForPdf(teacherName);
  const formattedDate = formatAttendanceDateWithDay(date);

  const tableRowsHtml = records.map((r) => {
    const isFemale = r.gender === 'F' || r.gender === 'female' || r.gender === 'ស្រី (ស)' || r.gender === 'ស្រី';
    const sexLabel = isFemale ? 'ស្រី (F)' : 'ប្រុស (M)';

    let statusText = 'វត្តមាន';
    if (r.isAbsent) statusText = 'អវត្តមាន';
    else if (r.isLate) statusText = 'មកយឺត';
    else if (r.isPermission) statusText = 'ច្បាប់';
    else if (r.isSick) statusText = 'ឈឺ';

    return `
      <tr>
        <td class="text-center font-mono">${r.no}</td>
        <td class="font-bold text-slate-900">${r.studentName}</td>
        <td class="text-center text-slate-700 font-medium">${sexLabel}</td>
        <td class="text-center font-bold">${r.isPresent ? '✓' : '-'}</td>
        <td class="text-center font-bold">${r.isAbsent ? '✗' : '-'}</td>
        <td class="text-center font-bold">${r.isLate ? 'L' : '-'}</td>
        <td class="text-center font-bold">${r.isPermission ? 'P' : '-'}</td>
        <td class="text-center font-bold">${r.isSick ? 'S' : '-'}</td>
        <td class="text-center font-semibold text-slate-800">${statusText}</td>
      </tr>
    `;
  }).join('');

  const printHtml = `
<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <title>Attendance_${className.replace(/\\s+/g, '_')}_${date}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Kantumruy+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Kantumruy Pro', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      margin: 0;
      padding: 0;
      color: #0f172a;
      background: #ffffff;
      font-size: 11px;
      line-height: 1.4;
    }
    
    /* Clean Minimalist Header */
    .header-box {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 10px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .school-title-km {
      font-size: 15px;
      font-weight: 800;
      margin: 0;
      color: #0f172a;
    }
    .school-title-en {
      font-size: 10px;
      font-weight: 700;
      color: #475569;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-top: 2px;
    }
    .report-title-badge {
      font-size: 11px;
      font-weight: 800;
      color: #0f172a;
      text-align: right;
    }
    .report-sub {
      font-size: 9.5px;
      font-weight: 600;
      color: #64748b;
    }

    /* Minimalist Info Grid */
    .meta-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr 1fr;
      gap: 6px 12px;
      padding: 9px 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      margin-bottom: 12px;
      font-size: 10.5px;
    }
    .meta-item strong {
      color: #475569;
      font-weight: 700;
    }
    .meta-item span {
      color: #0f172a;
      font-weight: 800;
    }

    /* Clean Neutral Stats Bar */
    .stats-bar {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 6px;
      margin-bottom: 12px;
      text-align: center;
    }
    .stat-pill {
      padding: 6px 4px;
      border-radius: 5px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
    }
    .stat-label {
      display: block;
      font-size: 8.5px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
    }
    .stat-val {
      font-size: 13px;
      font-weight: 900;
      color: #0f172a;
      margin-top: 1px;
      display: block;
    }
    .stat-highlight {
      background: #0f172a;
      border-color: #0f172a;
    }
    .stat-highlight .stat-label {
      color: #cbd5e1;
    }
    .stat-highlight .stat-val {
      color: #ffffff;
    }

    /* Clean Academic Table */
    table.attendance-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin-bottom: 14px;
    }
    table.attendance-table th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      padding: 6px 6px;
      border: 1px solid #1e293b;
      font-size: 9.5px;
      text-align: center;
    }
    table.attendance-table td {
      padding: 5px 6px;
      border: 1px solid #cbd5e1;
      vertical-align: middle;
    }
    table.attendance-table tbody tr:nth-child(even) {
      background: #f8fafc;
    }
    .text-center { text-align: center; }
    .font-mono { font-family: 'Inter', monospace; }
    .font-bold { font-weight: 700; }

    .table-footer-row {
      background: #e2e8f0 !important;
      font-weight: 800;
    }

    /* Minimalist Signatures */
    .signature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      margin-top: 24px;
      padding-top: 10px;
      page-break-inside: avoid;
    }
    .signature-col {
      text-align: center;
    }
    .signature-title {
      font-weight: 700;
      color: #334155;
      margin-bottom: 45px;
      font-size: 10.5px;
    }
    .signature-line {
      display: inline-block;
      width: 180px;
      border-bottom: 1px solid #64748b;
      margin-bottom: 4px;
    }
    .signature-name {
      font-weight: 800;
      color: #0f172a;
      font-size: 11px;
    }

    /* Print Controls */
    .print-actions {
      position: fixed;
      bottom: 15px;
      right: 15px;
      background: #0f172a;
      padding: 8px 14px;
      border-radius: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      display: flex;
      gap: 8px;
      z-index: 9999;
    }
    .print-actions button {
      background: #ffffff;
      color: #0f172a;
      border: none;
      padding: 6px 14px;
      border-radius: 16px;
      font-weight: 800;
      font-size: 11px;
      cursor: pointer;
    }
    @media print {
      .print-actions { display: none !important; }
    }
  </style>
</head>
<body>

  <div class="header-box">
    <div>
      <h1 class="school-title-km">${schoolName}</h1>
      <div class="school-title-en">CIIS INTERNATIONAL SCHOOL • COMPUTER SCIENCE DEPARTMENT</div>
    </div>
    <div class="report-title-badge">
      ${reportTitle}
      <div class="report-sub">ACADEMIC ATTENDANCE RECORD SHEET</div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-item"><strong>កាលបរិច្ឆេទ (Date):</strong> <span>${formattedDate}</span></div>
    <div class="meta-item"><strong>ថ្នាក់រៀន (Class):</strong> <span>${className}</span></div>
    <div class="meta-item"><strong>ឆ្នាំសិក្សា (Year):</strong> <span>${academicYear}</span></div>
    <div class="meta-item"><strong>គ្រូបង្រៀន (Teacher):</strong> <span>${cleanTeacher}</span></div>
    <div class="meta-item"><strong>សិស្សសរុប (Total):</strong> <span>${totalStudents} នាក់</span></div>
    <div class="meta-item"><strong>អត្រាវត្តមាន (Rate):</strong> <span>${attendanceRate}%</span></div>
  </div>

  <div class="stats-bar">
    <div class="stat-pill stat-highlight">
      <span class="stat-label">អត្រាវត្តមាន</span>
      <span class="stat-val">${attendanceRate}%</span>
    </div>
    <div class="stat-pill">
      <span class="stat-label">វត្តមាន (P)</span>
      <span class="stat-val">${totalPresent}</span>
    </div>
    <div class="stat-pill">
      <span class="stat-label">អវត្តមាន (A)</span>
      <span class="stat-val">${totalAbsent}</span>
    </div>
    <div class="stat-pill">
      <span class="stat-label">មកយឺត (L)</span>
      <span class="stat-val">${totalLate}</span>
    </div>
    <div class="stat-pill">
      <span class="stat-label">ច្បាប់ (Perm)</span>
      <span class="stat-val">${totalPermission}</span>
    </div>
    <div class="stat-pill">
      <span class="stat-label">ឈឺ (Sick)</span>
      <span class="stat-val">${totalSick}</span>
    </div>
  </div>

  <table class="attendance-table">
    <thead>
      <tr>
        <th style="width: 28px;">ល.រ</th>
        <th style="text-align: left; padding-left: 8px;">ឈ្មោះសិស្ស (Student Name)</th>
        <th style="width: 70px;">ភេទ (Sex)</th>
        <th style="width: 32px;" title="វត្តមាន">P</th>
        <th style="width: 32px;" title="អវត្តមាន">A</th>
        <th style="width: 32px;" title="មកយឺត">L</th>
        <th style="width: 38px;" title="ច្បាប់">Perm</th>
        <th style="width: 36px;" title="ឈឺ">Sick</th>
        <th style="width: 80px;">ស្ថានភាព</th>
      </tr>
    </thead>
    <tbody>
      ${tableRowsHtml}
      <tr class="table-footer-row">
        <td class="text-center">-</td>
        <td class="font-bold">សរុបរួម (${totalStudents} នាក់)</td>
        <td class="text-center">-</td>
        <td class="text-center font-bold">${totalPresent}</td>
        <td class="text-center font-bold">${totalAbsent}</td>
        <td class="text-center font-bold">${totalLate}</td>
        <td class="text-center font-bold">${totalPermission}</td>
        <td class="text-center font-bold">${totalSick}</td>
        <td class="text-center font-bold text-slate-900">${attendanceRate}% វត្តមាន</td>
      </tr>
    </tbody>
  </table>

  <div class="signature-grid">
    <div class="signature-col">
      <div class="signature-title">បានឃើញ និងឯកភាពដោយ គណៈគ្រប់គ្រងសាលា</div>
      <div class="signature-line"></div>
      <div class="signature-name">នាយកសាលា / School Director</div>
    </div>
    <div class="signature-col">
      <div class="signature-title">គ្រូទទួលបន្ទុកថ្នាក់ / Subject Instructor</div>
      <div class="signature-line"></div>
      <div class="signature-name">${cleanTeacher}</div>
    </div>
  </div>

  <div class="print-actions">
    <button onclick="window.print()">🖨️ បោះពុម្ព / រក្សាទុកជា PDF</button>
  </div>

  <script>
    // Auto-trigger print dialog once loaded
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 350);
    });
  </script>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank', 'width=950,height=900,menubar=no,toolbar=no,location=no');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(printHtml);
    printWindow.document.close();
  } else {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(printHtml);
      frameDoc.close();
      setTimeout(() => {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
        setTimeout(() => document.body.removeChild(printFrame), 2000);
      }, 500);
    }
  }
};

/**
 * Main export function - invokes the high-fidelity Khmer-enabled print & PDF engine.
 */
export const downloadAttendancePdf = (options: AttendancePdfOptions) => {
  printAttendanceDocument(options);
};
