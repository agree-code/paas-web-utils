/**
 * 自定义规则方法的数据文件
 * 被引入到custon-formula.ts文件中，作为.registerMethod()方法的参数
 * 
 * @param {string} args 参数名字符串，与函数体中用到的参数名一致
 * @param {string} functionBody  函数体字符串
 * functionBody 中 args的类型为数组 
 */

let methodsMapData = {
  /**
   * 累加
   * @param {Array<number>} functionBody 中的参数args是number组成的Array
   */
  '@SUM': {
    args: 'args',
    functionBody: `
      let sum = 0
      args.forEach(value => {
        sum += value
      })
      return sum`,
  },
  /**
   * 累减
   * @param {Array<number>} functionBody 中的参数args是number组成的Array
   */
  '@SUB': {
    args: 'args',
    functionBody: `
      if(args.length === 1) {
        return args[0]
      }
      let result = 2 * args[0]
      args.forEach(value => {
        result -= value
      })
      return result`,
  },
  /**
   * 累乘
   * @param {Array<number>} functionBody 中的参数args是number组成的Array
   */
  '@MUL': {
    args: 'args',
    functionBody: `
      let r = 1
      args.forEach(value => {
        r *= value
      })
      return r`,
  },
  /**
   * 累除
   * @param {Array<number>} functionBody 中的参数args是number组成的Array
   */
  '@DIV': {
    args: 'args',
    functionBody: `
      if(args.length === 1) {
        return args[0]
      }
      let result = args[0] * args[0]
      args.forEach(value => {
        result /= value
      })
      return result`,
  },
  /**
   * 平均值
   * @param {Array<number>} functionBody 中的参数args是number组成的Array
   */
  '@AVERAGE': {
    args: 'args',
    functionBody: `
    let sum = 0
    let n = args.length
    args.forEach(value => {
      sum += value
    })
    return sum / n`,
  },

  /**
   * 最大值
   * @param {Array<number>} functionBody 中的参数args是number组成的Array
   */
  '@MAX': {
    args: 'args',
    functionBody: `
      return Math.max.apply(null, args)`,
  },
  /**
   * 最小值
   * @param {Array<number>} functionBody 中的参数args是number组成的Array
   */
  '@MIN': {
    args: 'args',
    functionBody: `
      return Math.min.apply(null, args)`,
  },
  /**
   * 绝对值
   * @param {Array<number>} functionBody 中的参数args是number组成的Array
   */
  '@ABS': {
    args: 'args',
    functionBody: `
      return Math.abs.apply(null, args)`,
  },
  /**
   * 字符串拼接
   * '@CONCAT_#$%($COL_1,$COL_2,$COL_3)'
   * @param {Array<number>} functionBody 中的参数args是number组成的Array
   */
  '@CONCAT': {
    args: ['args', 'functionalString'],
    functionBody: `
      if(args.length === 1) {
        return args[0]
      }
      let result = ''
      let fs = functionalString || ''
      let length = args.length
      args.forEach((value, index) => {
        let v = String(value)
        if(index < length - 1) {
          result += v + fs
        }else {
          result += v
        }
      })
      return result`,
  },


}

/**
 * 作为custom-formula的.registerFormat()
 * 拆分得到的字符串整理后的对象
 * dataObj: {
 *   name: '#FIX_2',
 *   key: '#FIX',
 *   num: 2,
 * }
 * 
 * result: 需要处理的number数据
 */
let formatsMapData = {
  '#%': {
    args: ['dataObj', 'result'],
    functionBody: `
      let fixNum = dataObj.num || 0
      return String((result * 100).toFixed(dataObj.num)) + '%'
    `,
  },
  '#FIX': {
    args: ['dataObj', 'result'],
    functionBody: `
      return Number(result).toFixed(dataObj.num)
    `,
  },
}

export {
  methodsMapData,
  formatsMapData
}
