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

    public componentDidMount() {
        this.props.fetchData(this.props.fetchFrom, this.props.embeddedArray);
    }

    public render() {
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
