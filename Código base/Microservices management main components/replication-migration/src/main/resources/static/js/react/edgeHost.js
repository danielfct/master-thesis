var $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const Component = React.Component;
import Utils from './utils';
import {MainLayout, CardItem} from './globalComponents';


class EdgeHostCard extends Component {
    constructor(props) {
        super(props);
        var edgeHost = this.props.edgeHost;
        edgeHost.local = edgeHost.local ? "true" : "false";
        var defaultIsEdit = this.props.edgeHost.id == 0;
        this.state = { data: edgeHost, loading: false, isEdit: defaultIsEdit };
        this.onClickEdit = this.onClickEdit.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onClickRemove = this.onClickRemove.bind(this);
    }
    componentDidMount() {
        M.FormSelect.init(document.querySelectorAll('select'));
    }
    componentDidUpdate(){
        M.updateTextFields();
        M.FormSelect.init(document.querySelectorAll('select'));
    }
    onClickEdit(){
        var setEdit = !this.state.isEdit;
        if(!setEdit && this.state.data.id == 0) {
            this.props.updateNewEdgeHost(true);
        }
        this.setState({isEdit: setEdit});
    }
    handleChange(event) {
        var name = event.target.name ;
        var newData = this.state.data;
        newData[name] = event.target.value;
        this.setState({data: newData});
    }
    onSubmitForm(event){
        event.preventDefault();
        var formId = this.state.data.id + 'edgeHostForm';
        var formAction = '/api/edgehosts/'+ this.state.data.id;
        var formData = Utils.convertFormToJson(formId);     
        var self = this;
        Utils.formSubmit(formAction, 'POST', formData, function (data) {
            var newData = self.state.data;
            var oldId = newData.id;       
            newData.id = data;           
            if(oldId == 0) {
                self.props.updateNewEdgeHost(false);               
            }
            self.setState({isEdit: false});
            M.toast({html: "<div>Edge host saved successfully!</div>"});
        });
    }
    onClickRemove() {
        var formAction = '/api/edgehosts/'+ this.state.data.id; 
        var self = this;
        Utils.formSubmit(formAction, 'DELETE', {}, function (data) {            
            M.toast({html: "<div>Edge host deleted successfully!</div>"});
            self.props.onRemove();
        });
    }
    renderNormal(){        
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
    }
    renderForm(){
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
    }
    render() {        
        var nodes = this.state.isEdit ? this.renderForm() : this.renderNormal();
        var style = {marginLeft: '5px'};
        return (
            <div id={'edgehost' + this.props.index} className='row'>
                <div className='col s12'>
                    <div className='card'>
                        <div className='card-content'>
                            <div className="right-align">
                                <a className="waves-effect waves-light btn-small" onClick={this.onClickEdit}>{this.state.isEdit ? 'Cancel' : 'Edit'}</a>
                                <a disabled={this.state.data.id == 0} style={style} className="waves-effect waves-light btn-small red darken-4" onClick={this.onClickRemove}>Remove</a>
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
        this.addEdgeHost = this.addEdgeHost.bind(this);
        this.updateNewEdgeHost = this.updateNewEdgeHost.bind(this);
        this.loadHosts = this.loadHosts.bind(this);
    }
    updateNewEdgeHost(isCancel) {
        var newData = this.state.data;
        if (isCancel) {
            newData.splice(newData.length - 1, 1);
            this.setState({data: newData, showAdd: true});
        }            
        else {
            this.setState({showAdd: true});
        }
        var instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }
    addEdgeHost() {
        var newEdgeHost = {
            id: 0, hostname: '', sshUsername: '', sshPassword: '',
            region: '', country: '', city: '', local: ''
        }
        var newData = this.state.data;
        newData.push(newEdgeHost);        
        this.setState({data: newData, showAdd: false});
    }
    loadHosts(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/edgehosts',           
            function (data) {
                var edgeHosts = data;                
                self.setState({data: edgeHosts, loading: false});
            });
    }
    componentDidUpdate() {
        if(this.state.data.length > 0) {
            var lastIndex = this.state.data.length - 1;
            if(this.state.data[lastIndex].id === 0) {
                var offset = $('#edgehost' + lastIndex).offset().top;
                $(window).scrollTop(offset);
                this.state.tooltipInstances[0].destroy();
            }
        }
    }
    componentDidMount() {
        this.loadHosts();
        var instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }    
    componentWillUnmount() {        
        this.state.tooltipInstances[0].destroy();
    }
    render() {
        var edgeHostsNodes;
        var self = this;
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
