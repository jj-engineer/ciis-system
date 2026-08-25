/**
 * Professional Khmer & English Attendance PDF & Print Exporter
 * Fully supports Khmer Unicode typography (Kantumruy Pro / Khmer OS Content)
 * with official school header, statistics, student rows, and teacher signature blocks.
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
 * Uses native browser typography rasterization with Google Font 'Kantumruy Pro'
 * ensuring 100% crisp, error-free Khmer ligature and subscript rendering.
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

  const tableRowsHtml = records.map((r) => {
    const isFemale = r.gender === 'F' || r.gender === 'female' || r.gender === 'ស្រី (ស)' || r.gender === 'ស្រី';
    const sexLabel = isFemale ? 'ស្រី (F)' : 'ប្រុស (M)';
    const sexBadgeClass = isFemale ? 'sex-badge-female' : 'sex-badge-male';

    let statusText = '<span class="status-badge status-present">✓ វត្តមាន</span>';
    if (r.isAbsent) statusText = '<span class="status-badge status-absent">✗ អវត្តមាន</span>';
    else if (r.isLate) statusText = '<span class="status-badge status-late">⏰ យឺត</span>';
    else if (r.isPermission) statusText = '<span class="status-badge status-perm">📋 ច្បាប់</span>';
    else if (r.isSick) statusText = '<span class="status-badge status-sick">🏥 ឈឺ</span>';

    return `
      <tr>
        <td class="text-center font-mono">${r.no}</td>
        <td class="font-bold text-slate-900">${r.studentName}</td>
        <td class="text-center"><span class="${sexBadgeClass}">${sexLabel}</span></td>
        <td class="text-center">${r.isPresent ? '<strong class="text-emerald-700">✓</strong>' : '-'}</td>
        <td class="text-center">${r.isAbsent ? '<strong class="text-rose-700">✗</strong>' : '-'}</td>
        <td class="text-center">${r.isLate ? '<strong class="text-amber-700">⏰</strong>' : '-'}</td>
        <td class="text-center">${r.isPermission ? '<strong class="text-sky-700">📋</strong>' : '-'}</td>
        <td class="text-center">${r.isSick ? '<strong class="text-purple-700">🏥</strong>' : '-'}</td>
        <td class="text-center">${statusText}</td>
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Kantumruy+Pro:wght@400;600;700;800&family=Moul&display=swap" rel="stylesheet">
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
    .header-banner {
      background: #831843;
      color: #ffffff;
      padding: 12px 18px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 12px;
    }
    .school-title-km {
      font-family: 'Kantumruy Pro', sans-serif;
      font-size: 15px;
      font-weight: 800;
      margin: 0;
      letter-spacing: 0.3px;
    }
    .school-title-en {
      font-family: 'Inter', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      opacity: 0.9;
      margin-top: 2px;
    }
    .report-badge {
      display: inline-block;
      margin-top: 6px;
      padding: 2px 10px;
      background: rgba(255, 255, 255, 0.18);
      border-radius: 12px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      padding: 10px 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
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
    .stats-bar {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 6px;
      margin-bottom: 12px;
      text-align: center;
    }
    .stat-pill {
      padding: 6px 4px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
    }
    .stat-label {
      display: block;
      font-size: 8.5px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
    }
    .stat-val {
      font-size: 13px;
      font-weight: 900;
      margin-top: 1px;
      display: block;
    }
    .stat-present { background: #ecfdf5; border-color: #a7f3d0; color: #047857; }
    .stat-absent { background: #fff1f2; border-color: #fecdd3; color: #be123c; }
    .stat-late { background: #fffbeb; border-color: #fde68a; color: #b45309; }
    .stat-perm { background: #f0f9ff; border-color: #bae6fd; color: #0369a1; }
    .stat-sick { background: #faf5ff; border-color: #e9d5ff; color: #7e22ce; }
    .stat-rate { background: #fdf2f8; border-color: #fbcfe8; color: #9d174d; }

    table.attendance-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin-bottom: 14px;
    }
    table.attendance-table th {
      background: #831843;
      color: #ffffff;
      font-weight: 700;
      padding: 6px 6px;
      border: 1px solid #9d174d;
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

    .sex-badge-female {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 4px;
      background: #ffe4e6;
      color: #be123c;
      font-weight: 700;
      font-size: 9px;
      border: 1px solid #fecdd3;
    }
    .sex-badge-male {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 4px;
      background: #e0f2fe;
      color: #0369a1;
      font-weight: 700;
      font-size: 9px;
      border: 1px solid #bae6fd;
    }

    .status-badge {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 9px;
    }
    .status-present { background: #d1fae5; color: #065f46; }
    .status-absent { background: #ffe4e6; color: #9f1239; }
    .status-late { background: #fef3c7; color: #92400e; }
    .status-perm { background: #e0f2fe; color: #075985; }
    .status-sick { background: #f3e8ff; color: #6b21a8; }

    .table-footer-row {
      background: #f1f5f9 !important;
      font-weight: 800;
    }

    .signature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      margin-top: 18px;
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
      border-bottom: 1px dashed #64748b;
      margin-bottom: 4px;
    }
    .signature-name {
      font-weight: 800;
      color: #0f172a;
      font-size: 11px;
    }
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
      background: #831843;
      color: white;
      border: none;
      padding: 6px 14px;
      border-radius: 16px;
      font-weight: 700;
      font-size: 11px;
      cursor: pointer;
    }
    @media print {
      .print-actions { display: none !important; }
    }
  </style>
</head>
<body>

  <div class="header-banner">
    <h1 class="school-title-km">${schoolName}</h1>
    <div class="school-title-en">CIIS INTERNATIONAL SCHOOL • COMPUTER SCIENCE DEPARTMENT</div>
    <div class="report-badge">${reportTitle}</div>
  </div>

  <div class="meta-grid">
    <div class="meta-item"><strong>ថ្នាក់រៀន (Class):</strong> <span>${className}</span></div>
    <div class="meta-item"><strong>កាលបរិច្ឆេទ (Date):</strong> <span>${date}</span></div>
    <div class="meta-item"><strong>ឆ្នាំសិក្សា (Year):</strong> <span>${academicYear}</span></div>
    <div class="meta-item"><strong>គ្រូបង្រៀន (Teacher):</strong> <span>${cleanTeacher}</span></div>
    <div class="meta-item"><strong>សិស្សសរុប (Total):</strong> <span>${totalStudents} នាក់</span></div>
    <div class="meta-item"><strong>អត្រាវត្តមាន (Rate):</strong> <span>${attendanceRate}%</span></div>
  </div>

  <div class="stats-bar">
    <div class="stat-pill stat-rate">
      <span class="stat-label">អត្រាវត្តមាន</span>
      <span class="stat-val">${attendanceRate}%</span>
    </div>
    <div class="stat-pill stat-present">
      <span class="stat-label">វត្តមាន (P)</span>
      <span class="stat-val">${totalPresent}</span>
    </div>
    <div class="stat-pill stat-absent">
      <span class="stat-label">អវត្តមាន (A)</span>
      <span class="stat-val">${totalAbsent}</span>
    </div>
    <div class="stat-pill stat-late">
      <span class="stat-label">មកយឺត (L)</span>
      <span class="stat-val">${totalLate}</span>
    </div>
    <div class="stat-pill stat-perm">
      <span class="stat-label">ច្បាប់ (Perm)</span>
      <span class="stat-val">${totalPermission}</span>
    </div>
    <div class="stat-pill stat-sick">
      <span class="stat-label">ឈឺ (Sick)</span>
      <span class="stat-val">${totalSick}</span>
    </div>
  </div>

  <table class="attendance-table">
    <thead>
      <tr>
        <th style="width: 28px;">ល.រ</th>
        <th style="text-align: left; padding-left: 8px;">ឈ្មោះសិស្ស (Student Name)</th>
        <th style="width: 65px;">ភេទ (Sex)</th>
        <th style="width: 32px;" title="វត្តមាន">P</th>
        <th style="width: 32px;" title="អវត្តមាន">A</th>
        <th style="width: 32px;" title="មកយឺត">L</th>
        <th style="width: 38px;" title="ច្បាប់">Perm</th>
        <th style="width: 36px;" title="ឈឺ">Sick</th>
        <th style="width: 85px;">ស្ថានភាព</th>
      </tr>
    </thead>
    <tbody>
      ${tableRowsHtml}
      <tr class="table-footer-row">
        <td class="text-center">-</td>
        <td class="font-bold">សរុបរួម (${totalStudents} នាក់)</td>
        <td class="text-center">-</td>
        <td class="text-center text-emerald-700 font-bold">${totalPresent}</td>
        <td class="text-center text-rose-700 font-bold">${totalAbsent}</td>
        <td class="text-center text-amber-700 font-bold">${totalLate}</td>
        <td class="text-center text-sky-700 font-bold">${totalPermission}</td>
        <td class="text-center text-purple-700 font-bold">${totalSick}</td>
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
    // Trigger print dialog once loaded
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
    // Fallback: create invisible iframe to trigger print dialog if popups are blocked
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
