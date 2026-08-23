// Clean AI Assistant Service Interface and Architecture
export interface AIServiceQuery {
  prompt: string;
  context?: {
    classId?: string;
    studentId?: string;
    subjectCode?: string;
  };
}

export interface AIServiceResponse {
  answer: string;
  suggestedActions?: {
    label: string;
    tabTarget?: string;
    actionPayload?: any;
  }[];
  generatedExercise?: {
    title: string;
    prompt: string;
    formula: string;
    sampleTable?: any;
  };
}

export const AIService = {
  // Mock smart responses answering school queries based on real system state
  processQuery: async (query: string): Promise<AIServiceResponse> => {
    const q = query.toLowerCase();

    // 1. Attendance warning query
    if (q.includes('below 80%') || q.includes('low attendance') || q.includes('attendance warning')) {
      return {
        answer: `Based on current attendance records for August 2026, **2 students** currently have attendance below 80%:\n\n1. **SOK Sopheak** (Grade 10A) — 72% attendance (3 late arrivals, 2 unexcused absences)\n2. **LONG Rath** (Grade 10A) — 68% attendance (4 unexcused absences)\n\nRecommended Action: Send an attendance warning reminder and schedule make-up computer lab time.`,
        suggestedActions: [
          { label: 'View Attendance Sheet', tabTarget: 'attendance' },
          { label: 'View SOK Sopheak Profile', tabTarget: 'students' }
        ]
      };
    }

    // 2. Missing Excel submissions query
    if (q.includes('not submitted') || q.includes('missing') || q.includes('pending')) {
      return {
        answer: `For **Excel Exercise #03: COUNTIF & Statistical Formulas**:\n\n- **28 of 35 students** in Grade 10A have submitted their .xlsx work.\n- **7 students are still pending** submission prior to the August 25 deadline (including LONG Rath, SOK Sopheak, and TEK Pisey).\n\nAll submitted files are waiting in your grading queue.`,
        suggestedActions: [
          { label: 'Open Grading Queue', tabTarget: 'assignments' }
        ]
      };
    }

    // 3. Exercise generation query
    if (q.includes('create') && (q.includes('countif') || q.includes('exercise') || q.includes('question'))) {
      return {
        answer: `Here is a new generated practice exercise for your students:\n\n**Exercise Title**: Monthly Inventory Stock Counter\n**Objective**: Count how many inventory items have a quantity less than 10 units.\n**Formula Syntax**: \`=COUNTIF(C2:C25, "<10")\`\n\nWould you like me to push this directly into your active Assignment or Practice list?`,
        generatedExercise: {
          title: 'Monthly Inventory Stock Counter',
          prompt: 'Count how many items in column C have quantity strictly under 10.',
          formula: '=COUNTIF(C2:C25, "<10")'
        },
        suggestedActions: [
          { label: 'Add to Assignments', tabTarget: 'assignments' }
        ]
      };
    }

    // 4. Khmer explanation query
    if (q.includes('khmer') || q.includes('countifs')) {
      return {
        answer: `**ពន្យល់អំពីរូបមន្ត COUNTIFS ជាភាសាខ្មែរ (Khmer Explanation):**\n\nរូបមន្ត \`=COUNTIFS()\` ត្រូវបានប្រើប្រាស់ដើម្បី **រាប់ចំនួនក្រឡាដែលត្រូវគ្នានឹងលក្ខខណ្ឌច្រើនក្នុងពេលតែមួយ**។\n\n**ទម្រង់ទូទៅ (Syntax):**\n\`=COUNTIFS(criteria_range1, criteria1, criteria_range2, criteria2, ...)\`\n\n**ឧទាហរណ៍ជាក់ស្តែង:**\n\`=COUNTIFS(B2:B50, "Female", C2:C50, ">=80")\`\nមានន័យថា៖ រាប់ចំនួនសិស្សស្រី (Female) ណាដែលមានពិន្ទុចាប់ពី 80 ឡើងទៅ។`,
        suggestedActions: [
          { label: 'Open Formula Center', tabTarget: 'excel' }
        ]
      };
    }

    // Default summary
    return {
      answer: `**Grade 10A Monthly Performance Summary (August 2026)**:\n\n- **Average Class Score**: 84.5% (Distinction standing)\n- **Touch Typing Speed**: Class Average is 44 WPM (Top: SOK Dara at 55 WPM)\n- **Excel Mastery**: 92% pass rate on SUM & AVERAGE; COUNTIF practice underway.\n- **Overall Attendance**: 92% class average.`,
      suggestedActions: [
        { label: 'Open Reports', tabTarget: 'reports' }
      ]
    };
  }
};
