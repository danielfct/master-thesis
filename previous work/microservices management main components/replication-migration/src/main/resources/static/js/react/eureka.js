var $ = require('jquery');
const React = require('react');
const Link = require('react-router-dom').Link;
const Redirect = require('react-router-dom').Redirect;
const Component = React.Component;
import Utils from './utils';
import {MainLayout, CardItem} from './globalComponents';



export class EurekaPage extends Component {
    constructor(props) {
        super(props);
    
        this.state = { choosenRegions: [], availableRegions: [], formSubmit: false, loading: false};
       
        this.loadRegions = this.loadRegions.bind(this);
        this.addRegion = this.addRegion.bind(this);
        this.onRemoveRegion = this.onRemoveRegion.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.renderChoosenRegions = this.renderChoosenRegions.bind(this);
        this.renderAvailableRegions = this.renderAvailableRegions.bind(this);
        this.renderEurekaPageComponents = this.renderEurekaPageComponents.bind(this);
    }
    componentDidMount() {
        this.loadRegions();
    }
    loadRegions() {
        this.setState({ loading: true });  
        var self = this;
        Utils.ajaxGet('/api/regions',           
            function (data) {             
                self.setState({availableRegions: data, loading: false});
            });
    }
    addRegion(regionId, event) {
        var self = this;
        function getIndex(regionId, regions) {
            var i;
            for(i = 0; i < regions.length; i++){
                if(regions[i].id == regionId){
                    return i;
                }
            }
        }
        var newAvailableRegions = self.state.availableRegions;
        var index = getIndex(regionId, newAvailableRegions);
        newAvailableRegions.splice(index, 1);
        this.setState({ loading: true });          
        Utils.ajaxGet('/api/regions/' + regionId,           
            function (data) {
                var newChoosenRegions = self.state.choosenRegions;
                newChoosenRegions.push(data);
                self.setState({availableRegions: newAvailableRegions, choosenRegions: newChoosenRegions, loading: false});
            });
    }  
    onRemoveRegion(regionId, event){
        var self = this;
        function getIndex(regionId, regions) {
            var i;
            for(i = 0; i < regions.length; i++){
                if(regions[i].id == regionId){
                    return i;
                }
            }
        }

        var newChoosenRegions = self.state.choosenRegions;
        var index = getIndex(regionId, newChoosenRegions);
        newChoosenRegions.splice(index, 1);
        this.setState({ loading: true });          
        Utils.ajaxGet('/api/regions/' + regionId,           
            function (data) {
                var newAvailableRegions = self.state.availableRegions;                
                newAvailableRegions.push(data);
                self.setState({availableRegions: newAvailableRegions, choosenRegions: newChoosenRegions, loading: false});
            });
        
    }
    onSubmitForm(event){
        event.preventDefault();
        var self = this;
        var formAction = '/api/launch/eureka' ;
        var formMethod = 'POST';
        var formData = JSON.stringify(self.state.choosenRegions);  
        Utils.formSubmit(formAction, formMethod, formData, function (data) {
            self.setState({formSubmit: true});
            var hosts = data.toString();
            M.toast({html: "<div>Eureka servers successfully launched!</br>Hosts: " + hosts + "</div>"});
        });
    }
    renderChoosenRegions() {
        var regionsNodes;
        var self = this;
        var style = {marginTop: '-4px'};
        if (this.state.choosenRegions) {
            regionsNodes = this.state.choosenRegions.map(function (region) {
                return (
                    <li key={region.id} className="collection-item">
                        <div>
                            {region.regionName + " (" + region.regionDescription + ")"}
                            <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.onRemoveRegion(region.id, e)}>
                                <i className="material-icons">clear</i>
                            </a>                            
                        </div>
                    </li>                   
                );
            });
        }
        return regionsNodes;
    }
    renderAvailableRegions(){
        var regionsNodes;
        var style = {marginTop: '-4px'};
        var self = this;        
        if (this.state.availableRegions) {
            regionsNodes = this.state.availableRegions.map(function (region) {
                return (
                    <li key={region.id} className="collection-item">
                        <div>
                        {region.regionName + " (" + region.regionDescription + ")"}
                            <a style={style} className="secondary-content btn-floating btn-small waves-effect waves-light" onClick={(e) => self.addRegion(region.id, e)}>
                                <i className="material-icons">add</i>
                            </a>                            
                        </div>
                    </li>
                );                              
            });
        }
        return (
            <ul className="collection">                    
                {regionsNodes}
            </ul>
        )
    }
    renderEurekaPageComponents(){        
        return (
            <div>
                <h5>Choosen Regions</h5>
                <ul className="collection">
                    {this.renderChoosenRegions()}
                </ul>
                <form id='launchEurekaForm' onSubmit={this.onSubmitForm}>                
                    <button disabled={this.state.choosenRegions.length == 0} className="btn waves-effect waves-light" type="submit" name="action">
                        Launch eureka servers
                        <i className="material-icons right">send</i>
                    </button>
                </form>
                <br/>
                <h5>Available regions</h5>
                {this.renderAvailableRegions()}
            </div>
        )
    }
    render() {
        if(this.state.formSubmit){
            return <Redirect to='/ui/home' />;
        }    
        return (
            <MainLayout title='Launch Eureka servers' breadcrumbs={this.state.breadcrumbs}>
                {this.renderEurekaPageComponents()}
            </MainLayout>            
        );
    }
}