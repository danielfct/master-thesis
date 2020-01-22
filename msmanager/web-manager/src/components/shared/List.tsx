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

import * as React from 'react';
import {Fragment} from 'react';
import {connect} from 'react-redux';
import FilteredList from './FilteredList';

import "./List.css"
import {bindActionCreators} from "redux";
import {getData} from "../../utils/data";

interface ListProps<T> {
    url: string;
    show: (element: T) => JSX.Element;
    predicate: (element: T, filter: string) => boolean;
}

interface StateToProps<T> {
    list: T[],
    fetchError: TypeError,
}

interface DispatchToProps {
    actions: { getData: (url: string) => void },
}

type Props<T> = ListProps<T> & StateToProps<T> & DispatchToProps;

class GenericList<T> extends React.Component<Props<T>, {}> {

    public componentDidMount = () =>
        this.props.actions.getData(this.props.url);

    public render() {
        const FilteredCardsList = FilteredList<T>();
        return (
            this.props.fetchError ?
                <p>{this.props.fetchError.message}</p> : /*TODO improve error message/display*/
                <Fragment>
                    <FilteredCardsList
                        list={this.props.list || []}
                        show={this.props.show}
                        predicate={this.props.predicate}/>
                </Fragment>
        );
    }
}

const mapStateToProps = (state: any): StateToProps<any> => ( //TODO change from any to specific type
    {
        list: state.items.data,
        fetchError: state.items.fetchError,
    }
);

const mapDispatchToProps = (dispatch: any): DispatchToProps => (
    {
        actions: bindActionCreators({ getData }, dispatch),
    }
);

export default function List<T>() {
    return connect<StateToProps<T>, DispatchToProps>(mapStateToProps, mapDispatchToProps)(GenericList as
        new(props: Props<T>) => GenericList<T>)
}