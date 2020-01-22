import {Link} from "react-router-dom";
import React from "react";
import "./AddButton.css";

interface Props {
    tooltip: string,
    link: string,
}

export default class AddButton extends React.Component<Props, {}> {
    render = () =>
        <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip={this.props.tooltip}>
            <Link className="waves-effect waves-light btn-floating grey darken-3"
                  to={this.props.link}>
                <i className="large material-icons">add</i> {/*TODO fix tooltip*/}
            </Link>
        </div>
}


