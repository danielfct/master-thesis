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
import { Fragment } from 'react';
import { connect } from 'react-redux';
import { resourceFetchData, itemSelected } from '../../redux/actions/items';
import { FilteredList } from './FilteredList';

import "./ListWithControllers.css"
import CardItem from "./CardItem";

export interface ICardProps {
    fetchData: (url: string) => void,
    fetchUrl: string,
    cards: CardItem[];
    fetchError: boolean;
    handleAdd: () => void;
    handleUpdate: () => void;
    handleDelete: () => void;
    selectCard: (item: CardItem) => void;
    cardSelected: any;
    show: (s: any) => JSX.Element;
    predicate: (x:any, s:string) => boolean
}

class CardsList extends React.Component<ICardProps,any> {

    public componentDidMount() {
        this.props.fetchData(this.props.fetchUrl);
    }

    public render() {
        if (this.props.fetchError) {
            return <p>Oops! Houve um erro ao carregar os dados.</p>; /*TODO improve error message/display*/
        }
        return (
            <Fragment>
                <FilteredList<any>
                    list={this.props.cards}
                    show={this.props.show}
                    select={this.props.selectCard}
                    predicate={this.props.predicate}
                />
            </Fragment>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        data: state.data,
        fetchError: state.fetchError,
        cardSelected: state.cardSelected,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        fetchData: (url: string) => dispatch(resourceFetchData(url)),
        selectItem: (item: any) => dispatch(itemSelected(item))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardsList);
