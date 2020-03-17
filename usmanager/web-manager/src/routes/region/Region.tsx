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
import {loadRegions} from "../../actions";
import {connect} from "react-redux";

export interface IRegion extends IData {
  name: string;
  description: string;
  active: boolean;
}

const emptyRegion = (): Partial<IRegion> => ({
  name: '',
  description: '',
  active: true,
});

const isNewRegion = (name: string) =>
  name === 'new_region';

interface StateToProps {
  isLoading: boolean;
  error?: string | null;
  region: Partial<IRegion>;
  formRegion?: Partial<IRegion>,
}

interface DispatchToProps {
  loadRegions: (name: string) => any;
}

interface MatchParams {
  name: string;
}

type Props = StateToProps & DispatchToProps & RouteComponentProps<MatchParams>;

class Region extends BaseComponent<Props, {}> {

  componentDidMount(): void {
    const regionName = this.props.match.params.name;
    if (regionName && !isNewRegion(regionName)) {
      this.props.loadRegions(regionName);
    }
  };

  private onPostSuccess = (reply: any, regionName: string): void => {
    super.toast(`Region <b>${regionName}</b> saved`);
  };

  private onPostFailure = (reason: string, regionName: string): void =>
    super.toast(`Unable to save ${regionName}`, 10000, reason, true);

  private onPutSuccess = (regionName: string): void => {
    super.toast(`Changes to region <b>${regionName}</b> are now saved`);
  };

  private onPutFailure = (reason: string, regionName: string): void =>
    super.toast(`Unable to update ${regionName}`, 10000, reason, true);

  private onDeleteSuccess = (regionName: string): void => {
    super.toast(`Region <b>${regionName}</b> successfully removed`);
    this.props.history.push(`/regions`)
  };

  private onDeleteFailure = (reason: string, regionName: string): void =>
    super.toast(`Unable to delete ${regionName}`, 10000, reason, true);

  private getFields = (region: Partial<IRegion>): IFields =>
    Object.entries(region).map(([key, value]) => {
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

  private details = () => {
    const {isLoading, error, formRegion, region} = this.props;
    // @ts-ignore
    const regionKey: (keyof IRegion) = formRegion && Object.keys(formRegion)[0];
    return (
      <>
        {isLoading && <LoadingSpinner/>}
        {!isLoading && error && <Error message={error}/>}
        {!isLoading && !error && formRegion && (
          <Form id={regionKey}
                fields={this.getFields(formRegion)}
                values={region}
                isNew={isNewRegion(this.props.match.params.name)}
                post={{url: 'regions', successCallback: this.onPostSuccess, failureCallback: this.onPostFailure}}
                put={{url: `regions/${region[regionKey]}`, successCallback: this.onPutSuccess, failureCallback: this.onPutFailure}}
                delete={{url: `regions/${region[regionKey]}`, successCallback: this.onDeleteSuccess, failureCallback: this.onDeleteFailure}}>
            {Object.keys(formRegion).map((key, index) =>
              key === 'active'
                ? <Field key={index}
                         id={[key]}
                         label={key}
                         type="dropdown"
                         dropdown={{defaultValue: "Is region active?", values: ["True", "False"]}}/>
                : <Field key={index}
                         id={[key]}
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
      content: () => this.details()
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

function mapStateToProps(state: ReduxState, props: Props): StateToProps {
  const isLoading = state.entities.regions.isLoading;
  const error = state.entities.regions.error;
  const name = props.match.params.name;
  const region = isNewRegion(name) ? emptyRegion() : state.entities.regions.data[name];
  let formRegion;
  if (region) {
    formRegion = { ...region };
    delete formRegion["id"];
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Region);