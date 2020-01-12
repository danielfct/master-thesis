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


import React from "react";
import $ from "jquery";
import Utils from '../utils';
import {CardItem, MainLayout} from '../globalComponents';
let Component = React.Component;

class RegionCard extends Component {

    constructor(props) {
        super(props);
        let region = this.props.region;
        region.active = region.active ? "true" : "false";
        let defaultIsEdit = this.props.region.id == 0;
        this.state = {data: region, loading: false, isEdit: defaultIsEdit};
    }

    componentDidMount() {
        M.FormSelect.init(document.querySelectorAll('select'));
    }
    componentDidUpdate(){
        M.updateTextFields();
        M.FormSelect.init(document.querySelectorAll('select'));
    }

    onClickEdit () {
        let setEdit = !this.state.isEdit;
        if (!setEdit && this.state.data.id === 0) {
            this.props.updateNewRegion(true);
        }
        this.setState({isEdit: setEdit});
    };

    handleChange = (event) => {
        let name = event.target.name ;
        let newData = this.state.data;
        newData[name] = event.target.value;
        this.setState({data: newData});
    };

    onSubmitForm = (event) => {
        event.preventDefault();
        let formId = this.state.data.id + 'regionForm';
        let formAction = '/regions/'+ this.state.data.id;
        let formData = Utils.convertFormToJson(formId);
        let self = this;
        Utils.formSubmit(formAction, 'POST', formData, function (data) {
            let newData = self.state.data;
            let oldId = newData.id;
            newData.id = data;           
            if (oldId == 0) {
                self.props.updateNewRegion(false);               
            }
            self.setState({isEdit: false});
            M.toast({html: "<div>Region saved successfully!</div>"});
        });
    };

    onClickRemove () {
        let formAction = '/regions/'+ this.state.data.id;
        let self = this;
        Utils.formSubmit(formAction, 'DELETE', {}, function (data) {            
            M.toast({html: "<div>Region deleted successfully!</div>"});
            self.props.onRemove();
        });
    };

    renderNormal () {
        return (
            <div>
                <CardItem label='Region name' value={this.state.data.regionName}/>
                <CardItem label='Region description' value={this.state.data.regionDescription}/>
                <CardItem label='Is active' value={this.state.data.active}/>
            </div>
        );
    };

    renderForm () {
        return ( 
            <form id={this.state.data.id + 'regionForm'} onSubmit={this.onSubmitForm}>
                <div className="input-field">
                    <input onChange={this.handleChange} defaultValue={this.state.data.regionName} name='regionName' id={this.state.data.id + 'regionName'} type="text" autoComplete="off"/>
                    <label htmlFor={this.state.data.id + 'regionName'}>Region name</label>
                </div>
                <div className="input-field">
                    <input onChange={this.handleChange} defaultValue={this.state.data.regionDescription} name='regionDescription' id={this.state.data.id + 'regionDescription'} type="text" autoComplete="off"/>
                    <label htmlFor={this.state.data.id + 'regionDescription'}>Region description</label>
                </div>                
                <div className="input-field">
                    <select onChange={this.handleChange} defaultValue={this.state.data.active} name="active" id={this.state.data.id + 'active'}>
                        <option value="" disabled="disabled">Choose active</option>
                        <option value='true'>True</option>
                        <option value='false'>False</option>
                    </select>
                    <label htmlFor={this.state.data.id + 'active'}>Active</label>
                </div>
                <button className="btn waves-effect waves-light" type="submit" name="action">
                    Save
                    <i className="material-icons right">send</i>
                </button>
            </form>
        );
    };

    render() {        
        let nodes = this.state.isEdit ? this.renderForm() : this.renderNormal();
        let style = {marginLeft: '5px'};
        return (
            <div id={'region' + this.props.index} className='row'>
                <div className='col s12'>
                    <div className='card'>
                        <div className='card-content'>
                            <div className="right-align">
                                <a className="waves-effect waves-light btn-small" onClick={this.onClickEdit}>{this.state.isEdit ? 'Cancel' : 'Edit'}</a>
                                <a disabled={this.state.data.id === 0} style={style} className="waves-effect waves-light btn-small red darken-4" onClick={this.onClickRemove}>Remove</a>
                            </div>
                            {nodes}
                        </div>                            
                    </div>
                </div>
            </div>
        );
    }
}

export class Regions extends Component {

    constructor(props) {
        super(props);
        this.state = { data: [], loading: false, showAdd: true };
    }

    componentDidUpdate() {
        if (this.state.data.length > 0) {
            let lastIndex = this.state.data.length - 1;
            if (this.state.data[lastIndex].id === 0) {
                let offset = $('#region' + lastIndex).offset().top;
                $(window).scrollTop(offset);
                this.state.tooltipInstances[0].destroy();
            }
        }
    }

    componentDidMount() {
        this.loadRegions();
        let instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }

    componentWillUnmount() {
        this.state.tooltipInstances[0].destroy();
    }

    updateNewRegion = (isCancel) => {
        let newData = this.state.data;
        if (isCancel) {
            newData.splice(newData.length - 1, 1);
            this.setState({data: newData, showAdd: true});
        }            
        else {
            this.setState({showAdd: true});
        }
        let instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    };

    addRegion () {
        let newRegion = {
            id: 0, regionName: '', regionDescription: '', active: ''
        };
        let newData = this.state.data;
        newData.push(newRegion);        
        this.setState({data: newData, showAdd: false});
    };

    loadRegions = ()=> {
        this.setState({ loading: true });
        let self = this;
        Utils.ajaxGet('/regions',
            function (data) {
                self.setState({data: data, loading: false});
            });
    };

    render() {
        let regionNodes;
        let self = this;
        if (this.state.data) {
            regionNodes = this.state.data.map(function (region, index) {
                return (
                    <RegionCard key={index} index={index} region={region} updateNewRegion={self.updateNewRegion} onRemove={self.loadRegions}/>
                );
            });
        }
        return (
            <MainLayout title='Regions'>
                {regionNodes}                
                <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="Add region">
                    <button disabled={!this.state.showAdd} className="waves-effect waves-light btn-floating btn-large grey darken-4" onClick={this.addRegion}>
                        <i className="large material-icons">add</i>
                    </button>
                </div>
            </MainLayout>            
        );
    }
}
