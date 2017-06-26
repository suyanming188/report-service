/**
 * Created by deepsky on 2017/3/8.
 */
const leaveTypeDic = [{
  id: 'HOLIDAY_ADJUSTABLE',
  name: '调休假',
  unit: 'hour',
  ontOff: false
}, {
  id: 'HOLIDAY_STATUTORY_ANNUAL',
  name: '法定年休假',
  unit: 'day',
  ontOff: false
}, {
  id: 'HOLIDAY_PAY_ANNUAL',
  name: '额外带薪年休假',
  unit: 'day',
  ontOff: false
}, {
  id: 'HOLIDAY_SPRING_FESTIVAL',
  name: '春节调休假',
  unit: 'day',
  ontOff: false
}, {
  id: 'HOLIDAY_CARRY_OVER',
  name: '结转年休假',
  unit: 'day',
  ontOff: false
}, {
  id: 'HOLIDAY_MARRIAGE',
  name: '婚假',
  unit: 'day',
  ontOff: true
}, {
  id: 'HOLIDAY_FUNERAL',
  name: '丧假',
  unit: 'day',
  ontOff: true
}, {
  id: 'HOLIDAY_MATERNITY',
  name: '产假',
  unit: 'day',
  ontOff: true
}, {
  id: 'HOLIDAY_NURSING',
  name: '护理假',
  unit: 'day',
  ontOff: true
}, {
  id: 'HOLIDAY_CONTRACEPTION',
  name: '节育假',
  unit: 'day',
  ontOff: true
}, {
  id: 'HOLIDAY_FAMILY_PLANNING',
  name: '计划生育假',
  unit: 'day',
  ontOff: true
}, {
  id: 'HOLIDAY_ORDINARY_SICK',
  name: '普通病假或医疗期外',
  unit: 'hour',
  ontOff: false
}, {
  id: 'HOLIDAY_STATUTORY_SICK',
  name: '法定病假医疗期',
  unit: 'hour',
  ontOff: true
}, {
  id: 'HOLIDAY_INDUSTRIAL_INJURY',
  name: '法定工伤医疗期',
  unit: 'hour',
  ontOff: true
}, {
  id: 'HOLIDAY_PRIVATE_AFFAIR',
  name: '事假',
  unit: 'hour',
  ontOff: false
}, {
  id: 'HOLIDAY_OTHER_PAY',
  name: '其他带薪假',
  unit: 'day',
  ontOff: true
}]
exports.leaveType = () => {
  return leaveTypeDic
}
exports.applyType = () => {
  return [
    {
      code: 'BUSINESS_TRIP',
      name: '安排出差'
    },
    {
      code: 'TEMPORARY_WORK_OVERTIME',
      name: '安排临时加班'
    }
  ]
}
exports.temporaryType = () => {
  return [
    {
      code: 'EMPORARY_EMERGENCY',
      name: '突发事件'
    },
    {
      code: 'TEMPORARY_BAD_WEATHER',
      name: '恶劣天气、自然灾害'
    },
    {
      code: 'TEMPORARY_COMMUNITY',
      name: '社区活动'
    },
    {
      code: 'TEMPORARY_PROJECT_OPEN',
      name: '项目开盘'
    },
    {
      code: 'TEMPORARY_PROJECT_FOREST',
      name: '项目开荒、入住'
    },
    {
      code: 'TEMPORARY_COMPLAINT',
      name: '客户投诉处理'
    },
    {
      code: 'TEMPORARY_STAFF',
      name: '员工活动'
    },
    {
      code: 'TEMPORARY_TRAINING',
      name: '培训、训练及竞聘等人力资源活动'
    },
    {
      code: 'TEMPORARY_NEW_EMPLOYEES',
      name: '新员工跟岗'
    },
    {
      code: 'TEMPORARY_OWNER',
      name: '业主大会、业委会相关活动'
    },
    {
      code: 'TEMPORARY_PROPERTY_FEE',
      name: '物业费收缴'
    },
    {
      code: 'TEMPORARY_AWARDS_EVENTS',
      name: '各类评优活动'
    },
    {
      code: 'TEMPORARY_RECEPTION',
      name: '接待及公关活动'
    },
    {
      code: 'TEMPORARY_QUALITY',
      name: '品质提升'
    },
    {
      code: 'TEMPORARY_GOVERNMENT',
      name: '政府相关部门协助'
    },
    {
      code: 'TEMPORARY_OTHER',
      name: '其他'
    }]
}
// 类型字典转换
exports.changeType = (str) => {
  let result = null
  for (let type of leaveTypeDic) {
    if (type.name === str) {
      return str
    }
    if (type.id === str) {
      result = type.name
      break
    }
  }
  return result
}
// 转换休假单位
exports.changeLeaveUnit = (leaveQuota, leaveType, unit) => {
  let result = null
  for (let type of leaveTypeDic) {
    if (type.id === leaveType || type.name === leaveType) {
      if (type.unit === 'day') {
        result = unit ? (leaveQuota / 8) + '天' : leaveQuota / 8
      } else {
        result = unit ? leaveQuota + '小时' : leaveQuota
      }
    }
  }
  return result
}
// 判断是否是一次性取假类型
exports.isOneOffLeave = (leaveType) => {
  let result = null
  for (let type of leaveTypeDic) {
    if (type.id === leaveType || type.name === leaveType) {
      if (type.ontOff) {
        result = true
      } else {
        result = false
      }
    }
  }
  return result
}
// 转换申请类型
exports.switchApplyType = (str) => {
  let result = null
  for (let type of exports.applyType()) {
    if (type.name === str) {
      return str
    }
    if (type.id === str) {
      result = type.name
      break
    }
  }
  return result
}

// 转换申请细类
exports.switchTemporaryType = (str) => {
  let result = null
  for (let type of exports.temporaryType()) {
    if (type.name === str) {
      return str
    }
    if (type.id === str) {
      result = type.name
      break
    }
  }
  return result
}

export function isArray (arr) {
  return isType(arr, 'Array')
}

export function isObject (obj) {
  return isType(obj, 'Object')
}

export function isFunction (fn) {
  return isType(fn, 'Function')
}
export function isEmpty (obj) {
  if (!obj) {
    return true
  }
  if (isArray(obj) && obj.length === 0) {
    return true
  }
  if (isObject(obj) && Object.keys(obj).length === 0) {
    return true
  }
  return false
}

export function isType (obj, type) {
  return Object.prototype.toString.call(obj) === '[object ' + type + ']'
}
export function fmtDate (date, fmt) {
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
export function findId (arr, id, name, str) {
  let temp
  for (let index in arr) {
    if (arr[index][name] === str) {
      temp = arr[index][id]
      break
    }
  }
  return temp
}
export function sortBy (array, string, reverse = false) {
  array.sort((a, b) => {
    if (reverse) {
      return a[string] > b[string] ? 1 : -1
    } else {
      return a[string] <= b[string] ? 1 : -1
    }
  })
}
export function pluck (array, key) {
  let temp = []
  Array.isArray(array) && array.forEach(v => {
    if (v[key] !== undefined) {
      temp.push(v[key])
    }
  })
  return temp
}
