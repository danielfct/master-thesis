import IService from "../services/IService";
import List from "./List";
import React from "react";

interface Props<T> {
    list: T[];
    card: (element: T) => JSX.Element;
    predicate: (element: T, filter: string) => boolean;
}

interface State {
    pagesize: number;
}

export default class CardList<T> extends React.Component<Props<T>, State> {

    constructor(props: Props<T>) {
        super(props);
        this.state = {
            pagesize: this.calcPagesize()
        }
    }

    public componentDidMount = () =>
        window.addEventListener('resize', this.handleResize);

    public componentWillUnmount = () =>
        window.removeEventListener('resize', this.handleResize);

    private handleResize = (_: Event) => {
        this.setState({pagesize: this.calcPagesize()})
    };

    private calcPagesize = () => {
        const width = window.innerWidth;
        if (width <= 600) {
            return 4;
        } else if (width <= 992) {
            return 6;
        } else {
            return 8;
        }
    };

    public render = () =>
        <List<T>
            list={this.props.list}
            show={this.props.card}
            predicate={this.props.predicate}
            pagesize={this.state.pagesize}/>
}