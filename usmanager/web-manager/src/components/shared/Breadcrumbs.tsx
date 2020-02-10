/*
 * MIT License
 *
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React from "react";
import {Link, RouteComponentProps, RouteProps, withRouter} from "react-router-dom";
import './Breadcrumbs.css';
import {ReduxState} from "../../reducers";
import {bindActionCreators} from "redux";
import {updateBreadcrumbs} from "../../actions";
import {connect} from "react-redux";
import {RouterProps} from "react-router";
import {authenticatedRoutes} from "../../containers/Root.dev";
import {camelCaseToSentenceCase, capitalize} from "../../utils/text";

export type IBreadcrumb = { title: string, link?: string };

export type IBreadcrumbs = IBreadcrumb[];

interface StateToProps {
    breadcrumbs: IBreadcrumbs;
}

interface DispatchToProps {
    updateBreadcrumbs: (breadcrumbs: IBreadcrumbs) => void;
}

interface BreadcrumbsProps {
    /*breadcrumb: {title: string, link?: string, build?: boolean};*/
}

interface State {
    breadcrumbs: IBreadcrumbs;
}

type Props = StateToProps & DispatchToProps & BreadcrumbsProps & RouteProps & RouteComponentProps;


const breadcrumbs = (props: Props): IBreadcrumbs => {
    let path = props.location && props.location.pathname || '';
    if (path !== '/' && path.endsWith('/')) {
        path = path.substr(0, path.length-1); // remove the extra '/' at the end
    }
    let links = [];
    while (path.length) {
        links.push(path);
        path = path.replace(path.substring(path.lastIndexOf('/'), path.length), '');
    }
    links = links.reverse();
    const breadcrumbs = links.map(link => {
        let path = link;
        let url = props.match.url;
        if (url.endsWith('/')) {
            url = url.substr(0, url.length-1);
        }
        if (path === url) {
            path = path.replace(path, props.match.path);
        }
        if (path.indexOf('#') !== -1) {
            path = path.substring(0, path.indexOf('#'));
        }
        if (path.startsWith('//')) {
            path = path.substring(1);
        }
        let title = authenticatedRoutes[path].title;
        if (!title) {
            title = capitalize(link.substring(link.lastIndexOf('/') + 1));
            if (title.indexOf('#') !== -1) {
                title = title.substring(0, title.indexOf('#'));
            }
        }
        return {
            title,
            link,
        }
    });
   // console.log(breadcrumbs)
    return breadcrumbs;
};

class Breadcrumbs extends React.Component<Props, State> {

    constructor(props:Props) {
        super(props);
        this.state = { breadcrumbs: breadcrumbs(props) };
    }

    public render = () => {
        return <div>
            {this.state.breadcrumbs.map(({title, link}, index) =>
                link && index !== this.state.breadcrumbs.length - 1
                    ? <Link key={index} className="breadcrumb white-text" to={link}>{title}</Link>
                    : <span key={index} className="breadcrumb white-text">{title}</span>
            )}
        </div>
    }

}

const mapStateToProps = (state: ReduxState): StateToProps => (
    {
        breadcrumbs: state.ui.breadcrumbs,
    }
);

const mapDispatchToProps = (dispatch: any): DispatchToProps =>
    bindActionCreators({ updateBreadcrumbs }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs));