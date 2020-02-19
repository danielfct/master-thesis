/*
 * MIT License
 *
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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

  componentDidMount(): void {
    this.props.fetchData(this.props.match.params.id);
  }

  render() {
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
