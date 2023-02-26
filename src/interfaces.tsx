export interface INavigation {
  navigate: Function;
  goBack: Function;
  canGoBack: Function;
  getID: Function;
  getParent: Function;
  pop: Function;
  popToTop: Function;
  getState: Function;
}
