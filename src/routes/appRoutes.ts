import Home from "../components/Home/Home";
import { ROUTE_HOME } from "../constants/appRoutes";

export interface AppRoute {
    path: string,
    component: any,
    exact: boolean
}

export const AppRoutes: AppRoute[] = [
    {
        path: ROUTE_HOME,
        component: Home,
        exact: true
    }
]