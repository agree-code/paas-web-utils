'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 自定义规则方法的数据文件
 * 被引入到custon-formula.ts文件中，作为.registerMethod()方法的参数
 * 
 * @param {string} args 参数名字符串，与函数体中用到的参数名一致
 * @param {string} functionBody  函数体字符串
 * functionBody 中 args的类型为数组 
 */

var methodsMapData = {
  /**
   * 累加
   * @param {Array<number>} functionBody 中的参数args是number组成的Array
   */
  '@SUM': {
    args: 'args',
    functionBody: '\n      let sum = 0\n      args.forEach(value => {\n        sum += value\n      })\n      return sum'
  },
  /**
   * 累减
   * @param {Array<number>} functionBody 中的参数args是number组成的Array
   */
  '@SUB': {
    args: 'args',
    functionBody: '\n      if(args.length === 1) {\n        return args[0]\n      }\n      let result = 2 * args[0]\n      args.forEach(value => {\n        result -= value\n      })\n      return result'
  },
  /**
   * 累乘
   * @param {Array<number>} functionBody 中的参数args是number组成的Array
   */
  '@MUL': {
    args: 'args',
    functionBody: '\n      let r = 1\n      args.forEach(value => {\n        r *= value\n      })\n      return r'
  },
  /**
   * 累除
   * @param {Array<number>} functionBody 中的参数args是number组成的Array
   */
  '@DIV': {
    args: 'args',
    functionBody: '\n      if(args.length === 1) {\n        return args[0]\n      }\n      let result = args[0] * args[0]\n      args.forEach(value => {\n        result /= value\n      })\n      return result'
  },
  /**
   * 平均值
   * @param {Array<number>} functionBody 中的参数args是number组成的Array
   */
  '@AVERAGE': {
    args: 'args',
    functionBody: '\n    let sum = 0\n    let n = args.length\n    args.forEach(value => {\n      sum += value\n    })\n    return sum / n'
  },

  /**
   * 最大值
   * @param {Array<number>} functionBody 中的参数args是number组成的Array
   */
  '@MAX': {
    args: 'args',
    functionBody: '\n      return Math.max.apply(null, args)'
  },
  /**
   * 最小值
   * @param {Array<number>} functionBody 中的参数args是number组成的Array
   */
  '@MIN': {
    args: 'args',
    functionBody: '\n      return Math.min.apply(null, args)'
  },
  /**
   * 绝对值
   * @param {Array<number>} functionBody 中的参数args是number组成的Array
   */
  '@ABS': {
    args: 'args',
    functionBody: '\n      return Math.abs.apply(null, args)'
  },
  /**
   * 字符串拼接
   * '@CONCAT_#$%($COL_1,$COL_2,$COL_3)'
   * @param {Array<number>} functionBody 中的参数args是number组成的Array
   */
  '@CONCAT': {
    args: ['args', 'functionalString'],
    functionBody: '\n      if(args.length === 1) {\n        return args[0]\n      }\n      let result = \'\'\n      let fs = functionalString || \'\'\n      let length = args.length\n      args.forEach((value, index) => {\n        let v = String(value)\n        if(index < length - 1) {\n          result += v + fs\n        }else {\n          result += v\n        }\n      })\n      return result'
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
};var formatsMapData = {
  '#%': {
    args: ['dataObj', 'result'],
    functionBody: '\n      let fixNum = dataObj.num || 0\n      return String((result * 100).toFixed(dataObj.num)) + \'%\'\n    '
  },
  '#FIX': {
    args: ['dataObj', 'result'],
    functionBody: '\n      return Number(result).toFixed(dataObj.num)\n    '
  }
};

exports.methodsMapData = methodsMapData;
exports.formatsMapData = formatsMapData;