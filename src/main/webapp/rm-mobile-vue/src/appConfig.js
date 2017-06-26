/**
 * Created by evillive on 2016/12/25
 */

export default {
  install (Vue) {
    let baseUrl = '/internal'
    Vue.prototype.$appConfig = {
      api: {
        authority: baseUrl + '/api/authority/',
        approveList: baseUrl + '/api/leave-approval-app',
        approveDetail: baseUrl + '/api/vacation-approval-detail-app',
        approveAction: baseUrl + '/api/leave-approval-action-app',
        defaultDate: baseUrl + '/api/default-date-vacation-app',
        vacation: baseUrl + '/api/vacation-app',
        shiftsGroup: baseUrl + '/api/shifts-app',
        postsGroup: baseUrl + '/api/posts-app',
        shiftOverlay: baseUrl + '/api/shift-overlay-vacation-app',
        leaders: baseUrl + '/api/leaders-approval-vacation-app',
        searchLeaders: baseUrl + '/api/leaders-search-vacation-app',
        getLeaveQuotaList: baseUrl + '/api/vacation-quota-search-app',
        getLeaveList: baseUrl + '/api/leave-check-app',
        getLeaveRecord: baseUrl + '/api/my-vacation-detail-app',
        repealLeave: baseUrl + '/api/leave-repeal-check-app',
        applySearch: baseUrl + '/api/apply-search-app',
        typeSearch: baseUrl + '/api/type-search-app',
        staffSearch: baseUrl + '/api/staff-search-app',
        dispatchApprovalAction: baseUrl + '/api/dispatch-approval-action-app',
        dispatchApprovalList: baseUrl + '/api/dispatch-approval-app',
        dispatchApprovalDetail: baseUrl + '/api/dispatch-approval-detail-app',
        getDepartment: baseUrl + '/api/dispatch-departments-app',
        searchEmployee: baseUrl + '/api/business-employee-app',
        businessArrange: baseUrl + '/api/business-arrange-app',
        overtimeSearchEmployees: baseUrl + '/api/overtime-staff-search-app',
        overtimeApply: baseUrl + '/api/dispatch-overtime-app',
        getCity: baseUrl + '/api/province-city-app',
        getWorkJobs: baseUrl + '/api/standard-work-jobs-app',
        searchDefaultApprovalAndCCMan: baseUrl + '/api/approval-ccman-holiday-app'
      },
      fmtDate: (date, fmt) => {
        // 简单粗暴一点
        let reg = /^\d{4}(-|[\u4e00-\u9fa5])\d{1,2}(-|[\u4e00-\u9fa5])\d{1,2}/
        if (reg.test(date)) {
          date = new Date(date.replace(/-|[\u4e00-\u9fa5]/g, '/'))
        }
        date = new Date(date)
        let o = {
          'M+': date.getMonth() + 1, // 月份
          'd+': date.getDate(), // 日
          'h+': date.getHours(), // 小时
          'm+': date.getMinutes(), // 分
          's+': date.getSeconds(), // 秒
          'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
          'S': date.getMilliseconds() // 毫秒
        }
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
          }
        }
        return fmt
      }
    }
    Vue.prototype.$toast = (obj) => {
      const oo = {}
      if (typeof obj === 'object') {
        oo.msg = obj.msg || '操作成功'
        oo.timer = obj.time || 2000
        oo.type = obj.type
      } else {
        oo.msg = obj || '操作成功！'
        oo.timer = 2000
      }
      var toast = document.getElementById('toast')
      if (!toast) {
        toast = document.createElement('div')
        toast.setAttribute('id', 'toast')
        toast.className = 'ev-toast'
        document.body.appendChild(toast)
      } else {
        toast.style.display = 'block'
      }
      toast.innerHTML = '<div class="ev-toast-msg"><i class="' + oo.type + '"></i>' + oo.msg + '</div>'
      setTimeout(() => {
        toast.style.display = 'none'
      }, oo.timer)
    }
  }
}
