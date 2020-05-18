import Data from "../../components/IData";
import BaseComponent from "../../components/BaseComponent";
import {RouteComponentProps} from "react-router";
import Form, {ICustomButton, IFields, required} from "../../components/form/Form";
import Field from "../../components/form/Field";
import ListLoadingSpinner from "../../components/list/ListLoadingSpinner";
import Error from "../../components/errors/Error";
import React from "react";
import Tabs, {Tab} from "../../components/tabs/Tabs";
import MainLayout from "../../views/mainLayout/MainLayout";
import {ReduxState} from "../../reducers";
import {addApp, addAppService, loadApps} from "../../actions";
import {connect} from "react-redux";
import AppServicesList, {IAddAppService, IAppService} from "./AppServicesList";
import {IReply, postData} from "../../utils/api";
import UnsavedChanged from "../../components/form/UnsavedChanges";
import {normalize} from "normalizr";
import {Schemas} from "../../middleware/api";

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
  app: Partial<IApp>;
  formApp?: Partial<IApp>;
}

interface DispatchToProps {
  loadApps: (name: string) => void;
  addApp: (app: IApp) => void;
  addAppService: (appName: string, appService: IAddAppService) => void;
}

interface MatchParams {
  name: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

type State = {
  app?: IApp,
  formApp?: IApp,
  unsavedServices: IAddAppService[],
  isLoading: boolean,
}

class App extends BaseComponent<Props, State> {

  private mounted = false;

  state: State = {
    unsavedServices: [],
    isLoading: false,
  };

  componentDidMount(): void {
    this.loadApp();
    this.mounted = true;
  };

  componentWillUnmount(): void {
    this.mounted = false;
  }

  private loadApp = () => {
    const appName = this.props.match.params.name;
    if (appName && !isNewApp(appName)) {
      this.props.loadApps(appName);
    }
  };

  private getApp = () =>
    this.state.app || this.props.app;

  private getFormApp = () =>
    this.state.formApp || this.props.formApp;

  private onPostSuccess = (reply: IReply<IApp>): void => {
    const app = reply.data;
    this.props.addApp(app);
    this.saveEntities(app);
    if (this.mounted) {
      this.updateApp(app);
      this.props.history.replace(app.name);
    }
    super.toast(`App <b>${app.name}</b> saved`);

  };

  private onPostFailure = (reason: string, appName: string): void =>
    super.toast(`Unable to save ${appName}`, 10000, reason, true);

  private onPutSuccess = (reply: IReply<IApp>): void => {
    const app = reply.data;
    this.updateApp(app);
    this.saveEntities(app);
    super.toast(`Changes to app <b>${app.name}</b> are now saved`);
  };

  private onPutFailure = (reason: string, app: IApp): void =>
    super.toast(`Unable to update ${app.name}`, 10000, reason, true);

  private shouldShowSaveButton = () =>
    !!this.state.unsavedServices.length;

  private saveEntities = (app: IApp) => {
    this.saveAppServices(app);
  };

  private onDeleteSuccess = (app: IApp): void => {
    super.toast(`App <b>${app.name}</b> successfully removed`);
    if (this.mounted) {
      this.props.history.push(`/apps`);
    }
  };

  private onDeleteFailure = (reason: string, app: IApp): void =>
    super.toast(`Unable to delete ${app.name}`, 10000, reason, true);

  private addAppService = (service: IAddAppService): void => {
    this.setState({
      unsavedServices: this.state.unsavedServices.concat(service)
    });
  };

  private removeAppServices = (services: string[]): void => {
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
    if (this.mounted) {
      this.setState({ unsavedServices: [] });
    }
  };

  private onSaveServicesFailure = (app: IApp, reason: string): void =>
    super.toast(`Unable to save services of app ${app.name}`, 10000, reason, true);

  private launchButton = (): ICustomButton[] => {
    const buttons: ICustomButton[] = [];
    if (!isNewApp(this.props.match.params.name)) {
      buttons.push({text: 'Launch', onClick: this.launchApp});
    }
    return buttons;
  };

  private launchApp = () => {
    const app = this.getApp();
    this.setState({isLoading: true});
    postData(`apps/${app.name}/launch`, undefined,
      (reply: IReply<IApp>) => this.onLaunchSuccess(reply.data),
      (reason: string) => this.onLaunchFailure(reason, app));
  };

  private onLaunchSuccess = (app: IApp) => {
    super.toast(`Successfully launched ${app.name}`, 15000);
    if (this.mounted) {
      this.updateApp(app);
    }
  };

  private onLaunchFailure = (reason: string, app: Partial<IApp>) => {
    super.toast(`Failed to launch ${app.name}`, 10000, reason, true);
    if (this.mounted) {
      this.setState({isLoading: false});
    }
  };

  private updateApp = (app: IApp) => {
    app = Object.values(normalize(app, Schemas.APP).entities.apps || {})[0];
    const formApp = { ...app };
    removeFields(formApp);
    this.setState({app: app, formApp: formApp, isLoading: false});
  };

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

  private app = () => {
    const {isLoading, error} = this.props;
    const app = this.getApp();
    const formApp = this.getFormApp();
    // @ts-ignore
    const appKey: (keyof IApp) = formApp && Object.keys(formApp)[0];
    return (
      <>
        {isLoading && <ListLoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && formApp && (
          <Form id={appKey}
                fields={this.getFields(formApp)}
                values={app}
                isNew={isNewApp(this.props.match.params.name)}
                showSaveButton={this.shouldShowSaveButton()}
                post={{
                  url: 'apps',
                  successCallback: this.onPostSuccess,
                  failureCallback: this.onPostFailure
                }}
                put={{
                  url: `apps/${app.name}`,
                  successCallback: this.onPutSuccess,
                  failureCallback: this.onPutFailure
                }}
                delete={{
                  url: `apps/${app.name}`,
                  successCallback: this.onDeleteSuccess,
                  failureCallback: this.onDeleteFailure
                }}
                customButtons={this.launchButton()}
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
    const {isLoading, error} = this.props;
    const app = this.getApp();
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
    this.entitiesList(<AppServicesList app={this.getApp()}
                                       unsavedServices={this.state.unsavedServices}
                                       onAddAppService={this.addAppService}
                                       onRemoveAppServices={this.removeAppServices}/>);

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

function removeFields(app: Partial<IApp>) {
  delete app["id"];
  delete app["services"];
}

function mapStateToProps(state: ReduxState, props: Props): StateToProps {
  const isLoading = state.entities.apps.isLoadingApps;
  const error = state.entities.apps.loadAppsError;
  const name = props.match.params.name;
  const app = isNewApp(name) ? emptyApp() : state.entities.apps.data[name];
  let formApp;
  if (app) {
    formApp = { ...app };
    removeFields(formApp);
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
  addApp,
  addAppService
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
