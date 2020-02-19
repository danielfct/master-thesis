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

import * as React from 'react';
import FilteredList from './FilteredList';
import {PagedList} from "./PagedList";
import SimpleList from "./SimpleList";
import LoadingSpinner from "./LoadingSpinner";
import Error from "./Error";

interface Props<T> {
    isLoading: boolean;
    error: string;
    emptyMessage: string;
    list: T[];
    show: (element: T) => JSX.Element;
    predicate?: (element: T, filter: string) => boolean;
    pagination?: { pagesize: number, page?: number, bottom?: boolean };
    useSeparator?: boolean | { color: string };
}

class GenericList<T> extends React.Component<Props<T>, {}> {

    render() {
        const {isLoading, error, predicate, pagination} = this.props;
        if (isLoading) {
            return <LoadingSpinner/>;
        }
        if (error) {
            return <Error message={error}/>;
        }
        if (predicate) {
            const Filtered = FilteredList<T>();
            return <Filtered {...this.props} predicate={predicate}/>;
        }
        if (pagination) {
            return <PagedList {...this.props} pagination={pagination}/>;
        }
        return <SimpleList<T> {...this.props}/>;
    }

}

export default function List<T>() {
    return (GenericList as new(props: Props<T>) => GenericList<T>);
}
