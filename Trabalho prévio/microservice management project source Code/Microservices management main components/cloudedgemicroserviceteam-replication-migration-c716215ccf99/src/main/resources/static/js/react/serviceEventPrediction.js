var $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const Component = React.Component;
const Redirect = require('react-router-dom').Redirect;
const Link = require('react-router-dom').Link;
import Utils from './utils';
import {MainLayout, CardItem} from './globalComponents';


class ServiceEventPredictionCard extends Component {
    constructor(props) {
        super(props);
        this.onClickRemove = this.onClickRemove.bind(this);
    }
    onClickRemove() {
        var action = '/api/serviceeventpredictions/' + this.props.serviceEvent.id;       
        var self = this;
        Utils.formSubmit(action, 'DELETE', {}, function (data) {
            M.toast({html: "<div>Service event prediction removed successfully!</div>"});
            self.props.reloadServiceEvents();
        });
    }
    render() {
        var startDate = new Date(this.props.serviceEvent.startDate).toLocaleString();
        var endDate = new Date(this.props.serviceEvent.endDate).toLocaleString();
        return (
            <div className='row'>
                <div className='col s12'>
                    <div className='card'>
                        <div className='card-content'>
                            <div className="right-align">                                
                                <div className="row">
                                    <div className="col s12">
                                        <button className="waves-effect waves-light btn-small red darken-4" onClick={this.onClickRemove}>Remove</button>
                                    </div>
                                </div>
                            </div>
                            <CardItem label='Description' value={this.props.serviceEvent.description}/>
                            <CardItem label='Service config' value={this.props.serviceEvent.serviceConfig.serviceName}/>
                            <CardItem label='Start date' value={startDate}/>
                            <CardItem label='End date' value={endDate}/>
                            <CardItem label='Minimum replics' value={this.props.serviceEvent.minReplics}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export class ServiceEventPredictions extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [], loading: false, showAdd: true };
        this.loadServiceEventPredictions = this.loadServiceEventPredictions.bind(this);
        this.renderServiceEvents = this.renderServiceEvents.bind(this);
    }
    loadServiceEventPredictions() {
        this.setState({ loading: true });
        var self = this;
        Utils.ajaxGet('/api/serviceeventpredictions',           
            function (data) {
                var serviceEvents = data;                
                self.setState({data: serviceEvents, loading: false});
            });
    }
    componentDidMount() {
        this.loadServiceEventPredictions();
        var instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
        this.setState({tooltipInstances: instances});
    }
    componentWillUnmount() {
        this.state.tooltipInstances[0].destroy();
    }
    renderServiceEvents() {
        var serviceEventsNodes;
        var self = this;
        if (this.state.data) {
            serviceEventsNodes = this.state.data.map(function (serviceEvent, index) {
                return (
                    <ServiceEventPredictionCard key={serviceEvent.id} serviceEvent={serviceEvent} reloadServiceEvents={self.loadServiceEventPredictions}/>
                );
            });
        }
        return serviceEventsNodes;
    }
    render() {
        return (
            <MainLayout title='Service event predictions'>
                {this.renderServiceEvents()}
                <div className="fixed-action-btn tooltipped" data-position="left" data-tooltip="Add service event prediction">
                    <Link className="waves-effect waves-light btn-floating btn-large grey darken-4" to='/ui/rules/serviceeventpredictions/detail'>
                        <i className="large material-icons">add</i>
                    </Link>
                </div>
            </MainLayout>
        );
    }
}


export class ServiceEventPredictionDetail extends Component {
    constructor(props) {
        super(props);
        var defaultId = 0;
        if(props.match.params.id){
            defaultId = props.match.params.id;
        }
        var defaultValues = {
            serviceId: '', description: '', startDate: '', startTime: '', 
            endDate: '', endTime: '', minReplics: ''
        }
        var thisBreadcrumbs = [ {link: '/ui/rules/serviceeventpredictions', title: 'Service event predictions'} ];    
        this.state = { id: defaultId, values: defaultValues, services: [], loading: false, formSubmit: false, breadcrumbs: thisBreadcrumbs};
        this.loadServiceConfigs = this.loadServiceConfigs.bind(this);
        this.loadServiceEventPrediction = this.loadServiceEventPrediction.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.renderServicesSelect = this.renderServicesSelect.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.renderForm = this.renderForm.bind(this);
        this.updateStateFromPicker = this.updateStateFromPicker.bind(this);
        this.addEventListenersPickers = this.addEventListenersPickers.bind(this);
    }
    loadServiceConfigs(){
        this.setState({ loading: true });  
        var self = this;
        var url = '/api/services';
        Utils.ajaxGet(url, function(data){
            self.setState({services: data, loading: false});
        });
    }
    loadServiceEventPrediction() {
        if(this.state.id != 0) {
            this.setState({ loading: true });  
            var self = this;
            var url = '/api/serviceeventpredictions/' + this.state.id;
            Utils.ajaxGet(url, function(data){
                //TODO dates
                var loadValues = {
                    serviceId: data.serviceConfig.id, description: data.description, minReplics: data.minReplics,
                    startDate: '', startTime: '', endDate: '', endTime: ''
                };
                
                self.setState({values: loadValues, loading: false});
            });
        }
    }
    renderServicesSelect(){
        var servicesNodes;
        if (this.state.services) {
            servicesNodes = this.state.services.map(function (service) {
                return (
                    <option key={service.id} value={service.id}>{service.serviceName}</option>
                );
            });
            return servicesNodes;
        }
    }
    updateStateFromPicker(name, value) {
        var newValues = this.state.values;
        newValues[name] = value;
        this.setState({values: newValues});
    }
    addEventListenersPickers() {
        var self = this;
        var elems = $(document).find('.datepicker,.timepicker');
        for (let i = 0; i < elems.length; i++) {
            var input = elems[i];
            $(input).change(function(e){
                var currInput = $(e.target);
                var val = currInput.val(); 
                var inputName = currInput.attr("name");
                self.updateStateFromPicker(inputName, val);
            });                         
        }        
    }
    componentDidMount() {
        this.loadServiceConfigs();
        this.loadServiceEventPrediction();
        var dateElems = document.querySelectorAll('.datepicker');
        var dateOptions = {
            format: 'dd-mm-yyyy'
        };
        M.Datepicker.init(dateElems, dateOptions);
        var timeElems = document.querySelectorAll('.timepicker');
        var timeOptions = {
            twelveHour: false                
        };
        M.Timepicker.init(timeElems, timeOptions);
        this.addEventListenersPickers();
    }
    componentDidUpdate(){
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }
    onSubmitForm(event){
        event.preventDefault();
        var formId = "form-service";
        var formAction = '/api/serviceeventpredictions/' + this.state.id;
        var formMethod = 'POST';
        var formData = Utils.convertFormToJson(formId);     
        var self = this;
        Utils.formSubmit(formAction, formMethod, formData, function (data) {
            self.setState({isEdit: false, formSubmit: true});
            M.toast({html: "<div>Service event prediction saved successfully!</div>"});
        });
    }
    onInputChange(event){        
        var name = event.target.name;
        var newValues = this.state.values;
        newValues[name] = event.target.value;
        this.setState({values: newValues});
    }
    renderForm(){
        var servicesSelect = this.renderServicesSelect();
        return(
            <form id="form-service" onSubmit={this.onSubmitForm}>                
                <div className="input-field col s12">
                    <input value={this.state.values.description} onChange={this.onInputChange} type="text" name="description" id="description" autoComplete="off"></input>
                    <label htmlFor="description">Description</label>
                </div>
                <div className="input-field col s12">
                    <select value={this.state.values.serviceId} onChange={this.onInputChange} name="serviceId" id="serviceId">
                        <option value="" disabled="disabled">Choose service</option>
                        {servicesSelect}
                    </select>
                    <label htmlFor="service">Service</label>
                </div>
                <div className="input-field col s6">
                    <input className='datepicker' defaultValue={this.state.values.startDate} type="text" name="startDate" id="startDate" autoComplete="off"></input>
                    <label htmlFor="startDate">Start date</label>
                </div>
                <div className="input-field col s6">
                    <input className='timepicker' defaultValue={this.state.values.startTime} type="text" name="startTime" id="startTime" autoComplete="off"></input>
                    <label htmlFor="startTime">Start time</label>
                </div>
                <div className="input-field col s6">
                    <input className='datepicker' defaultValue={this.state.values.endDate} type="text" name="endDate" id="endDate" autoComplete="off"></input>
                    <label htmlFor="endDate">End date</label>
                </div>
                <div className="input-field col s6">
                    <input className='timepicker' defaultValue={this.state.values.endTime} type="text" name="endTime" id="endTime" autoComplete="off"></input>
                    <label htmlFor="endTime">End time</label>
                </div>
                <div className="input-field col s12">
                    <input value={this.state.values.minReplics} onChange={this.onInputChange} type="number" name="minReplics" id="minReplics" autoComplete="off"></input>
                    <label htmlFor="minReplics">Minimum replics</label>
                </div>                
                <button className="btn waves-effect waves-light" type="submit" name="action">
                    Add
                    <i className="material-icons right">send</i>
                </button>
            </form>
        );
    }
    render() {
        if(this.state.formSubmit){
            return <Redirect to='/ui/rules/serviceeventpredictions' />;
        }
        return (
            <MainLayout title='Service event prediction detail' breadcrumbs={this.state.breadcrumbs}>
                <div className='row'>
                    <div className='col s12'>
                        <div className='card'>
                            <div className='card-content'>
                                {this.renderForm()}
                            </div>                            
                        </div>
                    </div>
                </div>                
            </MainLayout>
        );
    }
}
