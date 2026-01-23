import { UserRole } from "@/lib/auth"
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  Clock,
  DollarSign,
  MessageSquare,
  Image,
  Award,
  Building2,
  CalendarCheck,
  FileCheck,
  Receipt,
  BarChart3,
  BookOpen,
  CreditCard,
  Ticket,
  User,
  List,
  CheckSquare,
  StickyNote,
  LucideIcon,
} from "lucide-react"

export interface NavigationItem {
  label: string
  href: string
  icon: LucideIcon
}

export const ADMIN_NAVIGATION: Record<UserRole, NavigationItem[]> = {
  doctor: [
    { label: "Overview", href: "/dashboard/admin/doctor", icon: LayoutDashboard },
    { label: "Doctor Availability", href: "/dashboard/admin/doctor/availability", icon: CalendarCheck },
    { label: "Prescription", href: "/dashboard/admin/doctor/prescription", icon: FileText },
    { label: "Appointments", href: "/dashboard/admin/doctor/appointments", icon: Calendar },
    { label: "Payments", href: "/dashboard/admin/doctor/payments", icon: DollarSign },
    { label: "Employees", href: "/dashboard/admin/doctor/employees", icon: Users },
    { label: "Attendance", href: "/dashboard/admin/doctor/attendance", icon: Clock },
    { label: "Manager Leaves", href: "/dashboard/admin/doctor/manager-leaves", icon: FileCheck },
    { label: "Inquiry", href: "/dashboard/admin/doctor/inquiry", icon: MessageSquare },
    { label: "Gallery", href: "/dashboard/admin/doctor/gallery", icon: Image },
    { label: "Achievements", href: "/dashboard/admin/doctor/achievements", icon: Award },
    { label: "Hospital Details", href: "/dashboard/admin/doctor/settings", icon: Building2 },
    { label: "NexRoutine", href: "/dashboard/admin/doctor/nexroutine", icon: CheckSquare },
  ],
  manager: [
    { label: "Overview", href: "/dashboard/admin/manager", icon: LayoutDashboard },
    { label: "Employees", href: "/dashboard/admin/manager/employees", icon: Users },
    { label: "Attendance", href: "/dashboard/admin/manager/attendance", icon: Clock },
    { label: "Leave Requests", href: "/dashboard/admin/manager/leaves", icon: FileCheck },
    { label: "Inquiry", href: "/dashboard/admin/manager/inquiry", icon: MessageSquare },
    { label: "Gallery", href: "/dashboard/admin/manager/gallery", icon: Image },
    { label: "Achievements", href: "/dashboard/admin/manager/achievements", icon: Award },
    { label: "NexRoutine", href: "/dashboard/admin/manager/nexroutine", icon: CheckSquare },
  ],
  accountant: [
    { label: "Overview", href: "/dashboard/admin/accountant", icon: LayoutDashboard },
    { label: "Salary", href: "/dashboard/admin/accountant/salary", icon: DollarSign },
    { label: "Payments", href: "/dashboard/admin/accountant/payments", icon: Receipt },
    { label: "Reports", href: "/dashboard/admin/accountant/reports", icon: BarChart3 },
    { label: "NexRoutine", href: "/dashboard/admin/accountant/nexroutine", icon: CheckSquare },
  ],
  receptionist: [
    { label: "Overview", href: "/dashboard/admin/receptionist", icon: List },
    { label: "Current Bookings", href: "/dashboard/admin/receptionist/current-bookings", icon: CalendarCheck },
    { label: "Bookings", href: "/dashboard/admin/receptionist/bookings", icon: BookOpen },
    { label: "Payments", href: "/dashboard/admin/receptionist/payments", icon: CreditCard },
    { label: "Tokens", href: "/dashboard/admin/receptionist/tokens", icon: Ticket },
    { label: "Attendance", href: "/dashboard/admin/receptionist/attendance", icon: Clock },
    { label: "Inquiry", href: "/dashboard/admin/receptionist/inquiry", icon: MessageSquare },
    { label: "NexRoutine", href: "/dashboard/admin/receptionist/nexroutine", icon: CheckSquare },
  ],
  employee: [
    { label: "Overview", href: "/dashboard/employee", icon: LayoutDashboard },
    { label: "Attendance", href: "/dashboard/employee/attendance", icon: Clock },
    { label: "Leave Requests", href: "/dashboard/employee/leave", icon: FileCheck },
    { label: "Salary", href: "/dashboard/employee/salary", icon: DollarSign },
    { label: "Profile", href: "/dashboard/employee/profile", icon: User },
    { label: "NexRoutine", href: "/dashboard/employee/nexroutine", icon: CheckSquare },
  ],
}

export const ADMIN_DASHBOARD_TITLES: Record<UserRole, { title: string; subtitle: string }> = {
  doctor: {
    title: "Doctor Dashboard",
    subtitle: "Hospital management and system-level controls",
  },
  manager: {
    title: "Manager Dashboard",
    subtitle: "Employee management and leave approvals",
  },
  accountant: {
    title: "Accountant Dashboard",
    subtitle: "Salary management and financial records",
  },
  receptionist: {
    title: "Receptionist Dashboard",
    subtitle: "Patient queue and booking management",
  },
  employee: {
    title: "Employee Dashboard",
    subtitle: "Manage your attendance, salary, and leave balance",
  },
}

export function getNavigationForRole(role: UserRole): NavigationItem[] {
  return ADMIN_NAVIGATION[role] || []
}

export function getDashboardTitle(role: UserRole): { title: string; subtitle: string } {
  return ADMIN_DASHBOARD_TITLES[role] || { title: "Dashboard", subtitle: "" }
}

