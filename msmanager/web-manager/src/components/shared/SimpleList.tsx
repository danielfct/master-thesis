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
import {ReduxState} from "../../reducers";
import {connect} from "react-redux";

interface StateToProps {
    isLoading: boolean;
}

interface GenericSimpleListProps<T> {
    empty: string | (() => JSX.Element);
    list: T[];
    show: (element: T) => JSX.Element;
}

type Props<T> = StateToProps & GenericSimpleListProps<T>;

class GenericSimpleList<T> extends React.Component<Props<T>, {}> {
    public render = () => {
        const {empty, isLoading, list, show} = this.props;
        const isEmpty = list.length === 0;
        if (isEmpty && isLoading) {
            return <div className="center-horizontal">
                <div className="center-vertical">
                <div className="preloader-wrapper active">
                    <div className="spinner-layer spinner-red-only">
                        <div className="circle-clipper left">
                            <div className="circle"/>
                        </div>
                        <div className="gap-patch">
                            <div className="circle"/>
                        </div>
                        <div className="circle-clipper right">
                            <div className="circle"/>
                        </div>
                    </div>
                </div>
                </div>
            </div>;
        }
        if (isEmpty) {
            return typeof empty === 'string' ? <h1><i>{empty}</i></h1> : <div>{empty()}</div>;
        }
        return (
            <div>
                {list.map((c, i) => (
                    <div key={i}>
                        {show(c)}
                    </div>
                ))}
            </div>);
    }
}

const mapStateToProps = (state: ReduxState): StateToProps => (
    {
        isLoading: state.ui.loading
    }
);

export default function SimpleList<T>() {
    return connect(mapStateToProps)(GenericSimpleList as new(props: Props<T>) => GenericSimpleList<T>);
}
