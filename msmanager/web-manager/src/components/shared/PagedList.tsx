/*
 * MIT License
 *
 * Copyright (c) 2020 msmanager
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

import * as React from "react";
import SimpleList from './SimpleList';

export interface IPagedList<T> {
    list: T[];
   // select: (x: T) => void;
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
        const {list: l, /*select,*/ show} = this.props;
        const {page = 0, pagesize = l.length} = this.state;
        const list = l.slice(page * pagesize, page * pagesize + pagesize);

        return (
            <div>
              {/*  {<SimpleList {...{list, show, select}} />}*/}
                {<SimpleList {...{list, show}} />}
                {/*<Pager>
                    <Pager.Item previous={true} href="#" onClick={this.prevPage}>
                        &larr; Página anterior
                    </Pager.Item>

                    <span>{page + 1}</span>

                    <Pager.Item next={true} href="#" onClick={this.nextPage}>
                        Página seguinte &rarr;
                    </Pager.Item>
                </Pager>*/}
            </div>
       );
    }

    private prevPage = () => {
        this.max = Math.max(0, Math.ceil(this.props.list.length / (this.state.pagesize || 1)) - 1);
        this.setState((st) => ({page: ((st.page === undefined) ? 0 : Math.max(0, st.page - 1))}));
    };
    private nextPage = () => {
        this.max = Math.max(0, Math.ceil(this.props.list.length / (this.state.pagesize || 1)) - 1);
        this.setState((st) => ({page: ((st.page === undefined) ? 0 : Math.min(this.max, st.page + 1))}));
    };
}
