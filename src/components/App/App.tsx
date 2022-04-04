import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { locale, loadMessages } from "devextreme/localization";
import ruMessages from "devextreme/localization/messages/ru.json";
import history from "../../constants/history";
import { Router, Route, Switch } from "react-router-dom";
import cookie from "js-cookie";
import AcceptCookies from "../common/AcceptCookies";
import { AppRoute, AppRoutes } from "../../routes/appRoutes";
import { AppStateType } from "../../reducers/store";
import { acceptCookies } from "../../actions/appActions";

const { v4: uuidv4 } = require("uuid");

type MapStateToPropsType = {
  token: string;
  isCookiesAccepted: boolean;
};

type MapDispatchPropsType = {
  acceptCookies: (accept: string) => void;
};

type OwnPropsType = {
  location: any;
};

type PropsType = MapStateToPropsType & MapDispatchPropsType & OwnPropsType;

class App extends React.Component<PropsType> {
  constructor(props: PropsType) {
    super(props);
    loadMessages(ruMessages);
    locale(navigator.language);
  }

  componentDidMount = () => {
    if (!cookie.get("uuid")) cookie.set("uuid", uuidv4(), { expires: 365 });
  };

  render() {
    return (
      <Router history={history}>
        <Switch>
          {AppRoutes.map((route: AppRoute) => (
            <Route
              exact={route.exact}
              path={route.path}
              component={route.component}
              key={route.path}
            />
          ))}
        </Switch>
        {cookie.get("acceptCookies") !== "true" ? (
          <AcceptCookies acceptCookies={this.props.acceptCookies} />
        ) : null}
      </Router>
    );
  }
}

const mapStateToProps = (state: AppStateType) => ({
  token: state.auth.token,
  isCookiesAccepted: state.app.isCookiesAccepted,
});

export default compose(
  connect<
    MapStateToPropsType,
    MapDispatchPropsType,
    OwnPropsType,
    AppStateType
  >(mapStateToProps, { acceptCookies: acceptCookies })
)(App);
