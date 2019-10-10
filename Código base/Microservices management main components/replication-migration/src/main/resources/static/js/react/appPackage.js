var $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const Component = React.Component;
import Utils from './utils';
import {MainLayout, CardItem} from './globalComponents';
import {ServiceConfigCard} from './serviceConfig';


/* Apps */
class AppPackageCard extends Component {
    constructor(props) {
        super(props); 
        var propAppPackage =  this.props.appPackage;
        var defaultEdit =  propAppPackage.id == 0;     
        this.state = { isLaunchActive: false, appPackage: propAppPackage, data: [], availableRegions: [], regionSelected: '', countrySelected:'', citySelected:'', loading: false, isEdit: defaultEdit};
        this.loadAppServices = this.loadAppServices.bind(this);
        this.onClickEdit = this.onClickEdit.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onClickRemove = this.onClickRemove.bind(this);
        this.onLaunchApp = this.onLaunchApp.bind(this);
        this.loadRegions = this.loadRegions.bind(this);
        this.renderRegionsSelect = this.renderRegionsSelect.bind(this);
        this.onClickLaunch = this.onClickLaunch.bind(this);
        this.onClickCancelLaunch = this.onClickCancelLaunch.bind(this);
        this.renderRegionsSelectTotal = this.renderRegionsSelectTotal.bind(this);
        this.handleChangeRegion = this.handleChangeRegion.bind(this);
        this.handleChangeCountry = this.handleChangeCountry.bind(this);
        this.handleChangeCity = this.handleChangeCity.bind(this);
    }
    loadRegions() {
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/regions',           
            function (data) {              
                self.setState({availableRegions: data, loading: false});
            });
    }       
    loadAppServices(){
        this.setState({ loading: true });
        var self = this;
        var url = '/api/apps/' + this.state.appPackage.id + '/services'
        Utils.ajaxGet(url, function(data){
            var appServices = data;                
            self.setState({data: appServices, loading: false});
        });
    }
    componentDidMount(){
        this.loadAppServices();
    }
    componentDidUpdate(){
        M.updateTextFields();
        M.Collapsible.init(document.querySelectorAll('.collapsible'));
        if(this.state.isLaunchActive){
            var elems = this.region;
            M.FormSelect.init(elems);
        }        
    }
    handleChangeRegion(event) {
        this.setState({regionSelected: event.target.value});
    }
    handleChangeCountry(event) {
        this.setState({countrySelected: event.target.value});
    }
    handleChangeCity(event) {
        this.setState({citySelected: event.target.value});
    }
    renderRegionsSelect() {
        var regions;
        if (this.state.availableRegions) {
            regions = this.state.availableRegions.map(function (region) {
                return (
                    <option key={region.regionName} value={region.regionName}>{region.regionName + ' (' + region.regionDescription + ')'}</option>
                );
            });
            return regions;
        }
    }
    renderRegionsSelectTotal(){
        return (
            <div className="input-field col s6">
                <select ref={ region => this.region = region} defaultValue="" name="region" id="region" onChange={this.handleChangeRegion} >
                    <option value="" disabled="disabled">Choose region</option>
                    {this.renderRegionsSelect()}
                </select>
                <label htmlFor="Region">Region</label>
            </div>
        )
    }
    renderNormal(){
        return (
            <div>
                <h5>App name</h5>
                <div>{this.state.appPackage.appName}</div>
            </div> 
        );       
    }
    onClickLaunch() {
        this.loadRegions();
        this.setState({ isLaunchActive: true });
    }
    onClickCancelLaunch(){
        var instance = M.FormSelect.getInstance(this.region);
        instance.destroy();
        this.setState({ isLaunchActive: false });
    }
    renderLaunchApp() {
        var style = { marginLeft: "10px" };
        var cancelButton = 
            <a title="Cancel" style={style} className="btn-floating waves-effect waves-light red darken-4" onClick={this.onClickCancelLaunch}>
                <i className="material-icons">clear</i>
            </a>;

        if(this.state.isLaunchActive) {
            return (
                <div>
                    <div className="row">
                        {this.renderRegionsSelectTotal()}
                        <div className="input-field col s6">
                            <input onChange={this.handleChangeCountry} defaultValue={this.state.countrySelected} name='country' id='country' type="text" autoComplete="off"/>
                            <label htmlFor="country">Country</label>
                        </div>
                    </div>
                    <div className="row">                    
                        <div className="input-field col s6">
                            <input onChange={this.handleChangeCity} defaultValue={this.state.citySelected} name='city' id='city' type="text" autoComplete="off"/>
                            <label htmlFor="city">City</label>
                        </div>
                        <div className="input-field col s6">
                            <a title="Launch App" style={style} className="btn-floating waves-effect waves-light" onClick={this.onLaunchApp}>
                                <i className="material-icons">send</i>
                            </a>
                            {cancelButton}
                        </div>
                    </div>
                </div>
            );
            
        }        
        else
            return (
                <div className="row">
                    <div className="col s12">
                        <button disabled={this.state.appPackage.id == 0} style={style} className="waves-effect waves-light btn-small" onClick={this.onClickLaunch}>
                            Launch
                        </button>
                    </div>
                </div>
            );
    }
    onClickEdit(){
        var setEdit = !this.state.isEdit;
        if(!setEdit && this.state.appPackage.id == 0) {
            this.props.updateNewApp(true);
        }
        this.setState({isEdit: setEdit});
    }
    onClickRemove() {
        var formAction = '/api/apps/'+ this.state.appPackage.id;
        var self = this;
        Utils.formSubmit(formAction, 'DELETE', {}, function (data) {            
            M.toast({html: "<div>App deleted successfully!</div>"});
            self.props.onRemove();
        });
    }
    onLaunchApp() {
        var formAction = '/api/launch/apps/'+ this.state.appPackage.id;
        var self = this;
        var dataToSend = JSON.stringify({
            region: self.state.regionSelected,
            country: self.state.countrySelected,
            city: self.state.citySelected
        });
        Utils.formSubmit(formAction, 'POST', dataToSend, function (data) {
            console.log(data);
            M.toast({
                html: "<div>App launched successfully!</div>",
                options: {displayLength: 10000}
            });
            self.onClickCancelLaunch();
        });
    }    
    handleChange(event) {
        var name = event.target.name;
        var newData = this.state.appPackage;
        newData[name] = event.target.value;
        this.setState({appPackage: newData});
    }
    onSubmitForm(e){
        e.preventDefault();
        var self = this;
        var formId = this.state.appPackage.id + 'appForm';
        var formAction = '/api/apps/'+ this.state.appPackage.id;
        var formMethod = 'POST';
        var formData = Utils.convertFormToJson(formId);     
        
        Utils.formSubmit(formAction, formMethod, formData, function (data) {
            var newData = self.state.appPackage;
            var oldId = newData.id;       
            newData.id = data;
            self.setState({appPackage: newData, isEdit: false});
            if(oldId == 0) {
                self.props.updateNewApp(false);               
            }
            M.toast({html: "<div>App saved successfully!</div>"});
        });
    }
    renderForm(){
        return (
            <form id={this.state.appPackage.id + 'appForm'} onSubmit={this.onSubmitForm}>           
                <div className="input-field">
                    <input value={this.state.appPackage.appName} onChange={this.handleChange} placeholder='App Name' name='appName' id={this.state.appPackage.id + 'appName'} type="text" autoComplete="off"/>
                    <label htmlFor={this.state.appPackage.id + 'hostname'}>App Name</label>
                </div>
                <button className="btn waves-effect waves-light" type="submit" name="action">
                    Save
                    <i className="material-icons right">send</i>
                </button>
            </form>
        );
    }        
    render() {
        var appServices;
        if (this.state.data) {
            appServices = this.state.data.map(function (appService) {
                return (
                    <li key={appService.serviceConfig.id} >
                        <div className="collapsible-header">{appService.serviceConfig.serviceName}</div>
                        <div className="collapsible-body">
                            <ServiceConfigCard renderSimple={true} serviceConfig={appService.serviceConfig}/>
                        </div>
                    </li>                    
                );
            });
        }
        var app = this.state.isEdit ? this.renderForm() : this.renderNormal();
        var style = {marginLeft: '5px'};
        return (
            <div id={'app' + this.props.index} className='row'>
                <div className='col s12'>
                    <div className='card'>
                        <div className='card-content'>
                            <div className="right-align">
                                {this.renderLaunchApp()}
                                <a style={style} className="waves-effect waves-light btn-small" onClick={this.onClickEdit}>{this.state.isEdit ? 'Cancel' : 'Edit'}</a>
                                <button disabled={this.state.appPackage.id == 0} style={style} className="waves-effect waves-light btn-small red darken-4" onClick={this.onClickRemove}>Remove</button>
                            </div>
                            {app}
                            <h5>Services</h5>
                            <ul className="collapsible">
                                {appServices} 
                            </ul>
                        </div>                            
                    </div>                    
                </div>
            </div>
        );
    }
}

export class AppPackages extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [], loading: false, showAdd: true };
        this.loadApps = this.loadApps.bind(this);
        this.updateNewApp = this.updateNewApp.bind(this);
        this.addApp = this.addApp.bind(this);
    }    
    loadApps(){
        this.setState({ loading: true });
        var self = this;
        Utils.ajaxGet('/api/apps',           
            function (data) {
                var appPackages = data;                
                self.setState({data: appPackages, loading: false});
            });
    }
    updateNewApp(isCancel) {
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
    addApp() {
        var newApp = {
            id: 0, appName: ''
        }
        var newData = this.state.data;
        newData.push(newApp);        
        this.setState({data: newData, showAdd: false});
    }
    componentDidMount() {
        this.loadApps();
        var instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }
    componentDidUpdate() {
        if(this.state.data.length > 0) {
            var lastIndex = this.state.data.length - 1;
            if(this.state.data[lastIndex].id === 0) {
                var offset = $('#app' + lastIndex).offset().top;
                $(window).scrollTop(offset);
                this.state.tooltipInstances[0].destroy();
            }
        }
    }    
    componentWillUnmount() {        
        this.state.tooltipInstances[0].destroy();
    }
    render() {
        var appPackagesNodes;
        var self = this;
        if (this.state.data) {
            appPackagesNodes = this.state.data.map(function (appPackage, index) {
                return (
                    <AppPackageCard key={appPackage.id} index={index} appPackage={appPackage} onRemove={self.loadApps} updateNewApp={self.updateNewApp}/>
                );
            });
        }
        return (
            <MainLayout title='App packages'>
                {appPackagesNodes}
                <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="Add app package">
                    <button disabled={!this.state.showAdd} className="waves-effect waves-light btn-floating btn-large grey darken-4" onClick={this.addApp}>
                        <i className="large material-icons">add</i>
                    </button>
                </div>
            </MainLayout>
        );
    }
}