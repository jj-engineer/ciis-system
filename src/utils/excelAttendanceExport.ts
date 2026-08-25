/**
 * Professional Excel Attendance Exporter
 * Generates beautifully styled tabular Excel spreadsheets (.xls / HTML table format)
 * with school letterhead, statistics, student rows, and official signature blocks.
 */

export interface AttendanceExportItem {
  no: number;
  studentId: string;
  fullName: string;
  gender: string;
  className: string;
  status: 'present' | 'absent' | 'late' | 'permission' | 'sick' | string;
  attendanceRate: number | string;
  notes?: string;
  standing?: string;
}

export interface ExportAttendanceOptions {
  schoolName?: string;
  reportTitle?: string;
  className: string;
  date: string;
  teacherName: string;
  academicYear?: string;
  items: AttendanceExportItem[];
  format?: 'excel_table' | 'csv';
}

export const formatExcelDateWithDay = (dateStr: string): string => {
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

export const downloadProfessionalAttendanceExcel = ({
  schoolName = 'សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស (CIIS)',
  reportTitle = 'OFFICIAL STUDENT ATTENDANCE RECORD SHEET',
  className,
  date,
  teacherName,
  academicYear = '2026-2027',
  items,
  format = 'excel_table'
}: ExportAttendanceOptions) => {
  const total = items.length || 1;
  const presentCount = items.filter(i => i.status.toLowerCase().includes('present') || i.status === 'វត្តមាន (មក)').length;
  const absentCount = items.filter(i => i.status.toLowerCase().includes('absent') || i.status === 'អវត្តមាន (ឈប់)').length;
  const lateCount = items.filter(i => i.status.toLowerCase().includes('late') || i.status === 'មកយឺត').length;
  const permCount = items.filter(i => i.status.toLowerCase().includes('permission') || i.status.toLowerCase().includes('sick') || i.status === 'សុំច្បាប់').length;
  const overallRate = Math.round((presentCount / total) * 100);
  const formattedDate = formatExcelDateWithDay(date);

  if (format === 'csv') {
    // Standard UTF-8 CSV with BOM for Khmer/English
    const headers = [
      'No.',
      'Student ID',
      'Full Name',
      'Gender',
      'Class',
      'Date',
      'Attendance Status',
      'Attendance Rate',
      'Standing',
      'Notes'
    ];

    const rows = items.map((item) => [
      item.no,
      `"${item.studentId}"`,
      `"${item.fullName}"`,
      `"${item.gender || 'M/F'}"`,
      `"${item.className}"`,
      `"${formattedDate}"`,
      `"${item.status}"`,
      `"${item.attendanceRate}%"`,
      `"${item.standing || (Number(item.attendanceRate) >= 80 ? 'Good Standing' : 'Needs Attention')}"`,
      `"${item.notes || ''}"`
    ]);

    const csvContent = '\uFEFF' + [
      `# ${schoolName} - ${reportTitle}`,
      `# CLASS: ${className} | DATE: ${formattedDate} | ACADEMIC YEAR: ${academicYear} | INSTRUCTOR: ${teacherName}`,
      `# SUMMARY: Total Students: ${total} | Present: ${presentCount} (${overallRate}%) | Absent: ${absentCount} | Late: ${lateCount} | Permission: ${permCount}`,
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Official_Attendance_${className.replace(/\s+/g, '_')}_${date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Professional Styled Excel Worksheet (HTML / XML format with Dark Pink SaaS branding)
  const excelHtml = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!--[if gte mso 9]>
    <xml>
      <x:ExcelWorkbook>
        <x:ExcelWorksheets>
          <x:ExcelWorksheet>
            <x:Name>Attendance_${className}</x:Name>
            <x:WorksheetOptions>
              <x:DisplayGridlines/>
            </x:WorksheetOptions>
          </x:ExcelWorksheet>
        </x:ExcelWorksheets>
      </x:ExcelWorkbook>
    </xml>
    <![endif]-->
    <style>
      body { font-family: 'Segoe UI', 'Khmer OS Content', 'Arial', sans-serif; }
      table { border-collapse: collapse; width: 100%; }
      th { background-color: #9d174d; color: #ffffff; font-weight: bold; border: 1px solid #700c34; padding: 10px 8px; text-align: center; font-size: 11pt; }
      td { border: 1px solid #cbd5e1; padding: 8px; font-size: 10pt; vertical-align: middle; }
      .text-center { text-align: center; }
      .text-left { text-align: left; }
      .text-right { text-align: right; }
      .font-bold { font-weight: bold; }
      .bg-pink { background-color: #fdf2f8; color: #831843; font-weight: bold; }
      .bg-green { background-color: #ecfdf5; color: #065f46; font-weight: bold; }
      .bg-red { background-color: #fef2f2; color: #991b1b; font-weight: bold; }
      .bg-amber { background-color: #fffbeb; color: #92400e; font-weight: bold; }
      .header-title { font-size: 16pt; font-weight: bold; color: #831843; text-align: center; }
      .header-sub { font-size: 11pt; color: #475569; text-align: center; }
      .summary-box { background-color: #f8fafc; border: 1.5px solid #cbd5e1; padding: 8px; }
      .signature-title { font-weight: bold; font-size: 11pt; color: #1e293b; text-align: center; padding-top: 25px; }
    </style>
  </head>
  <body>
    <table>
      <!-- KINGDOM OF CAMBODIA EMBLEM HEADER -->
      <tr>
        <td colspan="9" style="text-align: center; font-weight: bold; font-size: 12pt; color: #0f172a; padding: 5px;">
          ព្រះរាជាណាចក្រកម្ពុជា • ជាតិ សាសនា ព្រះមហាក្សត្រ<br/>
          KINGDOM OF CAMBODIA • NATION RELIGION KING
        </td>
      </tr>
      <tr><td colspan="9" style="height: 10px; border: none;"></td></tr>
      <tr>
        <td colspan="9" class="header-title" style="border: none;">
          ${schoolName.toUpperCase()}
        </td>
      </tr>
      <tr>
        <td colspan="9" class="header-sub" style="border: none; font-weight: bold; font-size: 13pt; color: #9d174d;">
          ${reportTitle} (តារាងស្រង់វត្តមានសិស្សផ្លូវការ)
        </td>
      </tr>
      <tr>
        <td colspan="9" class="header-sub" style="border: none; padding-bottom: 12px;">
          ថ្នាក់រៀន (Class): <b>${className}</b> | ឆ្នាំសិក្សា (Academic Year): <b>${academicYear}</b> | កាលបរិច្ឆេទ (Date): <b>${date}</b> | គ្រូទទួលបន្ទុក (Teacher): <b>${teacherName}</b>
        </td>
      </tr>

      <!-- METRIC SUMMARY ROW IN EXCEL -->
      <tr style="background-color: #f1f5f9; font-weight: bold;">
        <td colspan="2" class="text-center">សិស្សសរុប (Total): ${total}</td>
        <td colspan="2" class="text-center" style="color: #047857;">វត្តមាន (Present): ${presentCount} (${overallRate}%)</td>
        <td colspan="2" class="text-center" style="color: #b91c1c;">អវត្តមាន (Absent): ${absentCount}</td>
        <td colspan="2" class="text-center" style="color: #b45309;">មកយឺត (Late): ${lateCount}</td>
        <td class="text-center" style="color: #4338ca;">សុំច្បាប់ (Perm): ${permCount}</td>
      </tr>

      <tr><td colspan="9" style="height: 10px; border: none;"></td></tr>

      <!-- MAIN ATTENDANCE TABLE HEADERS -->
      <thead>
        <tr>
          <th style="width: 50px;">ល.រ<br/>(No.)</th>
          <th style="width: 120px;">អត្តលេខសិស្ស<br/>(Student ID)</th>
          <th style="width: 220px;">គោត្តនាម និងនាម<br/>(Full Name)</th>
          <th style="width: 70px;">ភេទ<br/>(Gender)</th>
          <th style="width: 110px;">ថ្នាក់រៀន<br/>(Class)</th>
          <th style="width: 140px;">ស្ថានភាពវត្តមាន<br/>(Attendance)</th>
          <th style="width: 110px;">អត្រាវត្តមាន<br/>(Rate %)</th>
          <th style="width: 160px;">ស្ថានភាពផ្លូវការ<br/>(Standing)</th>
          <th style="width: 200px;">កំណត់ចំណាំ / មូលហេតុ<br/>(Notes / Remarks)</th>
        </tr>
      </thead>

      <!-- STUDENT DATA ROWS -->
      <tbody>
        ${items.map((item, idx) => {
          const statusLower = item.status.toLowerCase();
          let statusStyle = 'bg-green';
          let statusText = 'វត្តមាន (Present)';

          if (statusLower.includes('absent') || statusLower.includes('អវត្តមាន')) {
            statusStyle = 'bg-red';
            statusText = 'អវត្តមាន (Absent)';
          } else if (statusLower.includes('late') || statusLower.includes('យឺត')) {
            statusStyle = 'bg-amber';
            statusText = 'មកយឺត (Late)';
          } else if (statusLower.includes('perm') || statusLower.includes('sick') || statusLower.includes('ច្បាប់')) {
            statusStyle = 'bg-pink';
            statusText = 'សុំច្បាប់ (Permission)';
          }

          const rateNum = Number(item.attendanceRate) || 95;
          const standingText = rateNum >= 80 ? 'ទៀងទាត់ (Good Standing)' : 'ខ្វះវត្តមាន (Warning <80%)';
          const standingStyle = rateNum >= 80 ? 'color: #047857; font-weight: bold;' : 'color: #b91c1c; font-weight: bold;';

          return `
            <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
              <td class="text-center font-bold">${item.no}</td>
              <td class="text-center font-bold" style="font-family: monospace;">${item.studentId}</td>
              <td class="text-left font-bold" style="padding-left: 10px;">${item.fullName}</td>
              <td class="text-center">${item.gender || 'M/F'}</td>
              <td class="text-center">${item.className}</td>
              <td class="text-center ${statusStyle}">${statusText}</td>
              <td class="text-center font-bold">${rateNum}%</td>
              <td class="text-center" style="${standingStyle}">${standingText}</td>
              <td class="text-left" style="color: #64748b;">${item.notes || '-'}</td>
            </tr>
          `;
        }).join('')}
      </tbody>

      <!-- FOOTER SUMMARY ROW -->
      <tfoot>
        <tr style="background-color: #f1f5f9; font-weight: bold; border-top: 2px solid #94a3b8;">
          <td colspan="5" class="text-right" style="padding-right: 15px;">អត្រាវត្តមានមធ្យមរួមរបស់ថ្នាក់ (Overall Class Average):</td>
          <td colspan="2" class="text-center font-bold" style="color: #9d174d; font-size: 11pt;">${overallRate}%</td>
          <td colspan="2" class="text-center" style="color: #047857;">${overallRate >= 80 ? 'ឆ្លងកាត់ការវាយតម្លៃ (PASSED)' : 'ត្រូវការពិនិត្យ (NEEDS REVIEW)'}</td>
        </tr>
      </tfoot>
    </table>
  </body>
  </html>
  `;

  const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Official_Attendance_Sheet_${className.replace(/\s+/g, '_')}_${date}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
