import axios from "axios"
class RenderService {
  /**
   * 获取列表视图渲染
   * @param {String} viewId 视图Id
   */
  findListViewRender(viewId) {
    return axios
      .post("platform://render/R01003", { viewId: viewId })
      .then(res => res.data);
  }
  /**
   * 获取新增视图渲染
   * @param {*} viewId 视图Id
   */
  findInsertViewRender(viewId) {
    return axios
      .post("platform://render/R01001", {
        viewId: viewId,
        isPermission: true
      })
      .then(res => res.data);
  }
  /**
   * 获取更新视图渲染
   * @param {*} viewId 视图Id
   * @param {*} recordId 真实数据Id
   */
  findUpdateViewRender(viewId, recordId) {
    return axios
      .post("platform://render/R01002", {
        viewId: viewId,
        recordId: recordId,
        isPreview: 1
      })
      .then(res => res.data);
  }
  /**
   * 获取详情视图渲染
   * @param {*} viewId 视图Id
   * @param {*} recordId 真实数据Id
   */
  findDetailViewRender(viewId, recordId) {
    return axios
      .post("platform://render/R01004", {
        viewId: viewId,
        recordId: recordId,
        isPreview: 1
      })
      .then(res => res.data);
  }

  /**
   * 获取新增视图渲染(移动端)
   * @param {*} viewId 视图Id
   */
  findInsertViewMobileRender(viewId) {
    return axios
      .post("platform://render/R02001", {
        viewId: viewId,
        isPermission: true
      })
      .then(res => res.data);
  }

  /**
   * 获取更新视图渲染(移动端)
   * @param {*} viewId 视图Id
   * @param {*} recordId 真实数据Id
   */
  findUpdateViewMobileRender(viewId, recordId) {
    return axios
      .post("platform://render/R02002", {
        viewId: viewId,
        recordId: recordId,
        isPreview: 1
      })
      .then(res => res.data);
  }

  /**
   * 获取列表视图渲染(移动端)
   * @param {String} viewId 视图Id
   */
  findListViewMobileRender(viewId) {
    return axios
      .post("platform://render/R02003", { viewId: viewId })
      .then(res => res.data);
  }

  /**
   * 获取详情视图渲染(移动端)
   * @param {*} viewId 视图Id
   * @param {*} recordId 真实数据Id
   */
  findDetailViewMobileRender(viewId, recordId) {
    return axios
      .post("platform://render/R02004", {
        viewId: viewId,
        recordId: recordId,
        isPreview: 1
      })
      .then(res => res.data);
  }
}

export default new RenderService();
