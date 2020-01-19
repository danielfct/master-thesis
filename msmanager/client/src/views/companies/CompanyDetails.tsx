import * as React from 'react';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import { Panel, Label } from 'react-bootstrap';
import { companyFetchData } from '../../actions/company';
import { ICompany, IUser } from '../../reducers/items';
import {ClipLoader} from "react-spinners";
import {FilteredList} from "../../components/list/FilteredList";

interface ICompanyDetailsProps {
  match: any;
  company: ICompany;
  isLoading: boolean;
  hasErrored: boolean;
  fetchData: (id: string) => void;
  name: string;
}

class CompanyDetails extends React.Component<ICompanyDetailsProps,any> {
  constructor(props: ICompanyDetailsProps) {
      super(props);
  }

  public componentDidMount() {
    this.props.fetchData(this.props.match.params.id);
  }

  public render() {
    if (this.props.hasErrored) {
      return <p>Oops! Houve um erro ao carregar os dados.</p>;
    }
      if (this.props.isLoading) {
          return <ClipLoader/>;
      }

    const { company } = this.props;

    return (<Fragment>
      <Panel>

      {
        company &&
        <Fragment>
          <Panel.Body>
            <Label>Company details</Label><br /><br />
            <Label>Name:</Label> { company.name } <br />
            <Label>City:</Label> { company.city } <br />
            <Label>Address:</Label> { company.address } <br />
            <Label>Zipcode:</Label> { company.zipCode } <br />
            <Label>Phone:</Label> { company.phone } <br />
            <Label>Email:</Label> { company.email } <br />
            <Label>Fax:</Label> { company.fax } <br /><br />
            <Label>Employees details</Label><br /><br />
              {
                company.employees &&
                <FilteredList<IUser>
                  list={company.employees}
                  show={this.show}
                  select={() => console.log('Employee selected!')}
                  predicate={this.predicate}
                />
              }
          </Panel.Body>
          </Fragment>
      }

      </Panel>
    </Fragment>);
  }

  private predicate = (c:any,s:string) => (String(c.firstName)+String(c.lastName)).indexOf(s) !== -1;

  private show = (p: any) =>
      <div>
          <Panel.Heading>
              <Panel.Title toggle>{p.firstName}</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
              {p.email}
          </Panel.Body>
      </div>
}

const mapStateToProps = (state: any) => {
    return {
        company: state.company,
        hasErrored: state.itemsHasErrored,
        isLoading: state.itemsIsLoading
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        fetchData: (id: string) => dispatch(companyFetchData(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyDetails);
