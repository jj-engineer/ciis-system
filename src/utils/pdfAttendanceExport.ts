import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface StudentAttendanceRecord {
  no: number;
  studentName: string;
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
 * Downloads a professional, cleanly styled Attendance PDF document (.pdf)
 * Centered table with equal balanced margins and clean styling.
 */
export const downloadAttendancePdf = ({
  schoolName = 'COMMUNITY INTERNAL INSPIRATION SCHOOL (CIIS)',
  reportTitle = 'Official Student Attendance Report',
  className,
  date,
  teacherName = 'Nun Langdy (នុន លាងឌី)',
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

  // Header Banner in Dark Gradient Pink (#831843)
  doc.setFillColor(131, 24, 67);
  doc.rect(0, 0, 210, 24, 'F');

  // School Title in Banner
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('COMMUNITY INTERNAL INSPIRATION SCHOOL (CIIS)', 105, 10, { align: 'center' });

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL STUDENT ATTENDANCE REPORT', 105, 17, { align: 'center' });

  // Metadata Info Box (Centered width 182mm, Margins: 14mm)
  doc.setTextColor(39, 39, 42); // Zinc-800
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Class: ${className}`, 14, 32);
  doc.text(`Date: ${date}`, 78, 32);
  doc.text(`Academic Year: ${academicYear}`, 140, 32);

  doc.setFont('helvetica', 'normal');
  doc.text(`Teacher: ${teacherName}`, 14, 38);
  doc.text(`Total Students: ${totalStudents}`, 78, 38);
  doc.text(`Attendance Rate: ${attendanceRate}%`, 140, 38);

  // Centered Divider Line
  doc.setDrawColor(228, 228, 231);
  doc.setLineWidth(0.5);
  doc.line(14, 42, 196, 42);

  // Table Body Rows
  const tableData = records.map((r) => [
    r.no.toString(),
    r.studentName,
    r.isPresent ? 'P' : '-',
    r.isAbsent ? 'A' : '-',
    r.isLate ? 'L' : '-',
    r.isPermission ? 'Perm' : '-',
    r.isSick ? 'Sick' : '-'
  ]);

  // Summary Footer Row
  const summaryRow = [
    '',
    `TOTAL SUMMARY (${totalStudents} Students)`,
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
      1: { halign: 'left', fontStyle: 'bold', cellWidth: 60 },
      2: { halign: 'center', cellWidth: 22, textColor: [4, 120, 87], fontStyle: 'bold' }, // Emerald
      3: { halign: 'center', cellWidth: 22, textColor: [185, 28, 28], fontStyle: 'bold' }, // Red
      4: { halign: 'center', cellWidth: 22, textColor: [180, 83, 9], fontStyle: 'bold' },  // Amber
      5: { halign: 'center', cellWidth: 22, textColor: [67, 56, 202] },                    // Indigo
      6: { halign: 'center', cellWidth: 22, textColor: [147, 51, 234] }                    // Purple
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
  const cleanClassName = className.replace(/\s+/g, '_');
  doc.save(`Attendance_${cleanClassName}_${date}.pdf`);
};
