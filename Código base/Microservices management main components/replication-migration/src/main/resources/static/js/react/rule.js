var $ = require('jquery');
const React = require('react');
const Link = require('react-router-dom').Link;
const Redirect = require('react-router-dom').Redirect;
const Component = React.Component;
import Utils from './utils';
import {MainLayout, CardItem} from './globalComponents';

export class RulesLandingPage extends Component {
    constructor(props) {
        super(props);
        var ruleLinks = [
            {name: 'Conditions', link: '/ui/rules/conditions'}, 
            {name: 'Rules', link: '/ui/rules'},           
            {name: 'Generic Hosts rules', link: '/ui/rules/generic/hosts'},
            {name: 'Hosts rules', link: '/ui/rules/hosts'},
            {name: 'Apps rules', link: '/ui/rules/apps'},
            {name: 'Services rules', link: '/ui/rules/services'},
            {name: 'Service event predictions', link: '/ui/rules/serviceeventpredictions'}
        ];
        this.state = { links: ruleLinks, loading: false };
        this.renderLinks = this.renderLinks.bind(this);
    }
    renderLinks() {
        var links;
        links = this.state.links.map(function (link) {
            return (
                <li key={link.name} className="collection-item">
                    <div>{link.name}
                        <Link className="secondary-content" to={link.link}>
                            <i className="material-icons">keyboard_arrow_right</i>
                        </Link>
                    </div>
                </li>
            );
        });
        return links;        
    }
    render() {
        return (
            <MainLayout title='Rules management'>
                <div className="row">
                    <div className="col s12">
                        <ul className="collection">
                            {this.renderLinks()}
                        </ul>
                    </div>
                </div>
            </MainLayout>            
        );
    }
}


export class ConditionCard extends Component {
    constructor(props) {
        super(props);
        var condition = this.props.condition;
        this.state = { data: condition, loading: false };       
    }
    renderLink(){
        return(
            <div className="right-align">                                
                <div className="row">
                    <div className="col s12">
                        <Link className="waves-effect waves-light btn-small" to={'/ui/rules/conditions/detail/'+ this.state.data.id}>
                            View details
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
    renderSimple(){
        var linkDetails = this.props.viewDetails ? this.renderLink() : null;
        return (
            <div>
                {linkDetails}
                <CardItem label='Value mode' value={this.state.data.valueMode.valueModeName}/>
                <CardItem label='Field' value={this.state.data.field.fieldName}/>
                <CardItem label='Operator' value={this.state.data.operator.operatorSymbol}/>
                <CardItem label='Condition value' value={this.state.data.conditionValue}/> 
            </div>
        )
    } 
    renderCard(){
        return (
            <div className='row'>
                <div className='col s12'>
                    <div className='card'>
                        <div className='card-content'>
                             {this.renderSimple()}
                        </div>                            
                    </div>
                </div>
            </div>
        )
    }
    render() {
        var finalRender = this.props.renderSimple ? this.renderSimple() : this.renderCard();
        return ( finalRender )
    }
}

export class Conditions extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [], loading: false };
    }  
    loadConditions(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/conditions',           
            function (data) {
                var conditions = data;                
                self.setState({data: conditions, loading: false});
            });
    }
    componentDidMount() {
        this.loadConditions();
    }
    render() {
        var conditionNodes;
        if (this.state.data) {
            conditionNodes = this.state.data.map(function (condition) {
                return (
                    <ConditionCard viewDetails={true} key={condition.id} condition={condition} />
                );
            });
        }
        return (
            <MainLayout title='Conditions'>
                <div className="right-align">                                
                    <div className="row">
                        <div className="col s12">
                            <Link className="waves-effect waves-light btn-small" to='/ui/rules/conditions/detail/'>
                                New condition
                            </Link>
                        </div>
                    </div>
                </div>
                {conditionNodes}
            </MainLayout>            
        );
    }
}

export class ConditionPage extends Component {
    constructor(props) {
        super(props);
        var thisConditionId = 0;
        if(props.match.params.conditionId)
            thisConditionId = props.match.params.conditionId;
        
        var conditionInitialValues = {
            valueModeId: '', fieldId: '', operatorId: '', conditionValue: ''
        }
        var thisBreadcrumbs = [{link: '/ui/rules/conditions', title: 'Conditions'}];   
        this.state = { breadcrumbs: thisBreadcrumbs, conditionId: thisConditionId, condition: conditionInitialValues, valueModes: [], fields: [], operators: [], isDeleted: false, loading: false};
        this.loadCondition = this.loadCondition.bind(this);
        this.loadValueModes = this.loadValueModes.bind(this);
        this.loadFields = this.loadFields.bind(this);
        this.loadOperators = this.loadOperators.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderValueModesSelect = this.renderValueModesSelect.bind(this);
        this.renderFieldsSelect = this.renderFieldsSelect.bind(this);
        this.renderOperatorsSelect = this.renderOperatorsSelect.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.renderDelete = this.renderDelete.bind(this);
    }
    componentDidMount() {
        this.loadValueModes();     
        this.loadFields();
        this.loadOperators();
        this.loadCondition();
    }
    componentDidUpdate(){
        M.updateTextFields();
        M.FormSelect.init(document.querySelectorAll('select'));
    }
    loadCondition(){
        if(this.state.conditionId != 0) {
            this.setState({ loading: true });  
            var self = this;
            Utils.ajaxGet('/api/conditions/' + this.state.conditionId,           
                function (data) {
                    var currentCondition = {
                        valueModeId: data.valueMode.id,
                        fieldId: data.field.id,
                        operatorId: data.operator.id,
                        conditionValue: data.conditionValue
                    }           
                    self.setState({condition: currentCondition, loading: false});
                });
        }        
    }
    loadValueModes() {
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/valuemodes/',           
            function (data) {              
                self.setState({valueModes: data, loading: false});
            });
    }
    loadFields(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/fields/',           
            function (data) {              
                self.setState({fields: data, loading: false});
            });
    }
    loadOperators(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/operators/',           
            function (data) {              
                self.setState({operators: data, loading: false});
            });
    }
    handleChange(event) {
        var name = event.target.name;
        var newData = this.state.condition;
        newData[name] = event.target.value;
        this.setState({condition: newData});
    }
    renderValueModesSelect(){
        var valueModesNodes;
        if (this.state.valueModes) {
            valueModesNodes = this.state.valueModes.map(function (valueMode) {
                return (
                    <option key={valueMode.id} value={valueMode.id}>{valueMode.valueModeName}</option>
                );
            });
            return valueModesNodes;
        }
    }
    renderFieldsSelect(){
        var fieldsNodes;
        if (this.state.fields) {
            fieldsNodes = this.state.fields.map(function (field) {
                return (
                    <option key={field.id} value={field.id}>{field.fieldName}</option>
                );
            });
            return fieldsNodes;
        }
    }
    renderOperatorsSelect(){
        var operatorsNodes;
        if (this.state.operators) {
            operatorsNodes = this.state.operators.map(function (operator) {
                return (
                    <option key={operator.id} value={operator.id}>{operator.operatorSymbol}</option>
                );
            });
            return operatorsNodes;
        }
    }
    renderDelete(){
        if(this.state.conditionId == 0) {
            return null
        } else {
            var style = { marginLeft: "5px" };
            return (
                <a style={style} className="waves-effect waves-light btn-small red darken-4" onClick={this.onDelete}>Delete</a>
            )
        }
    }
    onDelete(){
        var formAction = '/api/conditions/' + this.state.conditionId;
        var formMethod = 'DELETE';
        var self = this;
        Utils.formSubmit(formAction, formMethod, {}, function (data) {
            self.setState({isDeleted: true});
            M.toast({html: "<div>Condition successfully deleted!</div>"});
        });
    }
    onSubmitForm(event){
        event.preventDefault();
        var formAction = '/api/conditions/' + this.state.conditionId;
        var formMethod = 'POST';
        var formData = Utils.convertFormToJson('conditionForm');     
        var self = this;
        Utils.formSubmit(formAction, formMethod, formData, function (data) {
            self.setState({conditionId: data, isEdit: false});
            M.toast({html: "<div>Condition successfully saved!</div>"});
        });
    }
    renderConditionForm(){
        if(this.state.isDeleted){
            return <Redirect to='/ui/rules/conditions' />;
        }
        var valueModesSelect = this.renderValueModesSelect();
        var fieldsSelect = this.renderFieldsSelect();
        var operatorsSelect = this.renderOperatorsSelect();
            return (
                <div className='row'>
                    <div className="right-align">                                
                        <div className="row">
                            <div className="col s12">
                                {this.renderDelete()}
                            </div>
                        </div>
                    </div>
                    <form id='conditionForm' onSubmit={this.onSubmitForm}>
                        <div className="input-field col s12">
                            <select value={this.state.condition.valueModeId} onChange={this.handleChange} name="valueModeId" id="valueModeId" >
                                <option value="" disabled="disabled">Choose Value mode</option>
                                {valueModesSelect}
                            </select>
                            <label htmlFor="valueModeId">Value mode</label>
                        </div>
                        <div className="input-field col s12">
                            <select value={this.state.condition.fieldId} onChange={this.handleChange} name="fieldId" id="fieldId" >
                                <option value="" disabled="disabled">Choose Field</option>
                                {fieldsSelect}
                            </select>
                            <label htmlFor="fieldId">Field</label>
                        </div>
                        <div className="input-field col s12">
                            <select value={this.state.condition.operatorId} onChange={this.handleChange} name="operatorId" id="operatorId" >
                                <option value="" disabled="disabled">Choose Operator</option>
                                {operatorsSelect}
                            </select>
                            <label htmlFor="operatorId">Operator</label>
                        </div>
                        <div className="input-field col s12">
                            <input value={this.state.condition.conditionValue} onChange={this.handleChange} name="conditionValue" id="conditionValue" type="number"/>
                            <label htmlFor="conditionValue">Condition value</label>
                        </div>                    
                        <button className="btn waves-effect waves-light" type="submit" name="action">
                            Save
                            <i className="material-icons right">send</i>
                        </button>
                    </form>
                </div>
            )
    }
    render() {       
        return (
            <MainLayout title='Condition detail' breadcrumbs={this.state.breadcrumbs}>
                {this.renderConditionForm()}
            </MainLayout>            
        );
    }
}

export class RuleCard extends Component {
    constructor(props) {
        super(props);
        var rule = this.props.rule;
        this.state = { data: rule, conditions: [], loading: false };
        this.renderConditions = this.renderConditions.bind(this);  
    }
    loadConditions() {
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/rules/' + self.state.data.id + '/conditions',           
            function (data) {
                var conditionsData = data;                
                self.setState({conditions: conditionsData, loading: false});
            });
    }
    componentDidMount() {
        this.loadConditions();
    }
    componentDidUpdate(){
        var elems = document.querySelectorAll('.collapsible');
        M.Collapsible.init(elems);
    }
    renderConditions() {
        var conditionNodes;
        if (this.state.conditions) {
            conditionNodes = this.state.conditions.map(function (condition) {
                return (
                    <li key={condition.id} >
                        <div className="collapsible-header">
                            {condition.field.fieldName + " " + condition.operator.operatorSymbol + " " + condition.conditionValue}
                        </div>
                        <div className="collapsible-body">
                            <ConditionCard renderSimple={true} viewDetails={false} condition={condition} />
                        </div>
                    </li>
                );
            });
        }
        return conditionNodes;
    }
    renderLink(){
        return(
            <div className="right-align">                                
                <div className="row">
                    <div className="col s12">
                        <Link className="waves-effect waves-light btn-small" to={'/ui/rules/detail/'+ this.state.data.id}>
                            View details
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
    renderSimple(){
        var linkDetails = this.props.viewDetails ? this.renderLink() : null;
        return (
            <div>
                {linkDetails}
                <CardItem label='Rule name' value={this.state.data.ruleName}/>
                <CardItem label='Rule type' value={this.state.data.componentType.componentTypeName}/>
                <CardItem label='Priority' value={this.state.data.priority}/>
                <CardItem label='Decision' value={this.state.data.decision.decisionName}/>
            </div>
        )
    } 
    renderCard(){
        return (
            <div className='row'>
                <div className='col s12'>
                    <div className='card'>
                        <div className='card-content'>
                            {this.renderSimple()}
                            <h5>Rule conditions</h5>
                            <ul className="collapsible">
                                {this.renderConditions()}
                            </ul>
                        </div>                            
                    </div>
                </div>
            </div>
        )
    }
    render() {
        var finalRender = this.props.renderSimple ? this.renderSimple() : this.renderCard();
        return ( finalRender )
    }
}

export class Rules extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [], loading: false };
    }  
    loadRules(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/rules',           
            function (data) {
                var rules = data;                
                self.setState({data: rules, loading: false});
            });
    }  
    componentDidMount() {
        this.loadRules();
    }
    render() {
        var ruleNodes;
        if (this.state.data) {
            ruleNodes = this.state.data.map(function (rule) {
                return (
                    <RuleCard viewDetails={true} key={rule.id} rule={rule} />
                );
            });
        }
        return (
            <MainLayout title='Rules'>
                <div className="right-align">                                
                    <div className="row">
                        <div className="col s12">
                            <Link className="waves-effect waves-light btn-small" to='/ui/rules/detail/'>
                                New rule
                            </Link>
                        </div>
                    </div>
                </div>
                {ruleNodes}
            </MainLayout>            
        );
    }
}

export class RulePage extends Component {
    constructor(props) {
        super(props);
        var thisRuleId = 0;
        if(props.match.params.ruleId)
            thisRuleId = props.match.params.ruleId;
        
        var ruleInitialValues = {
            ruleName: '', componentTypeId: '', priority: 0, decisionId: ''
        }
        var thisBreadcrumbs = [{link: '/ui/rules', title: 'Rules'}];
        this.state = { breadcrumbs: thisBreadcrumbs,ruleId: thisRuleId, rule: ruleInitialValues, componentTypes: [], decisions: [], conditions: [], allConditions: [], loadedConditions: false, isDeleted: false, loading: false};
        this.loadRule = this.loadRule.bind(this);
        this.loadComponentTypes = this.loadComponentTypes.bind(this);
        this.loadDecisions = this.loadDecisions.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderComponentTypesSelect = this.renderComponentTypesSelect.bind(this);
        this.renderDecisionsSelect = this.renderDecisionsSelect.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.renderDelete = this.renderDelete.bind(this);
        this.loadConditions = this.loadConditions.bind(this);
        this.renderConditions = this.renderConditions.bind(this);
        this.loadAllConditions = this.loadAllConditions.bind(this);
        this.renderAddCondition = this.renderAddCondition.bind(this);
        this.addCondition = this.addCondition.bind(this);
        this.onRemoveCondition = this.onRemoveCondition.bind(this);
    }
    componentDidMount() {
        M.updateTextFields();      
        this.loadComponentTypes();
        this.loadDecisions();
        this.loadRule();
        this.loadConditions();
        this.loadAllConditions();
    }
    componentDidUpdate(){
        M.updateTextFields();
        M.FormSelect.init(document.querySelectorAll('select'));
    }
    loadConditions() {
        this.setState({ loadedConditions: false, loading: true });  
        var self = this;
        Utils.ajaxGet('/api/rules/' + self.state.ruleId + '/conditions',           
            function (data) {
                var conditionsData = data;                
                self.setState({conditions: conditionsData, loadedConditions: true, loading: false});
            });
    }
    loadRule(){
        if(this.state.ruleId != 0) {
            this.setState({ loading: true });  
            var self = this;
            Utils.ajaxGet('/api/rules/' + this.state.ruleId,           
                function (data) {
                    var currentRule = {
                        ruleName: data.ruleName,
                        componentTypeId: data.componentType.id, 
                        priority: data.priority, 
                        decisionId: data.decision.id
                    }           
                    self.setState({rule: currentRule, loading: false});
                });
        }        
    }
    loadComponentTypes(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/componentTypes/',           
            function (data) {              
                self.setState({componentTypes: data, loading: false});
            });
    }
    loadDecisions(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/decisions/',           
            function (data) {              
                self.setState({decisions: data, loading: false});
            });
    }
    handleChange(event) {
        var name = event.target.name;
        var newData = this.state.rule;
        newData[name] = event.target.value;
        this.setState({rule: newData});
    }
    addCondition(conditionId, event) {
        if(this.state.ruleId != 0) {     
            var formAction = '/api/rules/' + this.state.ruleId + '/conditions/' + conditionId;
            var formMethod = 'POST';
            var self = this;
            Utils.formSubmit(formAction, formMethod, {}, function (data) {                
                M.toast({html: "<div>Condition successfully added to rule!</div>"});
                self.loadConditions();
            });
        }
    }
    renderComponentTypesSelect(){
        var componentTypesNodes;
        if (this.state.componentTypes) {
            componentTypesNodes = this.state.componentTypes.map(function (componentType) {
                return (
                    <option key={componentType.id} value={componentType.id}>{componentType.componentTypeName}</option>
                );
            });
            return componentTypesNodes;
        }
    }
    renderDecisionsSelect(){
        var decisionsNodes;
        if (this.state.decisions) {
            decisionsNodes = this.state.decisions.map(function (decision) {
                return (
                    <option key={decision.id} value={decision.id}>
                        {decision.decisionName + " (" + decision.componentType.componentTypeName + ")"}
                    </option>
                );
            });
            return decisionsNodes;
        }
    }
    renderDelete(){
        if(this.state.conditionId == 0) {
            return null
        } else {
            var style = { marginLeft: "5px" };
            return (
                <a style={style} className="waves-effect waves-light btn-small red darken-4" onClick={this.onDelete}>Delete</a>
            )
        }
    }
    onDelete(){
        var formAction = '/api/rules/' + this.state.ruleId;
        var formMethod = 'DELETE';
        var self = this;
        Utils.formSubmit(formAction, formMethod, {}, function (data) {
            self.setState({isDeleted: true});
            M.toast({html: "<div>Rule successfully deleted!</div>"});
        });
    }
    onRemoveCondition(conditionId, event){
        var formAction = '/api/rules/' + this.state.ruleId + '/conditions/' + conditionId;
        var formMethod = 'DELETE';
        var self = this;
        Utils.formSubmit(formAction, formMethod, {}, function (data) {
            M.toast({html: "<div>Condition successfully deleted from rule!</div>"});
            self.loadConditions();
        });
    }
    onSubmitForm(event){
        event.preventDefault();
        var formAction = '/api/rules/' + this.state.ruleId;
        var formMethod = 'POST';
        var formData = Utils.convertFormToJson('ruleForm');     
        var self = this;
        Utils.formSubmit(formAction, formMethod, formData, function (data) {
            self.setState({ruleId: data, isEdit: false});
            M.toast({html: "<div>Rule successfully saved!</div>"});
        });
    }
    renderConditions() {
        var conditionNodes;
        var self = this;
        var style = {marginTop: '-4px'};
        if (this.state.conditions) {
            conditionNodes = this.state.conditions.map(function (condition) {
                return (
                    <li key={condition.id} className="collection-item">
                        <div>
                            {"(" + condition.valueMode.valueModeName + ") " + condition.field.fieldName + " " + condition.operator.operatorSymbol + " " + condition.conditionValue}
                            <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.onRemoveCondition(condition.id, e)}>
                                <i className="material-icons">clear</i>
                            </a>                            
                        </div>
                    </li>                   
                );
            });
        }
        return conditionNodes;
    }
    loadAllConditions(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/conditions',           
            function (data) {
                var conditionsData = data;                
                self.setState({allConditions: conditionsData, loading: false});
            });
    }
    renderAddCondition(){
        var conditionNodes;
        var style = {marginTop: '-4px'};
        var self = this;
        function canAddCondition(conditionId) {
            var i;
            for(i = 0; i < self.state.conditions.length; i++){
                if(self.state.conditions[i].id == conditionId){
                    return false;
                }
            }
            return true;
        }
        if (this.state.allConditions && this.state.loadedConditions) {
            conditionNodes = this.state.allConditions.map(function (condition) {
                if(canAddCondition(condition.id)){
                    return (
                        <li key={condition.id} className="collection-item">
                            <div>
                                {"(" + condition.valueMode.valueModeName + ") " + condition.field.fieldName + " " + condition.operator.operatorSymbol + " " + condition.conditionValue}
                                <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.addCondition(condition.id, e)}>
                                    <i className="material-icons">add</i>
                                </a>                            
                            </div>
                        </li>
                    );
                }                
            });
        }
        return (
            <ul className="collection">                    
                {conditionNodes}
            </ul>
        )
    }
    renderRuleForm(){
        if(this.state.isDeleted){
            return <Redirect to='/ui/rules' />;
        }        
        var componentTypesSelect = this.renderComponentTypesSelect();
        var decisionsSelect = this.renderDecisionsSelect();
            return (
                <div className='row'>
                    <div className="right-align">                                
                        <div className="row">
                            <div className="col s12">
                                {this.renderDelete()}
                            </div>
                        </div>
                    </div>
                    <form id='ruleForm' onSubmit={this.onSubmitForm}>
                        <div className="input-field col s12">
                            <input value={this.state.rule.ruleName} onChange={this.handleChange} name="ruleName" id="ruleName" type="text" autoComplete="off"/>
                            <label htmlFor="ruleName">Rule name</label>
                        </div>
                        <div className="input-field col s12">
                            <select value={this.state.rule.componentTypeId} onChange={this.handleChange} name="componentTypeId" id="componentTypeId" >
                                <option value="" disabled="disabled">Choose rule type</option>
                                {componentTypesSelect}
                            </select>
                            <label htmlFor="componentTypeId">Rule type</label>
                        </div>
                        <div className="input-field col s12">
                            <input value={this.state.rule.priority} onChange={this.handleChange} name="priority" id="priority" type="number"/>
                            <label htmlFor="priority">Priority</label>
                        </div>
                        <div className="input-field col s12">
                            <select value={this.state.rule.decisionId} onChange={this.handleChange} name="decisionId" id="decisionId" >
                                <option value="" disabled="disabled">Choose decision</option>
                                {decisionsSelect}
                            </select>
                            <label htmlFor="decisionId">Decision</label>
                        </div>                        
                        <button className="btn waves-effect waves-light" type="submit" name="action">
                            Save
                            <i className="material-icons right">send</i>
                        </button>
                    </form>
                    <br/>
                    <div>
                        <h5>Rule conditions</h5>
                        <ul className="collection">
                            {this.renderConditions()}
                        </ul>
                        <br/>
                        <h5>Add conditions</h5>                        
                        {this.renderAddCondition()}                        
                    </div>
                </div>
            )
    }
    render() {       
        return (
            <MainLayout title='Rule detail' breadcrumbs={this.state.breadcrumbs}>
                {this.renderRuleForm()}
            </MainLayout>            
        );
    }
}

class AppRules extends Component {
    constructor(props) {
        super(props);
        this.state = { appRules: [], loading: false };
        this.loadAppRules = this.loadAppRules.bind(this);
        this.renderAppRules = this.renderAppRules.bind(this);
    }
    loadAppRules(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/apps/'+ self.props.app.id +'/rules',           
            function (data) {            
                self.setState({appRules: data, loading: false});
            });
    }
    componentDidMount() {
        this.loadAppRules();
    }
    renderAppRules(){
        var appRulesNodes;
        if(this.state.appRules) {
            appRulesNodes = this.state.appRules.map(function (appRule) {
                return (
                    <div key={appRule.rule.id}>                   
                        <div className='card'>
                            <div className='card-content'>                               
                                {appRule.rule.ruleName}
                            </div>                            
                        </div>
                    </div>
                );
            });
        }
        return appRulesNodes;
    }
    render() {
        return (
            <div>
                <h5>Rules</h5>
                {this.renderAppRules()}
            </div>
        );
    }
}

export class AppsRulesList extends Component {
    constructor(props) {
        super(props);
        this.state = { apps: [], loading: false };
        this.loadApps = this.loadApps.bind(this);
        this.renderApps = this.renderApps.bind(this);
    }
    loadApps(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/apps',           
            function (data) {            
                self.setState({apps: data, loading: false});
            });
    }
    componentDidMount(){
        this.loadApps();
    }
    renderApps() {
        var appNodes;
        if(this.state.apps) {
            appNodes = this.state.apps.map(function (app) {
                return (
                    <div key={app.id} className='row'>
                        <div className='col s12'>
                            <div className='card'>
                                <div className='card-content'>
                                    <div className="right-align">                   
                                        <div className="row">
                                            <div className="col s12">
                                                <Link className="waves-effect waves-light btn-small" to={'/ui/rules/apps/detail/'+ app.id}>
                                                    View details
                                                </Link>
                                            </div>
                                        </div>
                                    </div> 
                                    <CardItem label='App' value={app.appName}/>
                                    <AppRules app={app}/>
                                </div>                            
                            </div>                    
                        </div>
                    </div>
                );
            });
        }
        return appNodes;
    }
    render() {
        return (
            <MainLayout title='Apps rules'>
                {this.renderApps()}
            </MainLayout>
        );
    }
}

export class AppRulesPage extends Component {
    constructor(props) {
        super(props);
        var thisAppId = 0;
        if(props.match.params.appId)
            thisAppId = props.match.params.appId;
        
        var thisBreadcrumbs = [ {link: '/ui/rules/apps', title: 'Apps rules'} ];
        this.state = { breadcrumbs: thisBreadcrumbs, appId: thisAppId, app: {}, rules: [], allRules: [], loadedRules: false, loading: false };
        this.loadAppRules = this.loadAppRules.bind(this);
        this.renderRules = this.renderRules.bind(this);
        this.loadAllRules = this.loadAllRules.bind(this);
        this.onRemoveRule = this.onRemoveRule.bind(this);
        this.addRule = this.addRule.bind(this);
        this.loadApp = this.loadApp.bind(this);
    }
    loadApp() { 
        var self = this;
        Utils.ajaxGet('/api/apps/'+ self.state.appId,           
            function (data) {
                self.setState({app: data, loading: false});
            });
    }
    loadAppRules(){
        this.setState({ loadedRules: false, loading: true });  
        var self = this;
        Utils.ajaxGet('/api/apps/'+ self.state.appId +'/rules',           
            function (data) {                
                self.setState({rules: data, loadedRules: true, loading: false});
            });
    }
    loadAllRules() {
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/rules/container',           
            function (data) {
                self.setState({allRules: data, loading: false});
            });
    }
    componentDidMount() {
        this.loadApp();
        this.loadAppRules();
        this.loadAllRules();
    }
    componentDidUpdate() {
        M.updateTextFields();
    }
    onRemoveRule(ruleId, event) {        
        var formAction = '/api/apps/' + this.state.appId + '/rules';
        var formMethod = 'DELETE';
        var self = this;
        var data = {
            'appId': Number(self.state.appId),
            'ruleId': Number(ruleId)
        };
        Utils.formSubmit(formAction, formMethod, JSON.stringify(data), function (data) {
            M.toast({html: "<div>Rule successfully deleted from app rules!</div>"});
            self.loadAppRules();
        });
    }
    addRule(ruleId, event) {
        var formAction = '/api/apps/' + this.state.appId + '/rules';
        var formMethod = 'POST';
        var self = this;
        var data = {
            'appId': Number(self.state.appId),
            'ruleId': Number(ruleId)
        };
        Utils.formSubmit(formAction, formMethod, JSON.stringify(data), function (data) {
            M.toast({html: "<div>Rule successfully added to app rules!</div>"});
            self.loadAppRules();
        });
    }
    renderRules() {
        var rulesNodes;
        var self = this;
        var style = {marginTop: '-4px'};
        if (this.state.rules) {
            rulesNodes = this.state.rules.map(function (appRule) {
                return (
                    <li key={appRule.rule.id} className="collection-item">
                        <div>
                            {appRule.rule.ruleName}
                            <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.onRemoveRule(appRule.rule.id, e)}>
                                <i className="material-icons">clear</i>
                            </a>                            
                        </div>
                    </li>                   
                );
            });
        }
        return rulesNodes;
    }
    renderAddRules(){
        var ruleNodes;
        var style = {marginTop: '-4px'};
        var self = this;
        function canAddRule(ruleId) {
            var i;
            for(i = 0; i < self.state.rules.length; i++){
                if(self.state.rules[i].rule.id == ruleId){
                    return false;
                }
            }
            return true;
        }
        if (this.state.allRules && this.state.loadedRules) {
            ruleNodes = this.state.allRules.map(function (rule) {
                if(canAddRule(rule.id)){
                    return (
                        <li key={rule.id} className="collection-item">
                            <div>
                                {rule.ruleName}
                                <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.addRule(rule.id, e)}>
                                    <i className="material-icons">add</i>
                                </a>                            
                            </div>
                        </li>
                    );
                }                
            });
        }
        return (
            <ul className="collection">                    
                {ruleNodes}
            </ul>
        )
    }
    render() {
        return (
            <MainLayout title='App rules detail' breadcrumbs={this.state.breadcrumbs}>
               <div className='row'>
                    <div className="input-field col s12">
                        <input disabled={true} value={this.state.app.appName} name="appName" id="appName" type="text"/>
                        <label htmlFor="appName">App name</label>
                    </div>
                    <div>
                        <h5>Rules</h5>
                        <ul className="collection">
                            {this.renderRules()}
                        </ul>
                        <br/>
                        <h5>Add rules</h5>                        
                        {this.renderAddRules()}                        
                    </div>
                </div>
            </MainLayout>        
        );
    }
}

class HostRules extends Component {
    constructor(props) {
        super(props);
        this.state = { hostRules: [], loading: false };
        this.loadHostRules = this.loadHostRules.bind(this);
        this.renderHostRules = this.renderHostRules.bind(this);
    }
    loadHostRules(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/hosts/'+ self.props.host.hostname +'/rules',           
            function (data) {            
                self.setState({hostRules: data, loading: false});
            });
    }
    componentDidMount() {
        this.loadHostRules();
    }
    renderHostRules(){
        var hostRulesNodes;
        if(this.state.hostRules) {
            hostRulesNodes = this.state.hostRules.map(function (hostRule) {
                return (
                    <div key={hostRule.rule.id}>                   
                        <div className='card'>
                            <div className='card-content'>                               
                                {hostRule.rule.ruleName}
                            </div>                            
                        </div>
                    </div>
                );
            });
        }
        return hostRulesNodes;
    }
    render() {
        return (
            <div>
                <h5>Rules</h5>
                {this.renderHostRules()}
            </div>
        );
    }
}

export class HostsRulesList extends Component {
    constructor(props) {
        super(props);
        this.state = { hosts: [], loading: false };
        this.loadHosts = this.loadHosts.bind(this);
        this.renderHosts = this.renderHosts.bind(this);
    }
    loadHosts(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/nodes',           
            function (data) {            
                self.setState({hosts: data, loading: false});
            });
    }
    componentDidMount(){
        this.loadHosts();
    }
    renderHosts() {
        var hostNodes;
        if(this.state.hosts) {
            hostNodes = this.state.hosts.map(function (host) {
                return (
                    <div key={host.hostname} className='row'>
                        <div className='col s12'>
                            <div className='card'>
                                <div className='card-content'>
                                    <div className="right-align">                   
                                        <div className="row">
                                            <div className="col s12">
                                                <Link className="waves-effect waves-light btn-small" to={'/ui/rules/hosts/detail/'+ host.hostname}>
                                                    View details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <CardItem label='Host' value={host.hostname}/>
                                    <HostRules host={host}/>
                                </div>                            
                            </div>                    
                        </div>
                    </div>
                );
            });
        }
        return hostNodes;
    }
    render() {
        return (
            <MainLayout title='Hosts rules'>
                {this.renderHosts()}
            </MainLayout>
        );
    }
}

export class HostRulesPage extends Component {
    constructor(props) {
        super(props);
        var thisHostname = '';
        if(props.match.params.hostname)
            thisHostname = props.match.params.hostname;

        var thisBreadcrumbs = [ {link: '/ui/rules/hosts', title: 'Hosts rules'} ];
        this.state = { breadcrumbs: thisBreadcrumbs, hostname: thisHostname, rules: [], allRules: [], loadedRules: false, loading: false };
        this.loadHostRules = this.loadHostRules.bind(this);
        this.renderRules = this.renderRules.bind(this);
        this.loadAllRules = this.loadAllRules.bind(this);
        this.onRemoveRule = this.onRemoveRule.bind(this);
        this.addRule = this.addRule.bind(this);
    }
    loadHostRules(){
        this.setState({ loadedRules: false, loading: true });  
        var self = this;
        Utils.ajaxGet('/api/hosts/'+ self.state.hostname +'/rules',           
            function (data) {                
                self.setState({rules: data, loadedRules: true, loading: false});
            });
    }
    loadAllRules() {
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/rules/host',           
            function (data) {
                self.setState({allRules: data, loading: false});
            });
    }
    componentDidMount() {
        this.loadHostRules();
        this.loadAllRules();
    }
    componentDidUpdate() {
        M.updateTextFields();
    }
    onRemoveRule(ruleId, event) {        
        var formAction = '/api/hosts/' + this.state.hostname + '/rules';
        var formMethod = 'DELETE';
        var self = this;
        var data = {
            'hostname': self.state.hostname,
            'ruleId': Number(ruleId)
        };
        Utils.formSubmit(formAction, formMethod, JSON.stringify(data), function (data) {
            M.toast({html: "<div>Rule successfully deleted from hosts rules!</div>"});
            self.loadHostRules();
        });
    }
    addRule(ruleId, event) {
        var formAction = '/api/hosts/' + this.state.hostname + '/rules';
        var formMethod = 'POST';
        var self = this;
        var data = {
            'hostname': self.state.hostname,
            'ruleId': Number(ruleId)
        };
        Utils.formSubmit(formAction, formMethod, JSON.stringify(data), function (data) {
            M.toast({html: "<div>Rule successfully added to host rules!</div>"});
            self.loadHostRules();
        });
    }
    renderRules() {
        var rulesNodes;
        var self = this;
        var style = {marginTop: '-4px'};
        if (this.state.rules) {
            rulesNodes = this.state.rules.map(function (hostRule) {
                return (
                    <li key={hostRule.rule.id} className="collection-item">
                        <div>
                            {hostRule.rule.ruleName}
                            <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.onRemoveRule(hostRule.rule.id, e)}>
                                <i className="material-icons">clear</i>
                            </a>                            
                        </div>
                    </li>                   
                );
            });
        }
        return rulesNodes;
    }
    renderAddRules(){
        var ruleNodes;
        var style = {marginTop: '-4px'};
        var self = this;
        function canAddRule(ruleId) {
            var i;
            for(i = 0; i < self.state.rules.length; i++){
                if(self.state.rules[i].rule.id == ruleId){
                    return false;
                }
            }
            return true;
        }
        if (this.state.allRules && this.state.loadedRules) {
            ruleNodes = this.state.allRules.map(function (rule) {
                if(canAddRule(rule.id)){
                    return (
                        <li key={rule.id} className="collection-item">
                            <div>
                                {rule.ruleName}
                                <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.addRule(rule.id, e)}>
                                    <i className="material-icons">add</i>
                                </a>                            
                            </div>
                        </li>
                    );
                }                
            });
        }
        return (
            <ul className="collection">                    
                {ruleNodes}
            </ul>
        )
    }
    render() {
        return (
            <MainLayout title='Host detail' breadcrumbs={this.state.breadcrumbs}>
               <div className='row'>
                    <div className="input-field col s12">
                        <input disabled={true} value={this.state.hostname} name="hostame" id="hostame" type="text"/>
                        <label htmlFor="hostame">Hostname</label>
                    </div>
                    <div>
                        <h5>Rules</h5>
                        <ul className="collection">
                            {this.renderRules()}
                        </ul>
                        <br/>
                        <h5>Add rules</h5>                        
                        {this.renderAddRules()}                        
                    </div>
                </div>
            </MainLayout>        
        );
    }
}




class GenericHostRules extends Component {
    constructor(props) {
        super(props);
        this.state = { genericHostRules: [], loading: false };
        this.loadGenericHostRules = this.loadGenericHostRules.bind(this);
        this.renderGenericHostRules = this.renderGenericHostRules.bind(this);
    }
    loadGenericHostRules(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/hosts/genericrules',           
            function (data) {            
                self.setState({genericHostRules: data, loading: false});
            });
    }
    componentDidMount() {
        this.loadGenericHostRules();
    }
    renderGenericHostRules(){
        var genericHostRulesNodes;
        if(this.state.genericHostRules) {
            genericHostRulesNodes = this.state.genericHostRules.map(function (genericHostRule) {
                return (
                    <div key={genericHostRule.id} className='row'>
                        <div className='col s12'>
                            <div className='card'>
                                <div className='card-content'>
                                {genericHostRule.rule.ruleName}
                                </div>                            
                            </div>                    
                        </div>
                    </div>                    
                );
            });
        }
        return genericHostRulesNodes;
    }
    render() {
        return (
            <div>                
                {this.renderGenericHostRules()}
            </div>
        );
    }
}

export class GenericHostsRulesList extends Component {
    constructor(props) {
        super(props);        
    }    
    render() {
        return (
            <MainLayout title='Generic hosts rules'>
                <div className="right-align">                   
                    <div className="row">
                        <div className="col s12">
                            <Link className="waves-effect waves-light btn-small" to={'/ui/rules/generic/hosts/detail'}>
                                View details
                            </Link>
                        </div>
                    </div>
                </div>
                <GenericHostRules/>
            </MainLayout>
        );
    }
}

export class GenericHostRulesPage extends Component {
    constructor(props) {
        super(props);
        this.state = { rules: [], allRules: [], loadedRules: false, loading: false };
        this.loadHostRules = this.loadHostRules.bind(this);
        this.renderRules = this.renderRules.bind(this);
        this.loadAllRules = this.loadAllRules.bind(this);
        this.onRemoveRule = this.onRemoveRule.bind(this);
        this.addRule = this.addRule.bind(this);
    }
    loadHostRules(){
        this.setState({ loadedRules: false, loading: true });  
        var self = this;
        Utils.ajaxGet('/api/hosts/genericrules',           
            function (data) {                
                self.setState({rules: data, loadedRules: true, loading: false});
            });
    }
    loadAllRules() {
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/rules/host',           
            function (data) {
                self.setState({allRules: data, loading: false});
            });
    }
    componentDidMount() {
        this.loadHostRules();
        this.loadAllRules();
    }
    componentDidUpdate() {
        M.updateTextFields();
    }
    onRemoveRule(ruleId, event) {        
        var formAction = '/api/hosts/genericrules/' + ruleId;
        var formMethod = 'DELETE';
        var self = this;
        
        Utils.formSubmit(formAction, formMethod, {}, function (data) {
            M.toast({html: "<div>Rule successfully deleted from generic hosts rules!</div>"});
            self.loadHostRules();
        });
    }
    addRule(ruleId, event) {
        var formAction = '/api/hosts/genericrules/' + ruleId;
        var formMethod = 'POST';
        var self = this;
        Utils.formSubmit(formAction, formMethod, {}, function (data) {
            M.toast({html: "<div>Rule successfully added to generic host rules!</div>"});
            self.loadHostRules();
        });
    }
    renderRules() {
        var rulesNodes;
        var self = this;
        var style = {marginTop: '-4px'};
        if (this.state.rules) {
            rulesNodes = this.state.rules.map(function (hostRule) {
                return (
                    <li key={hostRule.rule.id} className="collection-item">
                        <div>
                            {hostRule.rule.ruleName}
                            <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.onRemoveRule(hostRule.rule.id, e)}>
                                <i className="material-icons">clear</i>
                            </a>                            
                        </div>
                    </li>                   
                );
            });
        }
        return rulesNodes;
    }
    renderAddRules(){
        var ruleNodes;
        var style = {marginTop: '-4px'};
        var self = this;
        function canAddRule(ruleId) {
            var i;
            for(i = 0; i < self.state.rules.length; i++){
                if(self.state.rules[i].rule.id == ruleId){
                    return false;
                }
            }
            return true;
        }
        if (this.state.allRules && this.state.loadedRules) {
            ruleNodes = this.state.allRules.map(function (rule) {
                if(canAddRule(rule.id)){
                    return (
                        <li key={rule.id} className="collection-item">
                            <div>
                                {rule.ruleName}
                                <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.addRule(rule.id, e)}>
                                    <i className="material-icons">add</i>
                                </a>                            
                            </div>
                        </li>
                    );
                }                
            });
        }
        return (
            <ul className="collection">                    
                {ruleNodes}
            </ul>
        )
    }
    render() {
        return (
            <MainLayout title='Generic hosts rules detail'>
               <div className='row'>                    
                    <div>
                        <h5>Rules</h5>
                        <ul className="collection">
                            {this.renderRules()}
                        </ul>
                        <br/>
                        <h5>Add rules</h5>                        
                        {this.renderAddRules()}                        
                    </div>
                </div>
            </MainLayout>        
        );
    }
}


class ServiceRules extends Component {
    constructor(props) {
        super(props);
        this.state = { serviceRules: [], loading: false };
        this.loadServiceRules = this.loadServiceRules.bind(this);
        this.renderServiceRules = this.renderServiceRules.bind(this);
    }
    loadServiceRules(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/services/'+ self.props.service.id +'/rules',           
            function (data) {            
                self.setState({serviceRules: data, loading: false});
            });
    }
    componentDidMount() {
        this.loadServiceRules();
    }
    renderServiceRules(){
        var serviceRulesNodes;
        if(this.state.serviceRules) {
            serviceRulesNodes = this.state.serviceRules.map(function (serviceRule) {
                return (
                    <div key={serviceRule.rule.id}>                   
                        <div className='card'>
                            <div className='card-content'>                               
                                {serviceRule.rule.ruleName}
                            </div>                            
                        </div>
                    </div>
                );
            });
        }
        return serviceRulesNodes;
    }
    render() {
        return (
            <div>
                <h5>Rules</h5>
                {this.renderServiceRules()}
            </div>
        );
    }
}

export class ServicesRulesList extends Component {
    constructor(props) {
        super(props);
        this.state = { services: [], loading: false };
        this.loadServices = this.loadServices.bind(this);
        this.renderServices = this.renderServices.bind(this);
    }
    loadServices(){
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/services',           
            function (data) {            
                self.setState({services: data, loading: false});
            });
    }
    componentDidMount(){
        this.loadServices();
    }
    renderServices() {
        var serviceNodes;
        if(this.state.services) {
            serviceNodes = this.state.services.map(function (service) {
                return (
                    <div key={service.id} className='row'>
                        <div className='col s12'>
                            <div className='card'>
                                <div className='card-content'>
                                    <div className="right-align">                   
                                        <div className="row">
                                            <div className="col s12">
                                                <Link className="waves-effect waves-light btn-small" to={'/ui/rules/services/detail/'+ service.id}>
                                                    View details
                                                </Link>
                                            </div>
                                        </div>
                                    </div> 
                                    <CardItem label='Service' value={service.serviceName}/>
                                    <ServiceRules service={service}/>
                                </div>                            
                            </div>                    
                        </div>
                    </div>
                );
            });
        }
        return serviceNodes;
    }
    render() {
        return (
            <MainLayout title='Services rules'>
                {this.renderServices()}
            </MainLayout>
        );
    }
}

export class ServiceRulesPage extends Component {
    constructor(props) {
        super(props);
        var thisServiceId = 0;
        if(props.match.params.serviceId)
        thisServiceId = props.match.params.serviceId;
        
        var thisBreadcrumbs = [ {link: '/ui/rules/services', title: 'Services rules'} ];
        this.state = { breadcrumbs: thisBreadcrumbs, serviceId: thisServiceId, service: {}, rules: [], allRules: [], loadedRules: false, loading: false };
        this.loadServiceRules = this.loadServiceRules.bind(this);
        this.renderRules = this.renderRules.bind(this);
        this.loadAllRules = this.loadAllRules.bind(this);
        this.onRemoveRule = this.onRemoveRule.bind(this);
        this.addRule = this.addRule.bind(this);
        this.loadService = this.loadService.bind(this);
    }
    loadService() { 
        var self = this;
        Utils.ajaxGet('/api/services/'+ self.state.serviceId,           
            function (data) {                
                self.setState({service: data, loading: false});
            });
    }
    loadServiceRules(){
        this.setState({ loadedRules: false, loading: true });  
        var self = this;
        Utils.ajaxGet('/api/services/'+ self.state.serviceId +'/rules',           
            function (data) {                
                self.setState({rules: data, loadedRules: true, loading: false});
            });
    }
    loadAllRules() {
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/rules/container',           
            function (data) {
                self.setState({allRules: data, loading: false});
            });
    }
    componentDidMount() {
        this.loadService();
        this.loadServiceRules();
        this.loadAllRules();
    }
    componentDidUpdate() {
        M.updateTextFields();
    }
    onRemoveRule(ruleId, event) {        
        var formAction = '/api/services/' + this.state.serviceId + '/rules';
        var formMethod = 'DELETE';
        var self = this;
        var data = {
            'serviceId': Number(self.state.serviceId),
            'ruleId': Number(ruleId)
        };
        Utils.formSubmit(formAction, formMethod, JSON.stringify(data), function (data) {
            M.toast({html: "<div>Rule successfully deleted from service rules!</div>"});
            self.loadServiceRules();
        });
    }
    addRule(ruleId, event) {
        var formAction = '/api/services/' + this.state.serviceId + '/rules';
        var formMethod = 'POST';
        var self = this;
        var data = {
            'serviceId': Number(self.state.serviceId),
            'ruleId': Number(ruleId)
        };
        Utils.formSubmit(formAction, formMethod, JSON.stringify(data), function (data) {
            M.toast({html: "<div>Rule successfully added to service rules!</div>"});
            self.loadServiceRules();
        });
    }
    renderRules() {
        var rulesNodes;
        var self = this;
        var style = {marginTop: '-4px'};
        if (this.state.rules) {
            rulesNodes = this.state.rules.map(function (serviceRule) {
                return (
                    <li key={serviceRule.rule.id} className="collection-item">
                        <div>
                            {serviceRule.rule.ruleName}
                            <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.onRemoveRule(serviceRule.rule.id, e)}>
                                <i className="material-icons">clear</i>
                            </a>                            
                        </div>
                    </li>                   
                );
            });
        }
        return rulesNodes;
    }
    renderAddRules(){
        var ruleNodes;
        var style = {marginTop: '-4px'};
        var self = this;
        function canAddRule(ruleId) {
            var i;
            for(i = 0; i < self.state.rules.length; i++){
                if(self.state.rules[i].rule.id == ruleId){
                    return false;
                }
            }
            return true;
        }
        if (this.state.allRules && this.state.loadedRules) {
            ruleNodes = this.state.allRules.map(function (rule) {
                if(canAddRule(rule.id)){
                    return (
                        <li key={rule.id} className="collection-item">
                            <div>
                                {rule.ruleName}
                                <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.addRule(rule.id, e)}>
                                    <i className="material-icons">add</i>
                                </a>                            
                            </div>
                        </li>
                    );
                }                
            });
        }
        return (
            <ul className="collection">                    
                {ruleNodes}
            </ul>
        )
    }
    render() {
        return (
            <MainLayout title='Service rules detail' breadcrumbs={this.state.breadcrumbs}>
               <div className='row'>
                    <div className="input-field col s12">
                        <input disabled={true} value={this.state.service.serviceName} name="serviceName" id="serviceName" type="text"/>
                        <label htmlFor="serviceName">Service name</label>
                    </div>
                    <div>
                        <h5>Rules</h5>
                        <ul className="collection">
                            {this.renderRules()}
                        </ul>
                        <br/>
                        <h5>Add rules</h5>                        
                        {this.renderAddRules()}                        
                    </div>
                </div>
            </MainLayout>        
        );
    }
}