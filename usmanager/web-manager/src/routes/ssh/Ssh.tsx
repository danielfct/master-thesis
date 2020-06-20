/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import MainLayout from "../../views/mainLayout/MainLayout";
import Tabs from "../../components/tabs/Tabs";
import React from "react";
import SshCommand, {ISshCommand} from "./SshCommand";
import SshFile from "./SshFile";
import styles from "./Ssh.module.css";
import {Resizable} from "re-resizable";
import ScrollBar from "react-perfect-scrollbar";
import {ReduxState} from "../../reducers";
import {connect} from "react-redux";

interface StateToProps {
  sidenavVisible: boolean;
}

type Props = StateToProps;

interface State {
  commands: ISshCommand[];
  commandsHeight: number;
  animate: boolean;
}

class Ssh extends React.Component<Props, State> {

  private commandsScrollbar: (ScrollBar | null) = null;
  private controlsScrollbar: (ScrollBar | null) = null;
  private COMMANDS_MIN_HEIGHT = 44;
  private COMMANDS_DEFAULT_HEIGHT = 175;

  constructor(props: Props) {
    super(props);
    this.state = {
      commands: [],
      commandsHeight: this.COMMANDS_DEFAULT_HEIGHT,
      animate: false,
    }
  }

  componentDidMount() {
    this.updateScrollbars();
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
    if (!this.state.animate && prevProps.sidenavVisible !== this.props.sidenavVisible) {
      this.setState({animate: true});
    }
  }

  private tabs = () => [
    {
      title: 'Execute command',
      id: 'executeCommand',
      content: () => <SshCommand/>
    },
    {
      title: 'Upload file',
      id: 'uploadFile',
      content: () => <SshFile/>
    }
  ];

  private onResize = () =>
   this.updateScrollbars();

  private updateScrollbars = () => {
    this.commandsScrollbar?.updateScroll();
    this.controlsScrollbar?.updateScroll();
  }

  private toggleCommands = () =>
    this.setState({commandsHeight: this.state.commandsHeight <= this.COMMANDS_MIN_HEIGHT ? this.COMMANDS_DEFAULT_HEIGHT : this.COMMANDS_MIN_HEIGHT},
      () => setTimeout(() => this.updateScrollbars(), 500));

  private clearCommands = () =>
    this.setState({commands: []});

  public render() {
    return (
      <MainLayout>
        <div className="container">
          <Tabs tabs={this.tabs()}/>
        </div>
        <Resizable className={`${styles.commandsContainer} ${this.state.animate ? (this.props.sidenavVisible ? styles.shrink : styles.expand) : ''}`}
                   onResize={this.onResize}
                   enable={{top: true}}
                   size={{
                     width: this.props.sidenavVisible ? window.innerWidth - 200 : window.innerWidth,
                     height: this.state.commandsHeight }}
                   onResizeStop={(e, direction, ref, d) => {
                     this.setState({
                       commandsHeight: this.state.commandsHeight + d.height,
                     });
                   }}>
          <div className={styles.controlsMenu}>
            <ScrollBar ref = {(ref) => { this.controlsScrollbar = ref; }}>
              <button className='btn-floating btn-flat btn-small' onClick={this.clearCommands}>
                <i className="material-icons grey-text">delete_sweep</i>
              </button>
            </ScrollBar>
          </div>
          <ScrollBar ref = {(ref) => { this.commandsScrollbar = ref; }} style={{flexGrow: 1}}>
            <div>
              <div className={styles.commandsHeader}>
                <div className={styles.commandsTitle}>
                  Commands
                </div>
                <button className={`btn-floating btn-flat ${styles.toggleCommandsButton}`} onClick={this.toggleCommands}>
                  <i className="material-icons">{this.state.commandsHeight <= this.COMMANDS_MIN_HEIGHT ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
                </button>
              </div>
            </div>
            <div className={styles.commands}>
              {this.state.commands.map((command, index) => (
                <div key={index}>
                  <div className={styles.command}>
                    {command.hostname}: {command.command}
                  </div>
                  {command.output}
                </div>
              ))}
            </div>
          </ScrollBar>
        </Resizable>
      </MainLayout>
    );
  }
}

const mapStateToProps = (state: ReduxState): StateToProps => (
  {
    sidenavVisible: state.ui.sidenav.user && state.ui.sidenav.width,
  }
);

export default connect(mapStateToProps)(Ssh);