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
