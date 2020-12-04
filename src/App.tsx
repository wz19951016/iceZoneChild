import React, { useEffect } from "react";
import { {{name}}InitAction } from "./actions"
import Provider from "./provider";
import connect from "./connect";


const App = (props) => {
  const { dispatch } = props;

  useEffect(() => {
    console.log(props);
    dispatch({{name}}InitAction())
  }, [0]);

  return (
  <div>{{name}}</div>
  );
};
const BaseApp = connect((state) => {
  return { ...state };
})(App);

const WrapApp = ({ globalEventDistributor, history }) => {
  console.log(globalEventDistributor);
  return (
    <Provider store={globalEventDistributor}>
      <BaseApp history={history} />
    </Provider>
  );
};

export default WrapApp;
