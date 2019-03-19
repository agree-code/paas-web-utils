import SplitString from './custom-formula-spit-string'
import { methodsMapData, formatsMapData } from './custom-formula-data.js'

class CustomFormula {
  private methodsMap = methodsMapData
  private formatsMap = formatsMapData

  //通过参数名string 找到对应的value 返回 {参数名: 参数值} 类型的对象 如{'$XXX': 123}
  //随便写的
  private findValueFromArgsName(names: Array<Object>) {
    let val = 1
    let res = {}
    let step = Math.floor(Math.random() * 10) + 1
    names.forEach((name) => {
      val -= step
      res[name['name']] = val
    })
    console.log('args value is ', res)
    return res
  }

  constructor() { }

  public process(originString: string) {
    //得到切割字符串的结果
    let objFromString = new SplitString(originString)
    //得到的函数名 string
    let functionName = objFromString.getFunctionName().name
    let functionalString = objFromString.getFunctionName().functionalString
    //得到的参数对象组成的数组
    let args = objFromString.getArgsArray()
    //得到formats对象组成的数组
    let formats = objFromString.getFormats()
    //通过参数名数组找到参数实际值组成的{argname: value}对象
    let argsMap = this.findValueFromArgsName(args)
    //根据参数名array提取出map中的值array，确保两个数组的元素顺序一致
    let argsValue = args.map(name => {
      return argsMap[name['name']]
    })
    // 根据argsMap 中的函数名和函数体 字符串 生成运行函数
    let result = this.methodsResult(functionName, functionalString, argsValue)
    // 将实际参数带入运行此函数 返回运行结果
    result = this.formatResult(result, formats)
    // 生成格式调整函数
    console.log(`process: ${functionName} end, result: ${result}`)
    return result
  }

  //defineObj为custom-formula-data.js中的配置对象
  public registerMethod(name: string, defineObj: Object) {
    if (this.methodsMap[name]) {
      console.log(`方法 ${name} 已经被定义，不能重新被定义`)
      return
    }
    this.methodsMap[name] = defineObj
  }

  //defineObj为custom-formula-data.js中的配置对象
  public registerFormat(name: string, defineObj: Object) {
    if (this.formatsMap[name]) {
      console.log(`格式 ${name} 已经被定义，不能重新被定义`)
      return
    }
    this.methodsMap[name] = defineObj
  }

  //methods方法的返回值
  private methodsResult(functionName: string, functionalString, argsValue) {
    //methodsMap中没有定义functionName 不能生成函数
    if (!this.methodsMap[functionName]) {
      console.log(`方法 ${functionName} 没有定义，不能运行此方法`)
      return
    }
    let argsInMethodsMap = this.methodsMap[functionName].args
    // new Function()所需要的函数体string
    let functionBody = this.methodsMap[functionName].functionBody
    let processFunction = new Function(...argsInMethodsMap, functionBody)
    let r = processFunction(argsValue, functionalString)
    return r
  }

  private formatResult(num: number, formats: Object) {
    let r = num
    for (const key in formats) {
      const f = this.formatsMap[key]
      if (!f) {
        console.log(`格式 ${key} 没有定义，不能执行`)
      } else {
        let argsInFormatsMap = this.formatsMap[key].args
        let functionBody = this.formatsMap[key].functionBody
        let processFunction = new Function(...argsInFormatsMap, functionBody)
        r = processFunction(formats[key], r)
      }
    }
    return r
  }
}
export default new CustomFormula()
