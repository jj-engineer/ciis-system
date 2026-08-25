import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface StudentAttendanceRecord {
  no: number;
  studentName: string;
  gender?: string;
  isPresent: boolean;
  isAbsent: boolean;
  isLate: boolean;
  isPermission: boolean;
  isSick: boolean;
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
 * Cleanly formats teacher names for standard PDF document generation.
 * Strips raw Khmer Unicode that causes Mojibake glyph corruption (e.g. ‡¿“ •Á‡È) in standard Helvetica font.
 */
export const formatTeacherNameForPdf = (rawName?: string): string => {
  if (!rawName) return 'Choeurn Tekchas';

  // Map known teachers to clear, professional titles
  if (/choeurn|tekchas|jame/i.test(rawName)) {
    return 'Choeurn Tekchas (Assistant Teacher)';
  }
  if (/nun|langdy/i.test(rawName)) {
    return 'Nun Langdy (Head Teacher)';
  }
  if (/ten|chandara/i.test(rawName)) {
    return 'Ten Chandara (Senior Teacher)';
  }

  // Remove Khmer script in parentheses e.g. "(ជឿន តេជៈ)" or "(នុន លាងឌី)"
  const cleaned = rawName
    .replace(/\([\u1780-\u17FF\s]+\)/g, '')
    .replace(/[\u1780-\u17FF]/g, '')
    .replace(/\(\s*\)/g, '')
    .trim();

  return cleaned || 'Teacher / CIIS Faculty';
};

/**
 * Universal text sanitizer for jsPDF standard fonts.
 * Ensures non-Latin-1 Khmer characters do not generate corrupted byte symbols.
 */
export const sanitizeForPdf = (text?: string): string => {
  if (!text) return '';
  return text
    .replace(/\([\u1780-\u17FF\s]+\)/g, '')
    .replace(/[\u1780-\u17FF]/g, '')
    .replace(/\(\s*\)/g, '')
    .trim();
};

/**
 * Downloads a professional, cleanly styled Attendance PDF document (.pdf)
 * Centered table with equal balanced margins and clean styling.
 */
export const downloadAttendancePdf = ({
  schoolName = 'សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស (CIIS)',
  reportTitle = 'Official Student Attendance Report',
  className,
  date,
  teacherName = 'Choeurn Tekchas',
  academicYear = '2026-2027',
  records
}: AttendancePdfOptions) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const totalStudents = records.length;
  const totalPresent = records.filter(r => r.isPresent).length;
  const totalAbsent = records.filter(r => r.isAbsent).length;
  const totalLate = records.filter(r => r.isLate).length;
  const totalPermission = records.filter(r => r.isPermission).length;
  const totalSick = records.filter(r => r.isSick).length;
  const attendanceRate = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 100;

  const cleanTeacher = formatTeacherNameForPdf(teacherName);
  const cleanClass = sanitizeForPdf(className) || className;
  const cleanDate = sanitizeForPdf(date) || date;
  const cleanYear = sanitizeForPdf(academicYear) || academicYear;

  // Header Banner in Dark Gradient Pink (#831843)
  doc.setFillColor(131, 24, 67);
  doc.rect(0, 0, 210, 24, 'F');

  // School Title in Banner
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('CIIS INTERNATIONAL SCHOOL', 105, 10, { align: 'center' });

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL STUDENT ATTENDANCE REPORT', 105, 17, { align: 'center' });

  // Metadata Info Box (Centered width 182mm, Margins: 14mm)
  doc.setTextColor(39, 39, 42); // Zinc-800
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Class: ${cleanClass}`, 14, 32);
  doc.text(`Date: ${cleanDate}`, 78, 32);
  doc.text(`Academic Year: ${cleanYear}`, 140, 32);

  doc.setFont('helvetica', 'normal');
  doc.text(`Teacher: ${cleanTeacher}`, 14, 38);
  doc.text(`Total Students: ${totalStudents}`, 78, 38);
  doc.text(`Attendance Rate: ${attendanceRate}%`, 140, 38);

  // Centered Divider Line
  doc.setDrawColor(228, 228, 231);
  doc.setLineWidth(0.5);
  doc.line(14, 42, 196, 42);

  // Table Body Rows
  const tableData = records.map((r) => [
    r.no.toString(),
    sanitizeForPdf(r.studentName) || r.studentName,
    r.gender || '-',
    r.isPresent ? 'P' : '-',
    r.isAbsent ? 'A' : '-',
    r.isLate ? 'L' : '-',
    r.isPermission ? 'Perm' : '-',
    r.isSick ? 'Sick' : '-'
  ]);

  // Summary Footer Row
  const summaryRow = [
    '',
    `TOTAL (${totalStudents} Students)`,
    '',
    `${totalPresent}`,
    `${totalAbsent}`,
    `${totalLate}`,
    `${totalPermission}`,
    `${totalSick}`
  ];

  // Centered AutoTable with exact 14mm margins (total width 182mm)
  autoTable(doc, {
    startY: 46,
    margin: { left: 14, right: 14 },
    tableWidth: 182,
    head: [[
      'No.',
      'Student Name',
      'Sex',
      'Present',
      'Absent',
      'Late',
      'Permission',
      'Sick Leave'
    ]],
    body: [...tableData, summaryRow],
    theme: 'grid',
    headStyles: {
      fillColor: [131, 24, 67], // Dark Pink
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 9
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { halign: 'left', fontStyle: 'bold', cellWidth: 54 },
      2: { halign: 'center', cellWidth: 16 },
      3: { halign: 'center', cellWidth: 20, textColor: [4, 120, 87], fontStyle: 'bold' }, // Emerald
      4: { halign: 'center', cellWidth: 20, textColor: [185, 28, 28], fontStyle: 'bold' }, // Red
      5: { halign: 'center', cellWidth: 20, textColor: [180, 83, 9], fontStyle: 'bold' },  // Amber
      6: { halign: 'center', cellWidth: 20, textColor: [67, 56, 202] },                    // Indigo
      7: { halign: 'center', cellWidth: 20, textColor: [147, 51, 234] }                    // Purple
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250] // Zinc-50
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2.2,
      lineColor: [228, 228, 231],
      lineWidth: 0.2
    },
    didParseCell: (data) => {
      // Style the summary footer row specially
      if (data.row.index === records.length) {
        data.cell.styles.fillColor = [244, 244, 245];
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = [9, 9, 11];
      }
    }
  });

  // Save the PDF file directly to download
  const cleanClassName = cleanClass.replace(/\s+/g, '_');
  doc.save(`Attendance_${cleanClassName}_${date}.pdf`);
};
