import { StructureBuilder } from 'sanity/structure';
import { AnalyticsDashboard } from './components/analytics-dashboard';
import { MonitoringDashboard } from './components/monitoring-dashboard';
import {
  BookOpen,
  GraduationCap,
  User,
  Users as UsersIcon,
  FolderOpen,
  Code,
  FileText,
  Edit,
  Activity,
  Monitor,
} from 'lucide-react';

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Analytics Dashboard
      S.listItem()
        .title('Site Analytics')
        .icon(Activity)
        .child(S.component(AnalyticsDashboard).title('Analytics Dashboard')),

      // Monitoring Dashboard
      S.listItem()
        .title('System Monitoring')
        .icon(Monitor)
        .child(S.component(MonitoringDashboard).title('Monitoring Dashboard')),

      S.divider(),

      // Course Content Management
      S.listItem()
        .title('Course Content')
        .icon(BookOpen)
        .child(
          S.list()
            .title('Course Management')
            .items([
              S.listItem()
                .title('All Courses')
                .icon(GraduationCap)
                .child(
                  S.documentTypeList('course')
                    .title('Courses')
                    .child(courseId =>
                      S.list()
                        .title('Course Options')
                        .items([
                          S.listItem()
                            .title('Edit Course Content')
                            .icon(Edit)
                            .child(
                              S.document()
                                .schemaType('course')
                                .documentId(courseId)
                            ),
                          S.listItem()
                            .title('View Students')
                            .icon(UsersIcon)
                            .child(
                              S.documentList()
                                .title('Course Enrollments')
                                .filter(
                                  '_type == "enrollment" && course._ref == $courseId'
                                )
                                .params({ courseId })
                            ),
                        ])
                    )
                ),
              S.listItem()
                .title('Course Categories')
                .icon(FolderOpen)
                .child(S.documentTypeList('category').title('Categories')),
              S.listItem()
                .title('Course Modules')
                .icon(Code)
                .child(S.documentTypeList('module').title('Modules')),
              S.listItem()
                .title('Course Lessons')
                .icon(FileText)
                .child(S.documentTypeList('lesson').title('Lessons')),
            ])
        ),

      S.divider(),

      // User Management
      S.listItem()
        .title('User Management')
        .icon(UsersIcon)
        .child(
          S.list()
            .title('User Management')
            .items([
              S.listItem()
                .title('Instructors')
                .icon(User)
                .schemaType('instructor')
                .child(
                  S.documentTypeList('instructor')
                    .title('Instructors')
                    .child(instructorId =>
                      S.list()
                        .title('Instructor Options')
                        .items([
                          S.listItem()
                            .title('Edit Instructor Details')
                            .icon(Edit)
                            .child(
                              S.document()
                                .schemaType('instructor')
                                .documentId(instructorId)
                            ),
                          S.listItem()
                            .title('View Courses')
                            .icon(BookOpen)
                            .child(
                              S.documentList()
                                .title("Instructor's Courses")
                                .filter(
                                  '_type == "course" && instructor._ref == $instructorId'
                                )
                                .params({ instructorId })
                            ),
                        ])
                    )
                ),
              S.listItem()
                .title('Students')
                .icon(GraduationCap)
                .schemaType('student')
                .child(
                  S.documentTypeList('student')
                    .title('Students')
                    .child(studentId =>
                      S.list()
                        .title('Student Options')
                        .items([
                          S.listItem()
                            .title('Edit Student Details')
                            .icon(Edit)
                            .child(
                              S.document()
                                .schemaType('student')
                                .documentId(studentId)
                            ),
                          S.listItem()
                            .title('View Enrollments')
                            .icon(BookOpen)
                            .child(
                              S.documentList()
                                .title('Student Enrollments')
                                .filter(
                                  '_type == "enrollment" && student._ref == $studentId'
                                )
                                .params({ studentId })
                            ),
                        ])
                    )
                ),
              S.listItem()
                .title('Enrollments')
                .icon(UsersIcon)
                .child(
                  S.documentTypeList('enrollment').title('Course Enrollments')
                ),
              S.listItem()
                .title('Lesson Completions')
                .icon(FileText)
                .child(
                  S.documentTypeList('lessonCompletion').title(
                    'Lesson Completions'
                  )
                ),
            ])
        ),

      S.divider(),

      // Include remaining document types (excluding the ones we've grouped)
      ...S.documentTypeListItems().filter(
        listItem =>
          ![
            'course',
            'instructor',
            'student',
            'enrollment',
            'lessonCompletion',
            'category',
            'module',
            'lesson',
            'pageView',
            'userEvent',
            'performanceMetric',
            'systemMetric',
            'errorLog',
          ].includes(listItem.getId() as string)
      ),
    ]);
