/*
 * MIT License
 *
 * Copyright (c) 2020 micro-manager
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

import React from 'react';
import { Link } from 'react-router-dom';
import CardItem from '../shared/CardItem';
import {camelCaseToSentenceCase} from "../../utils/text";
import './ServiceCard.css';
import PerfectScrollbar from "react-perfect-scrollbar";
import IService from "./IService";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {itemSelection} from "../../redux/reducers/items";

interface DispatchToProps {
    actions: { itemSelection: (item: IService) => void },
}

interface ServiceCardProps {
    service: IService;
}

type Props = DispatchToProps & ServiceCardProps;

class ServiceCard extends React.Component<Props, {}> {

    private handleOnClick = () =>
        this.props.actions.itemSelection(this.props.service);

    public render = () =>
        <div className='col s4'>
            <div className='card grid-card'>
                <PerfectScrollbar>
                    <Link to={`/services/service/${this.props.service.id}`} onClick={this.handleOnClick}>
                        <div className='card-content'>
                            {Object.entries(this.props.service)
                                .filter(([key, _]) => key !== 'id')
                                .map(([key, value]) => <CardItem label={camelCaseToSentenceCase(key)} value={value}/>)
                            }
                        </div>
                    </Link>
                </PerfectScrollbar>
            </div>
        </div>;
}

const mapDispatchToProps = (dispatch: any): DispatchToProps => (
    {
        actions: bindActionCreators({ itemSelection }, dispatch),
    }
);

export default connect(null, mapDispatchToProps)(ServiceCard);