import React, { Component } from 'react'
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { ROUTE_HOME } from '../../constants/appRoutes';
import { IEduMenu } from '../../entities/Menu';

type PropsType = {
    menu: IEduMenu[]
    code: string
}

export default class BreadcrumbsEdu extends Component<PropsType> {
    
    getRoutes = (code: string) => {
        let routes: any[] = []
        const item = this.props.menu.find(m => m.code === code)

        if (item) {
            routes.push({path: item.url, breadcrumbName: item.name})

            if (item.parent_code) {
                routes = routes.concat(this.getRoutes(item.parent_code))
            }
        }

        return routes
    }
    
    render() {
        let routes: any[] = []

        routes = this.getRoutes(this.props.code)
        routes.push({path: ROUTE_HOME, breadcrumbName: 'Главная'})
        routes.reverse()

        function itemRender(route:any , params:any, routes:any, paths:any) {
            const last = routes.indexOf(route) === routes.length - 1;
            return last ? (
                <span>{route.breadcrumbName}</span>
            ) : (
                <Link to={route.path}>{route.breadcrumbName}</Link>
            );
        }
          
          return <Breadcrumb itemRender={itemRender} routes={routes} className='m-b-10' />;
    }
}
