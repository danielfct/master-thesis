var $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const Component = React.Component;
import Utils from './utils';
import {MainLayout, CardItem} from './globalComponents';


class RegionCard extends Component {
    constructor(props) {
        super(props);
        var region = this.props.region;
        region.active = region.active ? "true" : "false";
        var defaultIsEdit = this.props.region.id == 0;
        this.state = { data: region, loading: false, isEdit: defaultIsEdit };
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
            this.props.updateNewRegion(true);
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
        var formId = this.state.data.id + 'regionForm';
        var formAction = '/api/regions/'+ this.state.data.id;
        var formData = Utils.convertFormToJson(formId);     
        var self = this;
        Utils.formSubmit(formAction, 'POST', formData, function (data) {
            var newData = self.state.data;
            var oldId = newData.id;       
            newData.id = data;           
            if(oldId == 0) {
                self.props.updateNewRegion(false);               
            }
            self.setState({isEdit: false});
            M.toast({html: "<div>Region saved successfully!</div>"});
        });
    }
    onClickRemove() {
        var formAction = '/api/regions/'+ this.state.data.id; 
        var self = this;
        Utils.formSubmit(formAction, 'DELETE', {}, function (data) {            
            M.toast({html: "<div>Region deleted successfully!</div>"});
            self.props.onRemove();
        });
    }
    renderNormal(){        
        return (
            <div>
                <CardItem label='Region name' value={this.state.data.regionName}/>
                <CardItem label='Region description' value={this.state.data.regionDescription}/>
                <CardItem label='Is active' value={this.state.data.active}/>
            </div>
        );
    }
    renderForm(){
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
    }
    render() {        
        var nodes = this.state.isEdit ? this.renderForm() : this.renderNormal();
        var style = {marginLeft: '5px'};
        return (
            <div id={'region' + this.props.index} className='row'>
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


export class Regions extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [], loading: false, showAdd: true };
        this.addRegion = this.addRegion.bind(this);
        this.updateNewRegion = this.updateNewRegion.bind(this);
        this.loadRegions = this.loadRegions.bind(this);
    }
    updateNewRegion(isCancel) {
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
    addRegion() {
        var newRegion = {
            id: 0, regionName: '', regionDescription: '', active: ''
        }
        var newData = this.state.data;
        newData.push(newRegion);        
        this.setState({data: newData, showAdd: false});
    }
    loadRegions(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/regions',           
            function (data) {
                var regions = data;                
                self.setState({data: regions, loading: false});
            });
    }
    componentDidUpdate() {
        if(this.state.data.length > 0) {
            var lastIndex = this.state.data.length - 1;
            if(this.state.data[lastIndex].id === 0) {
                var offset = $('#region' + lastIndex).offset().top;
                $(window).scrollTop(offset);
                this.state.tooltipInstances[0].destroy();
            }
        }
    }
    componentDidMount() {
        this.loadRegions();
        var instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }    
    componentWillUnmount() {        
        this.state.tooltipInstances[0].destroy();
    }
    render() {
        var regionNodes;
        var self = this;
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
