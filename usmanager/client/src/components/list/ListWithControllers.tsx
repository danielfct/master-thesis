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
import { Fragment } from 'react';
import { connect } from 'react-redux';
import { itemsFetchData, itemSelected } from '../../actions/items';
import { FilteredList } from './FilteredList';

import {Button} from 'react-bootstrap';
import { ClipLoader } from 'react-spinners';

import "./ListWithControllers.css"

export interface IItemProps {
    items: any[];
    isLoading: boolean;
    hasErrored: boolean;
    fetchData: (url: string, embeddedArray: string) => void;
    selectItem: (item: any) => void;
    itemSelected: any;
    handleAdd: () => void;
    handleUpdate: () => void;
    handleDelete: () => void;
    show: (s: any) => JSX.Element;
    predicate: (x:any,s:string) => boolean
    fetchFrom: string;
    embeddedArray: string;
}

class ListWithControllers extends React.Component<IItemProps,any> {

    componentDidMount(): void {
        this.props.fetchData(this.props.fetchFrom, this.props.embeddedArray);
    }

    render() {
        if (this.props.hasErrored) {
            return <p>Oops! Houve um erro ao carregar os dados.</p>;
        }
        if (this.props.isLoading) {
            return <ClipLoader/>;
        }
        return (
            <Fragment>
                <Button className="addButton" onClick={this.props.handleAdd}>Adicionar</Button>
                <FilteredList<any>
                    list={this.props.items}
                    show={this.props.show}
                    select={this.props.selectItem}
                    predicate={this.props.predicate}
                />
            </Fragment>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        items: state.items,
        hasErrored: state.itemsHasErrored,
        isLoading: state.itemsIsLoading,
        itemSelected: state.itemSelected,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        fetchData: (url: string, embeddedArray: string) => dispatch(itemsFetchData(url, embeddedArray)),
        selectItem: (item: any) => dispatch(itemSelected(item))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListWithControllers);
