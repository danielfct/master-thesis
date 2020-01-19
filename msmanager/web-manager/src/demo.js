/*
 * MIT License
 *
 * Copyright (c) 2020 msmanager
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

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { fetchPhotos } from './redux/reducers/photos'
import { calculatePi } from './redux/reducers/pi'

import Photos from './components/photos'
import Pi from './components/pi'

class Demo extends React.Component {

  handleFetchPhotos = () => {
    this.props.actions.fetchPhotos()
  };

  handleCalculatePi = () => {
    this.props.actions.calculatePi()
  };

  render() {
    return (
      <div className="center">
        <a
          href="https://github.com/mironov/react-redux-loading-bar"
          style={{ fontSize: '3.25rem' }}
        >
          react-redux-loading-bar
        </a>
        <p>Simple Loading Bar for Redux and React</p>
        <main>
          <Photos
            photos={this.props.photos}
            handleFetchPhotos={this.handleFetchPhotos}
          />
          <Pi
            pi={this.props.pi}
            handleCalculatePi={this.handleCalculatePi}
          />
        </main>
      </div>
    )
  }
}

Demo.propTypes = {
  actions: PropTypes.object.isRequired,
  photos: PropTypes.array.isRequired,
  pi: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  photos: state.photos,
  pi: state.pi.default || 0,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { fetchPhotos, calculatePi },
    dispatch,
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Demo)
