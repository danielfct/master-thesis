import Data from "../../components/IData";
import {IAddServiceApp, IAppService} from "../services/ServiceAppList";
import IData from "../../components/IData";
import BaseComponent from "../../components/BaseComponent";
import {RouteComponentProps} from "react-router";
import Form, {IFields, required} from "../../components/form/Form";
import Field from "../../components/form/Field";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import Error from "../../components/errors/Error";
import React from "react";
import Tabs, {Tab} from "../../components/tabs/Tabs";
import MainLayout from "../../views/mainLayout/MainLayout";
import {ReduxState} from "../../reducers";
import {addAppService, loadApps} from "../../actions";
import {connect} from "react-redux";
import AppServicesList from "./AppServicesList";
import {postData} from "../../utils/api";
import UnsavedChanged from "../../components/form/UnsavedChanges";

export interface IApp extends Data {
  name: string;
  services: IAppService[]
}

const emptyApp = (): Partial<IApp> => ({
  name: '',
});

const isNewApp = (name: string) =>
  name === 'new_app';

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  formApp?: Partial<IApp>;
  app: Partial<IApp>;
}

interface DispatchToProps {
  loadApps: (name: string) => any;
  addAppService: (appName: string, service: string) => void;
}

interface MatchParams {
  name: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

type State = {
  newServices: string[],
  appName?: string,
}

class App extends BaseComponent<Props, State> {

  state: State = {
    newServices: []
  };

  componentDidMount(): void {
    const appName = this.props.match.params.name;
    if (appName && !isNewApp(appName)) {
      this.props.loadApps(appName);
    }
  };

  private onAddAppService = (service: string): void => {
    this.setState({
      newServices: this.state.newServices.concat(service)
    });
  };

  private onRemoveAppServices = (services: string[]): void => {
    this.setState({
      newServices: this.state.newServices.filter(service => !services.includes(service))
    });
  };

  private saveAppServices = (appName: string): void => {
    const {newServices} = this.state;
    if (newServices.length) {
      postData(`apps/${appName}/services`, newServices,
        () => this.onSaveServicesSuccess(appName),
        (reason) => this.onSaveServicesFailure(appName, reason));
    }
  };

  private onSaveServicesSuccess = (appName: string): void => {
    if (!isNewApp(this.props.match.params.name)) {
      this.state.newServices.forEach(service =>
        this.props.addAppService(appName, service)
      );
    }
    this.setState({ newServices: [] });
  };

  private onSaveServicesFailure = (appName: string, reason: string): void =>
    super.toast(`Unable to save services of app ${appName}`, 10000, reason, true);

  private saveEntities = (appName: string) => {
    this.saveAppServices(appName);
  };

  private onPostSuccess = (reply: any, appName: string): void => {
    super.toast(`App <b>${appName}</b> saved`);
    this.saveEntities(appName);
  };

  private onPostFailure = (reason: string, appName: string): void =>
    super.toast(`Unable to save ${appName}`, 10000, reason, true);

  private onPutSuccess = (appName: string): void => {
    super.toast(`Changes to app <b>${appName}</b> are now saved`);
    this.setState({appName: appName});
    this.saveEntities(appName);
  };

  private onPutFailure = (reason: string, appName: string): void =>
    super.toast(`Unable to update ${appName}`, 10000, reason, true);

  private onDeleteSuccess = (appName: string): void => {
    super.toast(`App <b>${appName}</b> successfully removed`);
    this.props.history.push(`/apps`);
  };

  private onDeleteFailure = (reason: string, appName: string): void =>
    super.toast(`Unable to delete ${appName}`, 10000, reason, true);

  private getFields = (app: Partial<IApp>): IFields =>
    Object.entries(app).map(([key, value]) => {
      return {
        [key]: {
          id: [key],
          label: key,
          validation: { rule: required }
        }
      };
    }).reduce((fields, field) => {
      for (let key in field) {
        fields[key] = field[key];
      }
      return fields;
    }, {});

  private shouldShowSaveButton = () =>
    !!this.state.newServices.length;

  private details = () => {
    const {isLoading, error, formApp, app} = this.props;
    // @ts-ignore
    const appKey: (keyof IApp) = formApp && Object.keys(formApp)[0];
    return (
      <>
        {isLoading && <LoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && formApp && (
          <Form id={appKey}
                fields={this.getFields(formApp)}
                values={app}
                isNew={isNewApp(this.props.match.params.name)}
                showSaveButton={this.shouldShowSaveButton()}
                post={{url: 'apps', successCallback: this.onPostSuccess, failureCallback: this.onPostFailure}}
                put={{url: `apps/${this.state.appName || app[appKey]}`, successCallback: this.onPutSuccess, failureCallback: this.onPutFailure}}
                delete={{url: `apps/${this.state.appName || app[appKey]}`, successCallback: this.onDeleteSuccess, failureCallback: this.onDeleteFailure}}
                saveEntities={this.saveEntities}>
            {Object.keys(formApp).map((key, index) =>
              <Field key={index}
                     id={[key]}
                     label={key}/>
            )}
          </Form>
        )}
      </>
    )
  };

  private services = (): JSX.Element =>
    <AppServicesList app={this.props.app}
                     newServices={this.state.newServices}
                     onAddAppService={this.onAddAppService}
                     onRemoveAppServices={this.onRemoveAppServices}/>;

  private rules = (): JSX.Element =>
    <></>; //TODO

  private tabs: Tab[] = [
    {
      title: 'App',
      id: 'app',
      content: () => this.details()
    },
    {
      title: 'Services',
      id: 'services',
      content: () => this.services()
    },
    {
      title: 'Rules',
      id: 'rules',
      content: () => this.rules()
    }
  ];

  render() {
    return (
      <MainLayout>
        {this.shouldShowSaveButton() && <UnsavedChanged/>}
        <div className="container">
          <Tabs {...this.props} tabs={this.tabs}/>
        </div>
      </MainLayout>
    );
  }

}

function mapStateToProps(state: ReduxState, props: Props): StateToProps {
  const isLoading = state.entities.apps.isLoading;
  const error = state.entities.apps.error;
  const name = props.match.params.name;
  const app = isNewApp(name) ? emptyApp() : state.entities.apps.data[name];
  let formApp;
  if (app) {
    formApp = { ...app };
    delete formApp["id"];
    delete formApp["services"];
  }
  return  {
    isLoading,
    error,
    app,
    formApp,
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadApps,
  addAppService
};

export default connect(mapStateToProps, mapDispatchToProps)(App);