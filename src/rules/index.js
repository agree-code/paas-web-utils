import viewCache from "./view-cache";
import View from "./view";
import ListView from "./list-view";
import InsertView from "./insert-view";
import EditView from "./edit-view";
import DetailView from "./detail-view";
import ViewGroup from "./view-group";
import BatchView from "./batch-view";
import BatchRowView from "./batch-row-view";
import Column from "./column";
import Operation from "./operation";
import Organization from "./organization";
import Dict from "./dict";
import InsertViewMobile from './insert-view-mobile'
import EditViewMobile from './edit-view-mobile'
import ListViewMobile from './list-view-mobile'
import DetailViewMobile from './detail-view-mobile'

export {
  View,
  viewCache,
  ListView,
  InsertView,
  EditView,
  DetailView,
  ViewGroup,
  BatchView,
  BatchRowView,
  Column,
  Operation,
  Organization,
  Dict,
  InsertViewMobile,
  EditViewMobile,
  ListViewMobile,
  DetailViewMobile,
};

export default {
  loading() {
    return Promise.all([Dict.loading("test"), Organization.loading("test")]);
  }
}
