/**
 * 字符串切割
 * @开头是计算方法函数名,只能有一个方法函数名
 * $开头是参数名
 * #开头是返回数据格式方法名
 */

class SplitString {
  private originString: string
  private functionName: string
  private argsName: Array<string>
  private formatsName: Array<string>
  private reg = {
    functionName: /@[A-Z]+\_?[^()]+/,
    argsName: /\$[A-Z]+\_\d*/g,
    formatsName: /#[A-Z%]+\_?\d*/g,
  }

  constructor(str) {
    this.originString = str
    this.init()
  }

  private init() {
    let str = this.originString
    this.functionName = str.match(this.reg.functionName)[0]
    this.argsName = str.match(this.reg.argsName)
    this.formatsName = str.match(this.reg.formatsName) || undefined
  }

  public getFunctionName() {
    let temp = this.functionName.split('_')
    return {
      name: temp[0],
      functionalString: temp[1] || undefined
    }
  }

  /**
   * 将得到的字符串再次剪切并封装成指定的对象
   * [
   *  {
   *    name: '$COL_1',
   *    key: '$COL',
   *    id: 2,
   *  },
   * ]
   */
  public getArgsArray() {
    let r = this.argsName.map(name => {
      let temp = name.split('_')
      return {
        name: name,
        key: temp[0],
        id: Number(temp[1]) || undefined
      }
    })
    return r
  }

  /**
 * 将得到的字符串再次剪切并封装成指定的对象
 * {
 *   '#FIX': {
 *     name: '#FIX_2',
 *     key: '#FIX',
 *     num: 2,
 *   },
 * }
 */

  public getFormats() {
    let r = {}
    if (!this.formatsName) {
      return r
    }
    this.formatsName.forEach(name => {
      let temp = name.split('_')
      let key = temp[0]
      let num = Number(temp[1]) || undefined
      r[key] = {
        name,
        key,
        num,
      }
    })
    return r
  }
}

export default SplitString