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

let $ = require('jquery');
let React = require('react');
let Component = React.Component;
import Utils from './utils';
import {MainLayout} from './globalComponents';


class EdgeHostCard extends Component {

    constructor(props) {
        super(props);
        let edgeHost = this.props.edgeHost;
        edgeHost.local = edgeHost.local ? "true" : "false";
        let defaultIsEdit = this.props.edgeHost.id === 0;
        this.state = { data: edgeHost, loading: false, isEdit: defaultIsEdit };
    }

    componentDidMount() {
        M.FormSelect.init(document.querySelectorAll('select'));
    }

    componentDidUpdate() {
        M.updateTextFields();
        M.FormSelect.init(document.querySelectorAll('select'));
    }

    onClickEdit = () => {
        let setEdit = !this.state.isEdit;
        if (!setEdit && this.state.data.id === 0) {
            this.props.updateNewEdgeHost(true);
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
        let formId = this.state.data.id + 'edgeHostForm';
        let formAction = '/hosts/edge/' + this.state.data.id;
        let formData = Utils.convertFormToJson(formId);
        let self = this;
        Utils.formSubmit(formAction, 'POST', formData, function (data) {
            let newData = self.state.data;
            let oldId = newData.id;
            newData.id = data;           
            if (oldId === 0) {
                self.props.updateNewEdgeHost(false);               
            }
            self.setState({isEdit: false});
            M.toast({html: "<div>Edge host saved successfully!</div>"});
        });
    };

    onClickRemove() {
        let formAction = '/hosts/edge/' + this.state.data.id;
        let self = this;
        Utils.formSubmit(formAction, 'DELETE', {}, function (data) {
            M.toast({html: "<div>Edge host deleted successfully!</div>"});
            self.props.onRemove();
        });
    }

    renderNormal = () => {
        return (
            <div>
                <div>
                    <h5>Hostname</h5>
                    <div>{this.state.data.hostname}</div>
                </div>
                <div>
                    <h5>SSH username</h5>
                    <div>{this.state.data.sshUsername}</div>
                </div>
                <div>
                    <h5>SSH password (Base64)</h5>
                    <div>{this.state.data.sshPassword}</div>
                </div>
                <div>
                    <h5>Region</h5>
                    <div>{this.state.data.region}</div>
                </div>
                <div>
                    <h5>Country</h5>
                    <div>{this.state.data.country}</div>
                </div>
                <div>
                    <h5>City</h5>
                    <div>{this.state.data.city}</div>
                </div>
                <div>
                    <h5>Is local</h5>
                    <div>{this.state.data.local}</div>
                </div>
            </div>
        );
    };

    renderForm = () => {
        return ( 
            <form id={this.state.data.id + 'edgeHostForm'} onSubmit={this.onSubmitForm}>
                <div className="input-field">
                    <input onChange={this.handleChange} defaultValue={this.state.data.hostname} name='hostname' id={this.state.data.id + 'hostname'} type="text" autoComplete="off"/>
                    <label htmlFor={this.state.data.id + 'hostname'}>Hostname</label>
                </div>
                <div className="input-field">
                    <input onChange={this.handleChange} defaultValue={this.state.data.sshUsername} name='sshUsername' id={this.state.data.id + 'sshUsername'} type="text" autoComplete="off"/>
                    <label htmlFor={this.state.data.id + 'sshUsername'}>SSH username</label>
                </div>
                <div className="input-field">
                    <input onChange={this.handleChange} defaultValue={this.state.data.sshPassword} name='sshPassword' id={this.state.data.id + 'sshPassword'} type="text" autoComplete="off"/>
                    <label htmlFor={this.state.data.id + 'sshPassword'}>SSH password (Base64)</label>
                </div>
                <div className="input-field">
                    <input onChange={this.handleChange} defaultValue={this.state.data.region} name='region' id={this.state.data.id + 'region'} type="text" autoComplete="off"/>
                    <label htmlFor={this.state.data.id + 'region'}>Region</label>
                </div>
                <div className="input-field">
                    <input onChange={this.handleChange} defaultValue={this.state.data.country} name='country' id={this.state.data.id + 'country'} type="text" autoComplete="off"/>
                    <label htmlFor={this.state.data.id + 'country'}>Country</label>
                </div>
                <div className="input-field">
                    <input onChange={this.handleChange} defaultValue={this.state.data.city} name='city' id={this.state.data.id + 'city'} type="text" autoComplete="off"/>
                    <label htmlFor={this.state.data.id + 'city'}>City</label>
                </div>
                <div className="input-field">
                    <select onChange={this.handleChange} defaultValue={this.state.data.local} name="local" id={this.state.data.id + 'local'}>
                        <option value="" disabled="disabled">Choose is local</option>
                        <option value='true'>True</option>
                        <option value='false'>False</option>
                    </select>
                    <label htmlFor={this.state.data.id + 'local'}>Is local</label>
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
            <div id={'edgehost' + this.props.index} className='row'>
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


export class EdgeHosts extends Component {

    constructor(props) {
        super(props);
        this.state = { data: [], loading: false, showAdd: true };
    }

    componentDidUpdate() {
        if (this.state.data.length > 0) {
            let lastIndex = this.state.data.length - 1;
            if(this.state.data[lastIndex].id === 0) {
                let offset = $('#edgehost' + lastIndex).offset().top;
                $(window).scrollTop(offset);
                this.state.tooltipInstances[0].destroy();
            }
        }
    }

    componentDidMount() {
        this.loadHosts();
        let instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }

    componentWillUnmount() {
        this.state.tooltipInstances[0].destroy();
    }

    updateNewEdgeHost = (isCancel) => {
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

    addEdgeHost() {
        let newEdgeHost = {
            id: 0, hostname: '', sshUsername: '', sshPassword: '',
            region: '', country: '', city: '', local: ''
        };
        let newData = this.state.data;
        newData.push(newEdgeHost);        
        this.setState({data: newData, showAdd: false});
    }

    loadHosts() {
        this.setState({ loading: true });  
        let self = this;
        Utils.ajaxGet('/hosts/edge',
            function (data) {
                self.setState({data: data, loading: false});
            });
    }

    render() {
        let edgeHostsNodes;
        let self = this;
        if (this.state.data) {
            edgeHostsNodes = this.state.data.map(function (edgeHost, index) {
                return (
                    <EdgeHostCard key={index} index={index} edgeHost={edgeHost} updateNewEdgeHost={self.updateNewEdgeHost} onRemove={self.loadHosts}/>
                );
            });
        }
        return (
            <MainLayout title='Edge hosts'>
                {edgeHostsNodes}                
                <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="Add edge host">
                    <button disabled={!this.state.showAdd} className="waves-effect waves-light btn-floating btn-large grey darken-4" onClick={this.addEdgeHost}>
                        <i className="large material-icons">add</i>
                    </button>
                </div>
            </MainLayout>            
        );
    }
}
