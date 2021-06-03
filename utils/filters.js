import Vue from 'vue'

// eslint-disable-next-line no-extend-native
String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, 'gm'), s2)
}

// 过滤器
Vue.filter('dateFormat', function (timestamp, format) {
  if (!timestamp) {
    return null
  }

  // eslint-disable-next-line no-extend-native
  Date.prototype.format = function (fmt) {
    const o = {
      'M+': this.getMonth() + 1, // 月份
      'd+': this.getDate(), // 日
      'H+': this.getHours(), // 小时
      'm+': this.getMinutes(), // 分
      's+': this.getSeconds(), // 秒
      'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
      S: this.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)) }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
    }
    return fmt
  }
  return new Date(parseInt(timestamp)).format(format)
})

Vue.filter('n2c', function (num) {
  if (num === 0) return '零'

  const convert = {
    0: '零',
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '七',
    8: '八',
    9: '九',
    '.': ''
  }

  const weight = {
    0: '',
    1: '十',
    2: '百',
    3: '千'
  }

  function getWeight (index, only) {
    if (index < 4) return !only ? weight[index] : ''
    else return getWeight(index - 4, only) + ((index === 4) ? '万' : '')
  }
  return (function getE (strnum, deep) {
    if (strnum === '0') return ''
    deep = deep || 0
    if (strnum.length > 8) { return getE(strnum.substr(0, strnum.length - 8), deep + 1) + getE(strnum.substr(-8), deep) }

    strnum = strnum.replace(/^0+/, '').replace(/0/g, function (w) {
      return '.'.repeat(w.length)
    }).replace(/0$/, '.')

    var array = Object.keys(strnum).map(function (x) { return strnum[x] })

    var length = array.length

    if (array[length - 1 - 6] === '.' && array[length - 1 - 5] !== '.') array[length - 1 - 6] = '0'
    if (array[length - 1 - 5] === '.' && array[length - 1 - 4] !== '.') array[length - 1 - 5] = '0'
    return array.map(function (iter, index) {
      if (((length - index - 1) <= 2) && /\.[1-9]/.test(array.slice(index, index + 2).join(''))) return '零'
      return convert[iter] + ((iter !== '0') ? getWeight(length - index - 1, iter === '.') : '')
    }).join('').replace(/^一十/g, '十') + ('亿'.repeat(deep))
  })(num + '')
})
