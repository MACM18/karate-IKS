# Student Dashboard Enhancement Plan

## 🎯 Core Philosophy

Transform the student dashboard into a **gamified progression system** that motivates students through clear visualization of their martial arts journey.

---

## 📊 Dashboard Sections

### 1. **Hero Section** ✅ (Already Implemented)

- Profile photo with dynamic belt border color
- Name display with rank
- "Report for Duty" attendance button
- Current rank badge

### 2. **Belt Progress Arc** (Enhanced)

**Features:**

- Visual circular/arc progress indicator
- Shows current rank → next rank journey
- Percentage complete based on curriculum mastery
- Time since last promotion
- Estimated time to next rank (based on average progression)

**Data Required:**

- Current rank order
- Next rank requirements
- Completed curriculum items
- Training frequency

### 3. **Curriculum Mastery Board** (NEW - Priority 1)

**Display student's current curriculum requirements:**

- **Kata Section**: List of kata required for next rank
  - Checkmarks for mastered kata
  - "In Progress" status for practicing kata
  - Video reference links (optional)
- **Techniques (Kihon)**: Basic techniques checklist
  - Strikes (Tsuki, Uchi)
  - Blocks (Uke)
  - Kicks (Geri)
  - Stances (Dachi)
- **Kumite Requirements**: Sparring competencies

  - 3-step sparring
  - 1-step sparring
  - Free sparring readiness

- **Physical Requirements**: Fitness benchmarks
  - Push-ups count
  - Flexibility tests
  - Endurance markers

**Implementation:**

- Instructor can mark items as "completed" from admin
- Student sees real-time progress
- Visual progress bars per category

### 4. **Training Analytics** (Enhanced)

- **Monthly Training Heat Map**: Calendar view showing attendance patterns
- **Class Frequency Chart**: Bar chart of last 6 months
- **Streak Tracker**: Current consecutive training days
- **Total Training Hours**: Calculated from attendance
- **Comparison**: "You've trained X% more than average this month"

### 5. **Achievement Showcase** ✅ (Already Basic - Enhance)

- Display recent achievements with icons
- Tournament placements
- Skill certifications
- Special recognitions
- **New**: Badge collection system (visual icons for milestones)

### 6. **Upcoming Events & Exams** ✅ (Already Implemented)

- Active exam applications
- Upcoming gradings
- Seminar notifications
- Tournament schedules

### 7. **Quick Action Cards** (NEW)

- "Book Private Lesson" (if enabled)
- "View Training Resources" → Links to rank-specific content
- "Submit Video for Review" (upload kata videos)
- "Track Goals" → Personal goal setting

### 8. **Sensei Feedback Panel** (NEW - Optional)

- Latest comments from instructor
- Areas to improve
- Strengths highlighted
- Next focus areas

---

## 🛠️ Admin Dashboard - Curriculum Management

### **New Admin Section: `/admin/curriculum`**

#### **1. Curriculum Definition by Rank**

**Page: `/admin/curriculum/ranks`**

- View all ranks
- Click a rank to define its requirements
- Form fields:
  - **Kata List**: Multi-input for kata names
  - **Techniques**: Checkboxes or multi-select for kihon
  - **Kumite Requirements**: Text area for sparring notes
  - **Physical Standards**: Input fields for numeric requirements
  - **Minimum Training Days**: Number input
  - **Knowledge Requirements**: Text area (dojo etiquette, history, etc.)

**Database Schema Addition:**

```prisma
model CurriculumItem {
  id          String   @id @default(cuid())
  rankId      String
  category    String   // "KATA", "TECHNIQUE", "KUMITE", "PHYSICAL", "KNOWLEDGE"
  itemName    String
  description String?
  order       Int      @default(0)
  isRequired  Boolean  @default(true)
  videoUrl    String?  // Optional reference video
  createdAt   DateTime @default(now())

  rank        Rank     @relation(fields: [rankId], references: [id], onDelete: Cascade)
  progress    StudentCurriculumProgress[]
}

model StudentCurriculumProgress {
  id              String         @id @default(cuid())
  studentId       String
  curriculumId    String
  status          String         @default("NOT_STARTED") // "NOT_STARTED", "IN_PROGRESS", "MASTERED"
  completedAt     DateTime?
  instructorNotes String?

  student         StudentProfile @relation(fields: [studentId], references: [id], onDelete: Cascade)
  curriculum      CurriculumItem @relation(fields: [curriculumId], references: [id], onDelete: Cascade)

  @@unique([studentId, curriculumId])
}
```

#### **2. Student Progress Tracking**

**Page: `/admin/curriculum/students`**

- Search/filter students by rank
- Click a student to view their curriculum progress
- For each curriculum item:
  - Mark as "Not Started", "In Progress", "Mastered"
  - Add instructor notes
  - Set completion date
- Bulk actions: "Mark all basic techniques as mastered"

#### **3. Curriculum Progress Reports**

**Page: `/admin/curriculum/reports`**

- View overall class progress on curriculum
- Identify students ready for promotion
- Filter by rank, category, completion status
- Export reports (CSV)

#### **4. Rank Promotion Workflow**

**Enhanced: `/admin/promotions`**

- View promotion-ready students (those who completed all curriculum items)
- Approve/schedule promotion
- Auto-update rank + create StudentPromotion record
- Send notification to student

---

## 🎨 UI/UX Enhancements

### **Student Dashboard:**

- **Dark Theme with Belt Color Accents**: Use current rank's colorCode as primary accent
- **Animations**: Framer Motion for progress updates
- **Responsive Grid**: Mobile-first design
- **Interactive Charts**: Recharts or Chart.js for analytics

### **Admin Dashboard:**

- **Drag-and-Drop Curriculum Builder**: Reorder curriculum items
- **Inline Editing**: Quick updates without full page reloads
- **Batch Operations**: Select multiple students to update progress
- **Visual Progress Indicators**: Color-coded badges (red=not started, yellow=in progress, green=mastered)

---

## 📈 Gamification Features

### **Point System** (Optional - Advanced)

- Award points for:
  - Attendance (e.g., 10 points per class)
  - Curriculum completion (50 points per kata mastered)
  - Achievements (100+ points for tournaments)
- Display "Dojo Points" leaderboard
- Redeem points for merchandise or private lessons

### **Badges & Achievements**

- "Perfect Attendance" badge (30 consecutive days)
- "Fast Learner" (completed curriculum in record time)
- "Tournament Warrior" (participated in 3+ competitions)
- Display badges on profile

### **Streak Tracking**

- Show current training streak
- Motivational messages: "You're on a 7-day streak! Keep going!"

---

## 🚀 Implementation Priority

### **Phase 1: Foundation (Week 1)**

1. ✅ Database schema update (CurriculumItem + StudentCurriculumProgress)
2. ✅ Seed curriculum for existing ranks
3. Admin: Curriculum definition UI
4. Admin: Student progress tracking UI

### **Phase 2: Student Experience (Week 2)**

1. Student Dashboard: Curriculum Mastery Board
2. Student Dashboard: Enhanced training analytics
3. Visual progress indicators (arc, charts)
4. Mobile responsive design

### **Phase 3: Advanced Features (Week 3)**

1. Gamification: Points system
2. Badges & achievements
3. Video upload for kata review
4. Sensei feedback panel
5. Goal setting system

### **Phase 4: Polish (Week 4)**

1. Animations & transitions
2. Performance optimization
3. Reports & exports
4. User testing & feedback

---

## 📦 Tech Stack Additions

- **Charts**: `recharts` or `chart.js`
- **Drag-and-Drop**: `@dnd-kit/core`
- **Forms**: `react-hook-form` + `zod`
- **Icons**: Already using `lucide-react` ✅

---

## 🎯 Success Metrics

- Student engagement: % of students logging in weekly
- Curriculum completion rate: Average time to next rank
- Admin efficiency: Time to update student progress
- User satisfaction: Feedback surveys

---

**End of Plan**
