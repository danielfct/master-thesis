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

import React from "react";
import {connect} from "react-redux";
import {PagedList} from "./PagedList";
import SimpleList from "./SimpleList";

interface Props<T> {
    /*    isFetching: boolean;
        loadingLabel: string;*/
    list: T[];
    show: (x: T) => JSX.Element;
    predicate: (x: T,s: string) => boolean;
    search: string;
    page?: number;
    pagesize?: number;
}

class GenericFilteredList<T> extends React.Component<Props<T>, any> {
    public render() {
        const {predicate, search, page, pagesize, ...otherprops} = this.props;
        let {list} = this.props;
        list = list.filter((s:T) => predicate(s, search));
        return page || pagesize
            ? <PagedList {...otherprops}
                         {...{list, page, pagesize}}/>
            : <SimpleList {...otherprops}
                          {...{list}}/>
    }
}

const mapStateToProps = (state: any) => (
    {
        search: state.ui.search
    }
);

export default function FilteredList<T>() {
    return connect(mapStateToProps)(GenericFilteredList as new(props: Props<T>) => GenericFilteredList<T>);
}