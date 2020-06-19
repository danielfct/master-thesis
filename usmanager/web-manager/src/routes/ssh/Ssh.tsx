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
import SshCommand from "./SshCommand";
import SshFile from "./SshFile";
import styles from "./Ssh.module.css";
import {Resizable} from "re-resizable";
import ScrollBar from "react-perfect-scrollbar";
import {ReduxState} from "../../reducers";
import {connect} from "react-redux";
import {Direction} from "re-resizable/lib/resizer";

interface StateToProps {
  sidenavVisible: boolean;
}

type Props = StateToProps;

interface State {
  showingCommands: boolean;
  commandsHeight: number;
}

class Ssh extends React.Component<Props, State> {

  private scrollbar: (ScrollBar | null) = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      showingCommands: true,
      commandsHeight: 190
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

  private onResize = (event: MouseEvent | TouchEvent, direction: Direction, elementRef: HTMLElement) => {
    this.scrollbar?.updateScroll();
    if (direction === 'top') {
      if (elementRef.clientHeight <= 38 && this.state.showingCommands) {
        this.setState({showingCommands: false});
      }
      if (elementRef.clientHeight > 38 && !this.state.showingCommands) {
        this.setState({showingCommands: true});
      }
    }
  }

  private updateScrollbar = () =>
    this.scrollbar?.updateScroll();

  private toggleCommands = () => {
      this.setState({showingCommands: !this.state.showingCommands, commandsHeight: this.state.showingCommands ? 190 : 0},
        () => setTimeout(() => this.updateScrollbar(), 500));
    }

  public render() {
      return (
        <MainLayout>
          <div className="container">
            <Tabs tabs={this.tabs()}/>
          </div>
          <Resizable className={`${styles.commandsContainer}`}
                     onResize={this.onResize}
                     size={{
                       width: window.outerWidth - 200,
                       height: this.state.commandsHeight }}
                     onResizeStop={(e, direction, ref, d) => {
                       this.setState({
                         commandsHeight: this.state.commandsHeight + d.height,
                       });
                     }}>
            <ScrollBar ref = {(ref) => { this.scrollbar = ref; }}>
              <div>
                <div className={styles.commandsHeader}>
                  <div className={styles.commandsTitle}>
                    Commands
                  </div>
                  <button className={`btn-floating btn-flat ${styles.toggleCommandsButton}`} onClick={this.toggleCommands}>
                    <i className="material-icons">{this.state.showingCommands ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}</i>
                  </button>
                </div>
              </div>
              <div className={styles.commands}>
                <div className={styles.command}>
                  127.0.0.1: hostname -i
                </div>
                Sample with default size
                <div className={styles.command}>
                  127.0.0.1: hostname -i
                </div>
                Sample with default size
                <div className={styles.command}>
                  127.0.0.1: hostname -i
                </div>
                Sample with default size
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