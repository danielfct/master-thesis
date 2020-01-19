import * as React from "react";
import {Pager} from "react-bootstrap";
import SimpleList from './SimpleList';

export interface IPagedList<T> {
    list: T[];
    select: (x: T) => void;
    show: (x: T) => JSX.Element;
    page?: number;
    pagesize?: number;
}

export class PagedList<T> extends React.Component<IPagedList<T>, { page?: number, pagesize?: number }> {
    private max: number = 0;

    constructor(props: IPagedList<T>) {
        super(props);

        this.state = {
            page: props.page,
            pagesize: props.pagesize,
        };

        this.max = Math.ceil(props.list.length / (props.pagesize || 1)) - 1;
    }

    public render() {
        const {list: l, select, show} = this.props;
        const {page = 0, pagesize = l.length} = this.state;
        const list = l.slice(page * pagesize, page * pagesize + pagesize);

        return (
            <div>
                {<SimpleList {...{list, show, select}} />}
                <Pager>
                    <Pager.Item previous={true} href="#" onClick={this.prevPage}>
                        &larr; Página anterior
                    </Pager.Item>

                    <span>{page + 1}</span>

                    <Pager.Item next={true} href="#" onClick={this.nextPage}>
                        Página seguinte &rarr;
                    </Pager.Item>
                </Pager>
            </div>
       );
    }

    private prevPage = () => {
        this.max = Math.max(0, Math.ceil(this.props.list.length / (this.state.pagesize || 1)) - 1);
        this.setState((st) => ({page: ((st.page === undefined) ? 0 : Math.max(0, st.page - 1))}));
    };
    private nextPage = () => {
        this.max = Math.max(0, Math.ceil(this.props.list.length / (this.state.pagesize || 1)) - 1);
        console.log(this.max);
        this.setState((st) => ({page: ((st.page === undefined) ? 0 : Math.min(this.max, st.page + 1))}));
    };
}
