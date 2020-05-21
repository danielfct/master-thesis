import IDatabaseData from "../../components/IDatabaseData";
import BaseComponent from "../../components/BaseComponent";
import {RouteComponentProps} from "react-router";
import Form, {IFields, requiredAndTrimmed} from "../../components/form/Form";
import Field from "../../components/form/Field";
import ListLoadingSpinner from "../../components/list/ListLoadingSpinner";
import Error from "../../components/errors/Error";
import React from "react";
import Tabs, {Tab} from "../../components/tabs/Tabs";
import MainLayout from "../../views/mainLayout/MainLayout";
import {ReduxState} from "../../reducers";
import {addRegion, loadRegions} from "../../actions";
import {connect} from "react-redux";
import {IReply} from "../../utils/api";
import {isNew} from "../../utils/router";
import {normalize} from "normalizr";
import {Schemas} from "../../middleware/api";

export interface IRegion extends IDatabaseData {
  name: string;
  description: string;
  active: boolean;
}

const buildNewRegion = (): Partial<IRegion> => ({
  name: '',
  description: '',
  active: true,
});

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  region: Partial<IRegion>;
  formRegion?: Partial<IRegion>,
}

interface DispatchToProps {
  loadRegions: (name: string) => void;
  addRegion: (region: IRegion) => void;
  //updateRegion: (previousRegion: Partial<IRegion>, region: IRegion) => void;
}

interface MatchParams {
  name: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

interface State {
  region?: IRegion,
  formRegion?: IRegion,
}

class Region extends BaseComponent<Props, State> {

  private mounted = false;

  state: State = {
  };

  componentDidMount(): void {
    this.loadRegion();
    this.mounted = true;
  };

  componentWillUnmount(): void {
    this.mounted = false;
  }

  private loadRegion = () => {
    if (!isNew(this.props.location.search)) {
      const regionName = this.props.match.params.name;
      this.props.loadRegions(regionName);
    }
  };

  private getRegion = () =>
    this.state.region || this.props.region;

  private getFormRegion = () =>
    this.state.formRegion || this.props.formRegion;

  private onPostSuccess = (reply: IReply<IRegion>): void => {
    const region = reply.data;
    super.toast(`<span class="green-text">Region ${region.name} saved</span>`);
    this.props.addRegion(region);
    if (this.mounted) {
      this.updateRegion(region);
      this.props.history.replace(region.name);
    }
  };

  private onPostFailure = (reason: string, region: IRegion): void =>
    super.toast(`Unable to save ${region.name}`, 10000, reason, true);

  private onPutSuccess = (reply: IReply<IRegion>): void => {
    const region = reply.data;
    super.toast(`<span class="green-text">Changes to region ${region.name} have been saved</span>`);
    if (this.mounted) {
      this.updateRegion(region);
      this.props.history.replace(region.name);
    }
  };

  private onPutFailure = (reason: string, region: IRegion): void =>
    super.toast(`Unable to update ${region.name}`, 10000, reason, true);

  private onDeleteSuccess = (region: IRegion): void => {
    super.toast(`<span class="green-text">Region ${region.name} successfully removed</span>`);
    if (this.mounted) {
      this.props.history.push(`/regions`);
    }
  };

  private onDeleteFailure = (reason: string, region: IRegion): void =>
    super.toast(`Unable to delete ${region.name}`, 10000, reason, true);

  private updateRegion = (region: IRegion) => {
    //const previousRegion = this.getRegion();
    region = Object.values(normalize(region, Schemas.REGION).entities.regions || {})[0];
    //TODO this.props.updateRegion(previousRegion, region);
    const formRegion = { ...region };
    removeFields(formRegion);
    this.setState({region: region, formRegion: formRegion});
  };

  private getFields = (region: Partial<IRegion>): IFields =>
    Object.keys(region).map(key => {
      return {
        [key]: {
          id: key,
          label: key,
          validation: { rule: requiredAndTrimmed }
        }
      };
    }).reduce((fields, field) => {
      for (let key in field) {
        fields[key] = field[key];
      }
      return fields;
    }, {});

  private region = () => {
    const {isLoading, error} = this.props;
    const region = this.getRegion();
    const formRegion = this.getFormRegion();
    // @ts-ignore
    const regionKey: (keyof IRegion) = formRegion && Object.keys(formRegion)[0];
    return (
      <>
        {isLoading && <ListLoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && formRegion && (
          <Form id={regionKey}
                fields={this.getFields(formRegion)}
                values={region}
                isNew={isNew(this.props.location.search)}
                post={{
                  url: 'regions',
                  successCallback: this.onPostSuccess,
                  failureCallback: this.onPostFailure
                }}
                put={{
                  url: `regions/${region.name}`,
                  successCallback: this.onPutSuccess,
                  failureCallback: this.onPutFailure
                }}
                delete={{
                  url: `regions/${region.name}`,
                  successCallback: this.onDeleteSuccess,
                  failureCallback: this.onDeleteFailure
                }}>
            {Object.keys(formRegion).map((key, index) =>
              key === 'active'
                ? <Field key={index}
                         id={key}
                         label={key}
                         type="dropdown"
                         dropdown={{
                           defaultValue: "Is region active?",
                           values: ['True', 'False']}}/>
                : <Field key={index}
                         id={key}
                         label={key}/>
            )}
          </Form>
        )}
      </>
    )
  };

  private tabs: Tab[] = [
    {
      title: 'Region',
      id: 'region',
      content: () => this.region()
    },
  ];

  render() {
    return (
      <MainLayout>
        <div className="container">
          <Tabs {...this.props} tabs={this.tabs}/>
        </div>
      </MainLayout>
    );
  }

}

function removeFields(region: Partial<IRegion>) {
  delete region["id"];
}

function mapStateToProps(state: ReduxState, props: Props): StateToProps {
  const isLoading = state.entities.regions.isLoadingRegions;
  const error = state.entities.regions.loadRegionsError;
  const name = props.match.params.name;
  const region = isNew(props.location.search) ? buildNewRegion() : state.entities.regions.data[name];
  let formRegion;
  if (region) {
    formRegion = { ...region };
    removeFields(formRegion);
  }
  return  {
    isLoading,
    error,
    region,
    formRegion,
  }
}

const mapDispatchToProps: DispatchToProps = {
  loadRegions,
  addRegion,
  //TODO updateRegion,
};

export default connect(mapStateToProps, mapDispatchToProps)(Region);