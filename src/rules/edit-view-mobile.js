import EditView from './edit-view'
import renderService from "../services/render";

class EditViewMobile extends EditView {
  constructor() {
    super()
  }

  _axios(viewId, recordId) {
    return renderService.findUpdateViewMobileRender(viewId, recordId);
  }
}

export default EditViewMobile