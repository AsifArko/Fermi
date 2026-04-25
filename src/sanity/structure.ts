import { StructureBuilder } from 'sanity/structure';
import { AnalyticsDashboard } from './components/analytics-dashboard';
import { MonitoringDashboard } from './components/monitoring-dashboard';
import { QuickActions } from './components/QuickActions';
import {
  BookOpen,
  GraduationCap,
  User,
  Users as UsersIcon,
  FolderOpen,
  Code,
  FileText,
  Activity,
  Monitor,
  BarChart3,
  Settings,
  Home,
} from 'lucide-react';

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Welcome Screen with Quick Actions
      S.listItem()
        .title('Welcome & Quick Actions')
        .icon(Home)
        .child(S.component(QuickActions).title('Quick Actions')),

      // Analytics & Monitoring
      S.listItem()
        .title('Analytics Dashboard')
        .icon(BarChart3)
        .child(S.component(AnalyticsDashboard).title('Analytics Dashboard')),

      S.listItem()
        .title('System Monitoring')
        .icon(Monitor)
        .child(S.component(MonitoringDashboard).title('Monitoring Dashboard')),

      S.divider(),

      // Main Content Types - Flat Structure
      S.listItem()
        .title('Courses')
        .icon(BookOpen)
        .child(S.documentTypeList('course').title('All Courses')),

      S.listItem()
        .title('Categories')
        .icon(FolderOpen)
        .child(S.documentTypeList('category').title('All Categories')),

      S.listItem()
        .title('Modules')
        .icon(Code)
        .child(S.documentTypeList('module').title('All Modules')),

      S.listItem()
        .title('Lessons')
        .icon(FileText)
        .child(S.documentTypeList('lesson').title('All Lessons')),

      S.divider(),

      // User Management - Flat Structure
      S.listItem()
        .title('Instructors')
        .icon(User)
        .child(S.documentTypeList('instructor').title('All Instructors')),

      S.listItem()
        .title('Students')
        .icon(GraduationCap)
        .child(S.documentTypeList('student').title('All Students')),

      S.listItem()
        .title('Enrollments')
        .icon(UsersIcon)
        .child(S.documentTypeList('enrollment').title('All Enrollments')),

      S.listItem()
        .title('Lesson Completions')
        .icon(FileText)
        .child(
          S.documentTypeList('lessonCompletion').title('All Lesson Completions')
        ),

      S.divider(),

      // Monitoring Data Types
      S.listItem()
        .title('Page Views')
        .icon(Activity)
        .child(S.documentTypeList('pageView').title('All Page Views')),

      S.listItem()
        .title('User Events')
        .icon(Activity)
        .child(S.documentTypeList('userEvent').title('All User Events')),

      S.listItem()
        .title('Performance Metrics')
        .icon(Monitor)
        .child(
          S.documentTypeList('performanceMetric').title(
            'All Performance Metrics'
          )
        ),

      S.listItem()
        .title('System Metrics')
        .icon(Settings)
        .child(S.documentTypeList('systemMetric').title('All System Metrics')),

      S.listItem()
        .title('Error Logs')
        .icon(Monitor)
        .child(S.documentTypeList('errorLog').title('All Error Logs')),
    ]);
