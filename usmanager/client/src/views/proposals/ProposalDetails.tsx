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
import { Panel, Tabs, Tab, Label } from 'react-bootstrap';
import { proposalFetchData } from '../../actions/proposal';
import { IProposal } from '../../reducers/items';
import Reviews from '../reviews/Reviews';
import Users from '../users/Users';
import Comments from './comments/Comments';
import {ClipLoader} from "react-spinners";

interface IRouteInfo { proposalId: string; }

interface IProposalDetailsProps {
  match: IRouteInfo;
  proposal: IProposal;
  isLoading: boolean;
  hasErrored: boolean;
  fetchData: () => void;
}

class ProposalDetails extends React.Component<IProposalDetailsProps,any> {
  constructor(props: IProposalDetailsProps) {
      super(props);
      this.state = { renderTab: "reviews" }
  }

  public componentDidMount() {
    this.props.fetchData();
  }

  public render() {
    if (this.props.hasErrored) {
      return <p>Oops! Houve um erro ao carregar os dados.</p>;
    }
      if (this.props.isLoading) {
          return <ClipLoader/>;
      }

    const { proposal } = this.props;

    return (<Fragment>
      <Panel>
        <Panel.Body>
          <Label>Title:</Label> {proposal.title} <br />
          <Label>Description:</Label> {proposal.description} <br />
          <Label>Creation date:</Label> {proposal.creationDate} <br/>
          <Label>Proposer:</Label> {proposal.proposer} <br/>
        </Panel.Body>
      </Panel>
      <Tabs defaultActiveKey={this.state.renderTab} id="proposals-tab" name="tabController" onSelect={this.onSelect}>
        <Tab eventKey="comments" title="Comments">
          {this.state.renderTab === "comments" && <Comments />}
        </Tab>
        <Tab eventKey="reviews" title="Reviews">
          {this.state.renderTab === "reviews" && <Reviews />}
        </Tab>
        <Tab eventKey="members" title="Members">
          {this.state.renderTab === "members" && <Users />}
        </Tab>
      </Tabs>
    </Fragment>);
  }

  private onSelect = (renderTab: any) => this.setState({ renderTab });
}

const mapStateToProps = (state: any) => {
    return {
        proposal: state.proposal,
        hasErrored: state.proposalsHasErrored,
        isLoading: state.proposalsIsLoading
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        fetchData: () => dispatch(proposalFetchData())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProposalDetails);
