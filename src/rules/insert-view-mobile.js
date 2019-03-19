import InsertView from './insert-view'
import renderService from "../services/render";

class InsertViewMobile extends InsertView {
  constructor() {
    super()
  }

  _axios(viewId, recordId) {
    let cacheKey = `renderService.findInsertViewMobileRender(${viewId})`;
    if (this.$space[cacheKey]) {
      return this.$space[cacheKey];
    } else {
      let promise = renderService.findInsertViewMobileRender(viewId).then((result) => {
        this.$space[cacheKey] = Promise.resolve(result);
        // console.log('移动端 R02001', result)
        return result;
      });
      this.$space[cacheKey] = promise;
      return promise;
    }
  }
}

export default InsertViewMobile