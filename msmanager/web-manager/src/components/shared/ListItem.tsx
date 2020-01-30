import React from "react";
import './ListItem.css'
import {Link} from "react-router-dom";

interface ListItemProps<T> {
    link?: { pathname: string, state: any };
}

export default class ListItem<T> extends React.Component<ListItemProps<T>,{}> {

    public render = () => {
        const {link} = this.props;
        if (link) {
            return <Link to={{
                pathname: link.pathname,
                state: link.state}}>
                <div className="list-item">
                    {this.props.children}
                </div>
            </Link>;

        }
        else {
            return <div className="list-item">
                {this.props.children}
                <div>
                    oke
                </div>
            </div>;
        }

    }
}