/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Row } from 'react-bootstrap';
import { Button } from 'antd';
import EditorContainer from '../../contents/containers/Editor';
import Sidebar from '../../sidebar/containers/Sidebar';
import Contents from '../../contents/containers/Contents';
import DatabaseInitializerModal from '../../initializer/presentation/DatabaseInitializer';
import InitGraphModal from '../../initializer/presentation/GraphInitializer';
import Modal from '../../modal/containers/Modal';
import { loadFromCookie, saveToCookie } from '../../../features/cookie/CookieUtil';
import './DefaultTemplate.scss';

const DefaultTemplate = ({
  theme,
  maxNumOfFrames,
  database,
  maxNumOfHistories,
  maxDataOfGraph,
  maxDataOfTable,
  changeSettings,
  isOpen,
}) => {
  const dispatch = useDispatch();
  const [stateValues] = useState({
    theme,
    maxNumOfFrames,
    maxNumOfHistories,
    maxDataOfGraph,
    maxDataOfTable,
  });
  const [dbButton, setDbButton] = useState('');
  const [showDbModal, setShowDbModal] = useState(false);
  const [showGraphModal, setShowGraphModal] = useState(false);


  useEffect(() => {
    if (database.status === 'connected') {
  //     if (!setting.connectionStatusSkip) {
  //       dispatch(() => addFrame(':server status', 'ServerStatus'));
  //     }
  setDbButton('Disconnect')
    }

    if (database.status === 'disconnected') {
      setDbButton('Connect')
      //     const serverConnectFrames = frameList.filter((frame) => (frame.frameName.toUpperCase() === 'SERVERCONNECT'));
  //     if (!setting.closeWhenDisconnect) {
  //       dispatch(() => addFrame(':server connect', 'ServerConnect'));
  //     } else if (serverConnectFrames.length === 0) {
  //       window.close();
  //     }
    }
  }, [database.status]);
  useEffect(() => {
    let isChanged = false;
    const cookieState = {
      theme,
      maxNumOfFrames,
      maxNumOfHistories,
      maxDataOfGraph,
      maxDataOfTable,
    };

    Object.keys(stateValues).forEach((key) => {
      let fromCookieValue = loadFromCookie(key);

      if (fromCookieValue !== undefined && key !== 'theme') {
        fromCookieValue = parseInt(fromCookieValue, 10);
      }

      if (fromCookieValue === undefined) {
        saveToCookie(key, stateValues[key]);
      } else if (fromCookieValue !== stateValues[key]) {
        cookieState[key] = fromCookieValue;
        isChanged = true;
      }
    });

    if (isChanged) {
      dispatch(() => changeSettings(Object.assign(stateValues, cookieState)));
    }
  });

  return (
    <div className="default-template">
      { isOpen && <Modal /> }
      <input
        type="radio"
        className="theme-switch"
        name="theme-switch"
        id="default-theme"
        checked={theme === 'default'}
        readOnly
      />
      <input
        type="radio"
        className="theme-switch"
        name="theme-switch"
        id="dark-theme"
        checked={theme === 'dark'}
        readOnly
      />
        <div className="editor-division wrapper-extension-padding">
          <div>

          <EditorContainer />
          <Sidebar />


          </div>
          <div>
          

          {
            database.status ==  'connected' ? (
            <div className='database-bar'>
              <p> connected</p>

              <InitGraphModal show={showGraphModal} setShow={setShowGraphModal} />
              <Button onClick={() => setShowGraphModal(!showGraphModal)}> Create Graph </Button>
              <Button >{dbButton}</Button>
            </div>
            ) : (
            <div className='database-bar'>
              <p> connect to server</p>

              <DatabaseInitializerModal show={showDbModal} setShow={setShowDbModal} />
              <Button onClick={() => setShowDbModal(!showDbModal)}>{dbButton}</Button>
            </div>
            )
          }
            
          <Row className="content-row">
            <Contents />  
          </Row>
          </div>
        </div>


    </div>
  );
};

DefaultTemplate.propTypes = {
  theme: PropTypes.string.isRequired,
  maxNumOfFrames: PropTypes.number.isRequired,
  maxNumOfHistories: PropTypes.number.isRequired,
  maxDataOfGraph: PropTypes.number.isRequired,
  maxDataOfTable: PropTypes.number.isRequired,
  changeSettings: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  database: PropTypes.shape({
    status: PropTypes.string.isRequired,
    host: PropTypes.string.isRequired,
  }).isRequired,
};

export default DefaultTemplate;
