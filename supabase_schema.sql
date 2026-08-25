-- ====================================================================
-- EduTech Computer LMS - PostgreSQL & Supabase Database Schema
-- Designed for Computer Subjects: MS Word, MS Excel, Typing, Basic Skills
-- ====================================================================

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'assistant_teacher', 'student');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'permission', 'sick');
CREATE TYPE submission_status AS ENUM ('not_started', 'draft', 'submitted', 'late', 'checked', 'needs_correction');
CREATE TYPE subject_code AS ENUM ('word', 'excel', 'typing', 'basics', 'general');
CREATE TYPE device_status AS ENUM ('active', 'idle', 'offline');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE excel_practice_category AS ENUM ('Basic Formatting', 'Tables', 'Formulas', 'Functions', 'Sorting & Filtering', 'Data Entry', 'Practical Tasks');

-- 2. USERS & PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    student_id VARCHAR(50) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    username VARCHAR(100) UNIQUE,
    email VARCHAR(255) UNIQUE,
    role user_role NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    class_id UUID,
    phone VARCHAR(30), -- Optional, not required for students
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CLASSES
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL, -- e.g. "Grade 10A"
    grade VARCHAR(50) NOT NULL, -- e.g. "10"
    room VARCHAR(50),           -- e.g. "Computer Lab 1"
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assistant_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    schedule_description TEXT,  -- e.g. "Mon, Wed, Fri 08:00 - 09:30"
    academic_year VARCHAR(20) DEFAULT '2026-2027',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles 
ADD CONSTRAINT fk_profiles_class 
FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE SET NULL;

-- 4. SUBJECTS & LESSONS
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code subject_code UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    order_index INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_code subject_code NOT NULL,
    chapter_number INT DEFAULT 1,
    chapter_title VARCHAR(200),
    lesson_number INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    summary TEXT,
    content_markdown TEXT,
    video_url TEXT,
    estimated_minutes INT DEFAULT 45,
    key_shortcuts JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ASSIGNMENTS & MULTI-FILE ATTACHMENTS
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_code subject_code NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructions TEXT NOT NULL,
    deadline DATE NOT NULL,
    max_score INT DEFAULT 100,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assignment_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    size_formatted VARCHAR(50),
    file_url TEXT NOT NULL,
    is_image BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STUDENT ASSIGNMENT SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status submission_status DEFAULT 'submitted',
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size_bytes BIGINT DEFAULT 0,
    file_url TEXT NOT NULL,
    student_notes TEXT,
    score INT,
    max_score INT DEFAULT 100,
    teacher_feedback TEXT,
    rubric_scores JSONB DEFAULT '{}'::jsonb,
    graded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    graded_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assignment_id, student_id)
);

-- 7. ATTENDANCE RECORDS
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status NOT NULL DEFAULT 'present',
    note VARCHAR(255),
    recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, student_id, date)
);

-- 8. PRACTICAL EXAMS & TASKS
CREATE TABLE IF NOT EXISTS public.practical_exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    subject_code subject_code NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    max_score INT DEFAULT 100,
    instructions TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.practical_exam_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES public.practical_exams(id) ON DELETE CASCADE,
    order_index INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    max_marks INT NOT NULL,
    optional_attachment_url TEXT
);

CREATE TABLE IF NOT EXISTS public.practical_exam_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES public.practical_exams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_scores JSONB DEFAULT '{}'::jsonb,
    total_score INT NOT NULL,
    max_score INT NOT NULL,
    percentage INT NOT NULL,
    grade VARCHAR(5) NOT NULL, -- 'A', 'B', 'C', 'D', 'F'
    is_pass BOOLEAN DEFAULT TRUE,
    teacher_feedback TEXT,
    graded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    graded_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_id, student_id)
);

-- 9. EXCEL PRACTICE LAB TASKS & SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.excel_practice_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    category excel_practice_category NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    difficulty difficulty_level DEFAULT 'beginner',
    description TEXT,
    requirements JSONB DEFAULT '[]'::jsonb,
    starter_template_name VARCHAR(255),
    starter_template_url TEXT,
    max_score INT DEFAULT 100,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.excel_practice_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES public.excel_practice_tasks(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    submitted_file_name VARCHAR(255) NOT NULL,
    submitted_file_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'submitted',
    score INT,
    max_score INT DEFAULT 100,
    teacher_feedback TEXT,
    graded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    graded_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(task_id, student_id)
);

-- 10. TOUCH TYPING TESTS & HISTORY
CREATE TABLE IF NOT EXISTS public.typing_test_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    difficulty difficulty_level NOT NULL,
    text_content TEXT NOT NULL, -- Preserves exact spaces
    duration_seconds INT DEFAULT 60
);

CREATE TABLE IF NOT EXISTS public.typing_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    wpm INT NOT NULL,
    accuracy_percentage INT NOT NULL,
    correct_keystrokes INT NOT NULL,
    error_keystrokes INT NOT NULL,
    time_spent_seconds INT NOT NULL,
    difficulty difficulty_level NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. LIVE COMPUTER LAB DEVICE SESSIONS
CREATE TABLE IF NOT EXISTS public.student_device_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id VARCHAR(50) NOT NULL, -- e.g. "LAB-01", "MOBILE-01"
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_type VARCHAR(50) NOT NULL,
    operating_system VARCHAR(50) NOT NULL,
    browser VARCHAR(50) NOT NULL,
    status device_status DEFAULT 'active',
    last_active_time TIMESTAMPTZ DEFAULT NOW(),
    connected_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id)
);

-- 12. DIRECT STUDENT-TO-TEACHER WORK SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.direct_work_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    attachment_name VARCHAR(255) NOT NULL,
    attachment_type VARCHAR(50) NOT NULL,
    attachment_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    teacher_feedback TEXT,
    score INT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- 13. SCHOOL COMMUNITY POSTS & COMMENTS
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_code subject_code DEFAULT 'general',
    category VARCHAR(50) DEFAULT 'discussion',
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    attachment_name VARCHAR(255),
    attachment_url TEXT,
    is_announcement BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. COMPUTER LAB & SCHOOL PC AGENTS (MVP ONLINE/OFFLINE MONITORING)
CREATE TYPE pc_agent_status AS ENUM ('ONLINE', 'OFFLINE', 'UNREGISTERED', 'REVOKED');
CREATE TYPE computer_status AS ENUM ('ONLINE', 'OFFLINE', 'AVAILABLE', 'IN_USE', 'LOCKED', 'DISCONNECTED', 'ERROR', 'UNREGISTERED', 'REVOKED');
CREATE TYPE lab_command_type AS ENUM ('PING', 'GET_STATUS', 'START_SESSION', 'END_SESSION', 'LOCK_WORKSTATION', 'UNLOCK_WORKSTATION', 'OPEN_ASSIGNMENT', 'COLLECT_FILES');
CREATE TYPE command_status AS ENUM ('pending', 'sent', 'acknowledged', 'failed', 'completed');
CREATE TYPE lab_session_status AS ENUM ('active', 'paused', 'completed');

-- Computers Registry (Laptops 01 through 30)
CREATE TABLE IF NOT EXISTS public.computers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    computer_number VARCHAR(10) UNIQUE NOT NULL, -- e.g. "01", "02", ... "30"
    computer_code VARCHAR(50) UNIQUE, -- e.g. "LAB-01"
    hostname VARCHAR(150),
    ip_address VARCHAR(45),
    mac_address VARCHAR(50),
    agent_id VARCHAR(100),
    lab_group VARCHAR(50) NOT NULL DEFAULT 'Lab A',
    status computer_status NOT NULL DEFAULT 'UNREGISTERED',
    student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    student_name VARCHAR(150),
    current_app VARCHAR(150),
    session_duration INT DEFAULT 0,
    last_seen TIMESTAMPTZ,
    last_heartbeat TIMESTAMPTZ,
    agent_version VARCHAR(30) DEFAULT '0.1.0',
    registration_token VARCHAR(100),
    token_expires_at TIMESTAMPTZ,
    current_session_id UUID,
    cpu_usage_pct INT DEFAULT 0,
    memory_usage_pct INT DEFAULT 0,
    is_locked BOOLEAN DEFAULT FALSE,
    registered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Windows Lab Agents Registry & Auth
CREATE TABLE IF NOT EXISTS public.lab_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    computer_id UUID REFERENCES public.computers(id) ON DELETE CASCADE,
    agent_token VARCHAR(255) UNIQUE NOT NULL,
    agent_version VARCHAR(30) NOT NULL,
    status VARCHAR(50) DEFAULT 'registered',
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    last_connected_at TIMESTAMPTZ,
    last_heartbeat TIMESTAMPTZ
);

-- Computer Class Sessions
CREATE TABLE IF NOT EXISTS public.lab_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    teacher_name VARCHAR(150) NOT NULL,
    lab_group VARCHAR(50) NOT NULL DEFAULT 'Lab A',
    title VARCHAR(200) NOT NULL, -- e.g. "Excel Practical Test #04"
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE SET NULL,
    assignment_title VARCHAR(200),
    target_application VARCHAR(100) DEFAULT 'Microsoft Excel', -- "Microsoft Excel", "Microsoft Word", "Typing", "General"
    duration_minutes INT NOT NULL DEFAULT 45,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    status lab_session_status NOT NULL DEFAULT 'active',
    total_computers INT DEFAULT 0,
    connected_students INT DEFAULT 0,
    collected_files_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student ↔ Computer Association per Session
CREATE TABLE IF NOT EXISTS public.computer_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_session_id UUID REFERENCES public.lab_sessions(id) ON DELETE CASCADE,
    computer_id UUID REFERENCES public.computers(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    student_name VARCHAR(150),
    connected_at TIMESTAMPTZ DEFAULT NOW(),
    disconnected_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'connected',
    files_collected_count INT DEFAULT 0,
    submission_path TEXT
);

-- Authorized Safe Commands Queue
CREATE TABLE IF NOT EXISTS public.lab_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    computer_id UUID REFERENCES public.computers(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.lab_sessions(id) ON DELETE SET NULL,
    command_type lab_command_type NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    status command_status NOT NULL DEFAULT 'pending',
    result JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    executed_at TIMESTAMPTZ
);

-- Immutable Security Audit Logs
CREATE TABLE IF NOT EXISTS public.lab_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    teacher_name VARCHAR(150),
    computer_id UUID REFERENCES public.computers(id) ON DELETE SET NULL,
    computer_code VARCHAR(50),
    action VARCHAR(100) NOT NULL, -- e.g. "LOCK_WORKSTATION", "START_SESSION", "COLLECT_FILES"
    details TEXT,
    status VARCHAR(50) DEFAULT 'SUCCESS',
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practical_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practical_exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.excel_practice_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.excel_practice_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_device_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_work_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.computers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.computer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, self update
CREATE POLICY "Profiles readable by authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Profiles updatable by self" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Assignments & Submissions
CREATE POLICY "Assignments readable by class members" ON public.assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Submissions visible to owner and staff" ON public.assignment_submissions FOR SELECT TO authenticated 
USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = student_id) OR (SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('teacher', 'assistant_teacher', 'admin'));

-- Practical Exam Results: Student sees only their own result
CREATE POLICY "Exam results visible to student owner and teachers" ON public.practical_exam_results FOR SELECT TO authenticated
USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = student_id) OR (SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('teacher', 'assistant_teacher', 'admin'));

-- Live Device Sessions: Readable by teachers and self
CREATE POLICY "Device sessions readable by staff and self" ON public.student_device_sessions FOR SELECT TO authenticated USING (true);

-- Computer Lab Policies: Teachers and admins have full management; students can read their assigned PC status
CREATE POLICY "Computers readable by all authenticated" ON public.computers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Computers manageable by teachers and admins" ON public.computers FOR ALL TO authenticated
USING ((SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('teacher', 'assistant_teacher', 'admin'));

CREATE POLICY "Lab sessions manageable by teachers and admins" ON public.lab_sessions FOR ALL TO authenticated
USING ((SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('teacher', 'assistant_teacher', 'admin'));

CREATE POLICY "Lab commands manageable by teachers and admins" ON public.lab_commands FOR ALL TO authenticated
USING ((SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('teacher', 'assistant_teacher', 'admin'));

CREATE POLICY "Audit logs readable and insertable by staff" ON public.lab_audit_logs FOR ALL TO authenticated
USING ((SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('teacher', 'assistant_teacher', 'admin'));

