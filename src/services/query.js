import axios from "axios"

/**
 * 查询标签相关接口封装
 */

class Query {
  /**
   * 1.根据视图Id查询用户自定义查询标签
   * @param {int(11)} viewId 视图Id 
   */
  findCustomTagByViewId({
    viewId: viewId,
  }) {
    return axios
      .post(`platform://custom/C08005`, {
        viewId: viewId,
      })
      .then(res => res.data);
  }


  /**
   * 2.根据视图Id查询系统查询标签
   * @param {int(11)} viewId 视图ID 
   */
  findSystemTagByViewId({
    viewId: viewId,
  }) {
    return axios
      .post(`platform://custom/C08002`, {
        viewId: viewId,
      })
      .then(res => res.data);
  }


  /**
   * 3.新增查询标签
   * @param {int(11)} moduleId 模块ID 
   * @param {string(20)} tagName 标签名称 (非必需)
   * @param {int(11)} viewId 视图ID 
   * @param {list(30)} searchs 集合
   * @param {string} searchType searchs元素的属性 搜索条件类型 1、大于 2、小于 3、等于 4、大于等于 5、小于等于 6、包含 7、不等于
   * @param {int(20)} columnId searchs元素的属性 列ID 
   */
  save({
    moduleId: moduleId,
    tagName: tagName = undefined,
    viewId: viewId,
    searchs: searchs,
  }) {
    return axios
      .post(`platform://custom/C08007`, {
        moduleId: moduleId,
        tagName: tagName,
        viewId: viewId,
        searchs: searchs,
      })
      .then(res => res.data);
  }


  /**
   * 4.根据查询标签Id删除查询标签
   * 根据Id删除查询标签，同时会删除查询标签下的查询条件。查询标签和查询条件的删除均为物理删除。
   * @param {int(11)} id 查询标签Id 
   */
  delById({
    id: id,
  }) {
    return axios
      .post(`platform://custom/C08004`, {
        id: id,
      })
      .then(res => res.data);
  }


  /**
   * 5.根据查询标签Id查询查询条件
   * @param {long(11)} tagId 查询标签Id 
   */
  findByTagId({
    tagId: tagId,
  }) {
    return axios
      .post(`platform://custom/C09002`, {
        tagId: tagId,
      })
      .then(res => res.data);
  }


  /**
   * 6.根据模块Id查询查询标签（非关联视图的查询标签）
   * @param {long(11)} moduleId	 模块Id 
   */
  findByModuleId({
    moduleId: moduleId,
  }) {
    return axios
      .post(`platform://custom/C08001`, {
        moduleId: moduleId,
      })
      .then(res => res.data);
  }

  /**
 * 7.根据查询标签Id查询查询条件
 * @param {long(11)} tagId 查询标签Id 
 */
  findInfByTagId({
    tagId: tagId,
  }) {
    return axios
      .post(`platform://custom/C08008`, {
        tagId: tagId,
      })
      .then(res => res.data);
  }
}

export default new Query()
