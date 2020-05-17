import Data from "../../components/IData";
import BaseComponent from "../../components/BaseComponent";
import {RouteComponentProps} from "react-router";
import Form, {IFields, required} from "../../components/form/Form";
import Field from "../../components/form/Field";
import ListLoadingSpinner from "../../components/list/ListLoadingSpinner";
import Error from "../../components/errors/Error";
import React from "react";
import Tabs, {Tab} from "../../components/tabs/Tabs";
import MainLayout from "../../views/mainLayout/MainLayout";
import {ReduxState} from "../../reducers";
import {addAppService, loadApps} from "../../actions";
import {connect} from "react-redux";
import AppServicesList, {IAddAppService, IAppService} from "./AppServicesList";
import {IReply, postData} from "../../utils/api";
import UnsavedChanged from "../../components/form/UnsavedChanges";

export interface IApp extends Data {
  name: string;
  services: { [key: string]: IAppService }
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
  addAppService: (appName: string, appService: IAddAppService) => void;
}

interface MatchParams {
  name: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

type State = {
  unsavedServices: IAddAppService[],
  appName?: string,
  isLoading: boolean,
}

class App extends BaseComponent<Props, State> {

  state: State = {
    unsavedServices: [],
    isLoading: false,
  };

  componentDidMount(): void {
    const appName = this.props.match.params.name;
    if (appName && !isNewApp(appName)) {
      this.props.loadApps(appName);
    }
  };

  private onAddAppService = (service: IAddAppService): void => {
    this.setState({
      unsavedServices: this.state.unsavedServices.concat(service)
    });
  };

  private onRemoveAppServices = (services: string[]): void => {
    this.setState({
      unsavedServices: this.state.unsavedServices.filter(service => !services.includes(service.service))
    });
  };

  private saveAppServices = (app: IApp): void => {
    const {unsavedServices} = this.state;
    if (unsavedServices.length) {
      postData(`apps/${app.name}/services`, unsavedServices,
        () => this.onSaveServicesSuccess(app),
        (reason) => this.onSaveServicesFailure(app, reason));
    }
  };

  private onSaveServicesSuccess = (app: IApp): void => {
    this.state.unsavedServices.forEach(service => this.props.addAppService(app.name, service));
    this.setState({ unsavedServices: [] });
  };

  private onSaveServicesFailure = (app: IApp, reason: string): void =>
    super.toast(`Unable to save services of app ${app.name}`, 10000, reason, true);

  private saveEntities = (app: IApp) => {
    this.saveAppServices(app);
  };

  private onPostSuccess = (reply: IReply<IApp>): void => {
    super.toast(`App <b>${reply.data.name}</b> saved`);
    this.saveEntities(reply.data);
  };

  private onPostFailure = (reason: string, appName: string): void =>
    super.toast(`Unable to save ${appName}`, 10000, reason, true);

  private onPutSuccess = (reply: IReply<IApp>): void => {
    super.toast(`Changes to app <b>${reply.data.name}</b> are now saved`);
    this.setState({appName: reply.data.name});
    this.saveEntities(reply.data);
  };

  private onPutFailure = (reason: string, app: IApp): void =>
    super.toast(`Unable to update ${app.name}`, 10000, reason, true);

  private onDeleteSuccess = (appName: string): void => {
    super.toast(`App <b>${appName}</b> successfully removed`);
    this.props.history.push(`/apps`);
  };

  private onDeleteFailure = (reason: string, appName: string): void =>
    super.toast(`Unable to delete ${appName}`, 10000, reason, true);

  private getFields = (app: Partial<IApp>): IFields =>
    Object.entries(app).map(([key, _]) => {
      return {
        [key]: {
          id: key,
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
    !!this.state.unsavedServices.length;

  private launchButton = () =>
    <button className={`btn-flat btn-small waves-effect waves-light blue-text`} onClick={this.launchApp}>
      Launch
    </button>;

  private launchApp = () => {
    this.setState({isLoading: true});
    postData(`apps/${this.props.app.name}/launch`, undefined,
      (reply: IReply<IApp>) => this.onLaunchSuccess(reply),
      (reply: string) => this.onLaunchFailure(reply));
  };

  private onLaunchSuccess = (reply: IReply<IApp>) => {
    super.toast(`Successfully launched ${reply.data.name}`, 15000);
    this.setState({isLoading: false});
  };

  private onLaunchFailure = (reason: string) => {
    super.toast(`Failed to launch ${this.props.app.name}`, 10000, reason, true);
    this.setState({isLoading: false});
  };

  private app = () => {
    const {isLoading, error, formApp, app} = this.props;
    // @ts-ignore
    const appKey: (keyof IApp) = formApp && Object.keys(formApp)[0];
    const isNew = isNewApp(this.props.match.params.name);
    return (
      <>
        {isLoading && <ListLoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && formApp && (
          <Form id={appKey}
                fields={this.getFields(formApp)}
                values={app}
                isNew={isNew}
                showSaveButton={this.shouldShowSaveButton()}
                post={{url: 'apps', successCallback: this.onPostSuccess, failureCallback: this.onPostFailure}}
                put={{url: `apps/${this.state.appName || app[appKey]}`, successCallback: this.onPutSuccess, failureCallback: this.onPutFailure}}
                delete={{url: `apps/${this.state.appName || app[appKey]}`, successCallback: this.onDeleteSuccess, failureCallback: this.onDeleteFailure}}
                /*customButtons={!isNew ? this.launchButton() : undefined}TODO*/
                saveEntities={this.saveEntities}
                loading={this.state.isLoading}>
            {Object.keys(formApp).map((key, index) =>
              <Field key={index}
                     id={key}
                     label={key}/>
            )}
          </Form>
        )}
      </>
    )
  };

  private entitiesList = (element: JSX.Element) => {
    const {isLoading, error, app} = this.props;
    if (isLoading) {
      return <ListLoadingSpinner/>;
    }
    if (error) {
      return <Error message={error}/>;
    }
    if (app) {
      return element;
    }
    return <></>;
  };

  private services = (): JSX.Element =>
    this.entitiesList(<AppServicesList app={this.props.app}
                                       unsavedServices={this.state.unsavedServices}
                                       onAddAppService={this.onAddAppService}
                                       onRemoveAppServices={this.onRemoveAppServices}/>);

  private tabs: Tab[] = [
    {
      title: 'App',
      id: 'app',
      content: () => this.app()
    },
    {
      title: 'Services',
      id: 'services',
      content: () => this.services()
    }
  ];

  render() {
    return (
      <MainLayout>
        {this.shouldShowSaveButton() && !isNewApp(this.props.match.params.name) && <UnsavedChanged/>}
        <div className="container">
          <Tabs {...this.props} tabs={this.tabs}/>
        </div>
      </MainLayout>
    );
  }

}

function mapStateToProps(state: ReduxState, props: Props): StateToProps {
  const isLoading = state.entities.apps.isLoadingApps;
  const error = state.entities.apps.loadAppsError;
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