/**
 * Created by evillive on 2016/12/25
 */
// const Home = require('../views/home')
// example demo
const Button = r => require.ensure([], () => r(require('../views/example/button')), 'group-test')
const Model = r => require.ensure([], () => r(require('../views/example/model')), 'group-test')
// Leave
const Leave = r => require.ensure([], () => r(require('../views/leave/index')), 'group-leave')
const LeaveHome = r => require.ensure([], () => r(require('../views/leave/home')), 'group-leave')
const LeaveAction = r => require.ensure([], () => r(require('../views/leave/action')), 'group-leave')
const SearchApprovers = r => require.ensure([], () => r(require('../views/leave/search-approvers')), 'group-leave')
const SearchStaff = r => require.ensure([], () => r(require('../views/leave/search-staff')), 'group-leave')
const LeaveList = r => require.ensure([], () => r(require('../views/leave/list')), 'group-leave')
const LeaveRecord = r => require.ensure([], () => r(require('../views/leave/record')), 'group-leave')
const LeaveBalance = r => require.ensure([], () => r(require('../views/leave/balance')), 'group-leave')
const LeaveBalanceOption = r => require.ensure([], () => r(require('../views/leave/balance-option')), 'group-leave')
const LeaveOneOff = r => require.ensure([], () => r(require('../views/leave/one-off-leave')), 'group-leave')
const LeaveExplain = r => require.ensure([], () => r(require('../views/leave/explain')), 'group-leave')
const LeaveApprove = r => require.ensure([], () => r(require('../views/leave/approve')), 'group-leave')
const LeaveDetail = r => require.ensure([], () => r(require('../views/leave/detail')), 'group-leave')
const LeaveActionListCheck = r => require.ensure([], () => r(require('../views/leave/action-list-check')), 'group-leave')
// 员工调度
const Dispatch = r => require.ensure([], () => r(require('../views/dispatch/index')), 'group-dispatch')
const DispatchHome = r => require.ensure([], () => r(require('../views/dispatch/home')), 'group-dispatch')
const ApplySearch = r => require.ensure([], () => r(require('../views/dispatch/apply-search')), 'group-dispatch')
const AdvancedSearch = r => require.ensure([], () => r(require('../views/dispatch/advanced-search')), 'group-dispatch')
const TypeSelect = r => require.ensure([], () => r(require('../views/dispatch/type-select')), 'group-dispatch')
const NameSelect = r => require.ensure([], () => r(require('../views/dispatch/name-select')), 'group-dispatch')
const DispatchApproval = r => require.ensure([], () => r(require('../views/dispatch/approval')), 'group-dispatch')
const DispatchApprovalDetail = r => require.ensure([], () => r(require('../views/dispatch/approval-detail')), 'group-dispatch')
const DispatchOvertime = r => require.ensure([], () => r(require('../views/dispatch/overtime')), 'group-dispatch')
const OvertimeType = r => require.ensure([], () => r(require('../views/dispatch/overtime-type')), 'group-dispatch')
const DispatchEmployee = r => require.ensure([], () => r(require('../views/dispatch/employee')), 'group-dispatch')
const dispatchSearchEmployee = r => require.ensure([], () => r(require('../views/dispatch/search-employee')), 'group-dispatch')
const ArrangeBussiness = r => require.ensure([], () => r(require('../views/dispatch/arrange-bussiness')), 'group-dispatch')
const EmployeeTime = r => require.ensure([], () => r(require('../views/dispatch/employee-time')), 'group-dispatch')
// 考勤汇总
const Attendance = r => require.ensure([], () => r(require('../views/attendance/index')), 'group-attendance')
const AttendanceHome = r => require.ensure([], () => r(require('../views/attendance/home')), 'group-attendance')
const AttendanceSummary = r => require.ensure([], () => r(require('../views/attendance/summary')), 'group-attendance')
const DiligentRanking = r => require.ensure([], () => r(require('../views/attendance/diligent-ranking')), 'group-attendance')
const LateRanking = r => require.ensure([], () => r(require('../views/attendance/late-ranking')), 'group-attendance')
const SelectProject = r => require.ensure([], () => r(require('../views/attendance/select-project')), 'group-attendance')
const PersonalAttendance = r => require.ensure([], () => r(require('../views/attendance/personal')), 'group-attendance')
const PersonalDetail = r => require.ensure([], () => r(require('../views/attendance/personal-detail')), 'group-attendance')
const ProjectAttendance = r => require.ensure([], () => r(require('../views/attendance/project')), 'group-attendance')
const ProjectDetail = r => require.ensure([], () => r(require('../views/attendance/project-detail')), 'group-attendance')
const UnarrangedAttendance = r => require.ensure([], () => r(require('../views/attendance/unarranged')), 'group-attendance')
// 日报
const Paper = r => require.ensure([], () => r(require('../views/paper/index')), 'group-paper')
const PaperHome = r => require.ensure([], () => r(require('../views/paper/home')), 'group-paper')
const PaperDepartment = r => require.ensure([], () => r(require('../views/paper/department')), 'group-paper')
const PaperCompany = r => require.ensure([], () => r(require('../views/paper/company')), 'group-paper')
// 移动考勤

// 404
const NotFound = require('../views/notfound')

// 根目录
const rootPath = ''

// 页面路由
const routes = [
  {path: '', redirect: {name: 'paperHome'}},
  {path: '/', redirect: {name: 'paperHome'}},
  {path: '/button', component: Button, name: 'button'},
  {path: '/model', component: Model, name: 'model'},
  {
    path: '/leave',
    component: Leave,
    meta: {requiresAuth: true},
    children: [
      {path: '', component: LeaveHome, name: 'leaveHome'},
      {path: 'action', component: LeaveAction, name: 'leaveAction'},
      {path: 'list', component: LeaveList, name: 'leaveList'},
      {path: 'record', component: LeaveRecord, name: 'leaveRecord'},
      {path: 'balance', component: LeaveBalance, name: 'leaveBalance'},
      {path: 'balance-option', component: LeaveBalanceOption, name: 'leaveBalanceOption'},
      {path: 'apply-leave', component: LeaveOneOff, name: 'leaveOneOff'},
      {path: 'explain', component: LeaveExplain, name: 'leaveExplain'},
      {path: 'approve', component: LeaveApprove, name: 'leaveApprove'},
      {path: 'detail', component: LeaveDetail, name: 'leaveDetail'},
      {path: 'action-list-check', component: LeaveActionListCheck, name: 'leaveActionListCheck'},
      {path: 'search-approvers', component: SearchApprovers, name: 'SearchApprovers'},
      {path: 'search-staff', component: SearchStaff, name: 'searchStaff'}
    ]
  },
  {
    path: '/dispatch',
    component: Dispatch,
    children: [
      {path: '', component: DispatchHome, name: 'dispatchHome'},
      {path: 'search', component: ApplySearch, name: 'applySearch'},
      {path: 'advanced', component: AdvancedSearch, name: 'advancedSearch'},
      {path: 'type', component: TypeSelect, name: 'typeSelect'},
      {path: 'name', component: NameSelect, name: 'nameSelect'},
      {path: 'approval', component: DispatchApproval, name: 'dispatchApproval'},
      {path: 'approval-detail', component: DispatchApprovalDetail, name: 'dispatchApprovalDetail'},
      {path: 'overtime', component: DispatchOvertime, name: 'dispatchOvertime'},
      {path: 'overtime-type', component: OvertimeType, name: 'overtimeType'},
      {path: 'employee', component: DispatchEmployee, name: 'dispatchEmployee'},
      {path: 'search-employee', component: dispatchSearchEmployee, name: 'dispatchSearchEmployee'},
      {path: 'arrange-bussiness', component: ArrangeBussiness, name: 'arrangeBussiness'},
      {path: 'employee-time', component: EmployeeTime, name: 'employee-time'}
    ]
  },
  {
    path: '/paper',
    component: Paper,
    children: [
      {path: '', component: PaperHome, name: 'paperHome'},
      {path: 'department', component: PaperDepartment, name: 'paperDepartment'},
      {path: 'company', component: PaperCompany, name: 'paperCompany'}
    ]
  },
  {
    path: '/attendance',
    component: Attendance,
    children: [
      {path: '', component: AttendanceHome, name: 'attendanceHome'},
      {path: 'summary', component: AttendanceSummary, name: 'attendanceSummary'},
      {path: 'diligent-ranking', component: DiligentRanking, name: 'diligentRanking'},
      {path: 'late-ranking', component: LateRanking, name: 'lateRanking'},
      {path: 'select-project', component: SelectProject, name: 'selectProject'},
      {path: 'personal', component: PersonalAttendance, name: 'personalAttendance'},
      {path: 'personal-detail', component: PersonalDetail, name: 'personalDetail'},
      {path: 'project', component: ProjectAttendance, name: 'projectAttendance'},
      {path: 'project-detail', component: ProjectDetail, name: 'projectDetail'},
      {path: 'unarranged', component: UnarrangedAttendance, name: 'unarrangedAttendance'}
    ]
  }
].map(route => {
  route.path = rootPath + route.path
  return route
})

// 404 页
routes.push({path: '*', component: NotFound, name: 'notfound'})

export default routes
