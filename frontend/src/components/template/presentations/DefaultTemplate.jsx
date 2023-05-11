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
import { Card, Row } from 'react-bootstrap';
import { faProjectDiagram, faLink, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EditorContainer from '../../contents/containers/Editor';
import Sidebar from '../../sidebar/containers/Sidebar';
import SideBarToggle from '../../editor/containers/SideBarMenuToggleContainer'
import Contents from '../../contents/containers/Contents';
import DatabaseInitializerModal from '../../initializer/presentation/DatabaseInitializer';
import InitGraphModal from '../../initializer/presentation/GraphInitializer';
import Modal from '../../modal/containers/Modal';
import { loadFromCookie, saveToCookie } from '../../../features/cookie/CookieUtil';
import './DefaultTemplate.scss';

const DefaultTemplate = ({
  isActive,
  theme,
  toggleMenu,
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
    <div className="default-template container-fluid">
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
          <EditorContainer />

      <div className=" editor-division wrapper-extension-padding">
        <Sidebar />
        <Card className='dbgraph-container'>
        <button
              className="sidebar-toggle"
              type="button"
              onClick={() => {
                toggleMenu('home');
                /*
                if (!isActive) {
                  document.getElementById('wrapper')?.classList?.remove('wrapper');
                  document.getElementById('wrapper')?.classList?.add('wrapper-extension-padding');
                } else {
                  document.getElementById('wrapper')?
                  .classList?.remove('wrapper-extension-padding');
                  document.getElementById('wrapper')?.classList?.add('wrapper');
                } */
              }}
              title={(isActive) ? 'Hide' : 'Show'}
            >
              <SideBarToggle isActive={isActive} />
            </button>
        {
          database.status ==  'connected' ? (
          <div className='database-bar'>
            <p> Database Connected </p>

            <InitGraphModal show={showGraphModal} setShow={setShowGraphModal} />
            <div className='btn-container'>
              <button>
                  <FontAwesomeIcon
                    icon={faExclamationCircle}
                    size="1x"
                  />
                  <span> {dbButton} </span>
              </button>
              <button onClick={() => setShowGraphModal(!showGraphModal)}>
                  <FontAwesomeIcon
                    icon={faProjectDiagram}
                    size="1x"
                  />
                  <span> Create Graph </span>
              </button>
              </div>
          </div>
          ) : (
          <div className='database-bar'>
            <p> Connect Database</p>
              <DatabaseInitializerModal show={showDbModal} setShow={setShowDbModal} />
              <button onClick={() => setShowDbModal(!showDbModal)}>
                <FontAwesomeIcon
                  icon={faLink}
                  size="1x"
                />
                <span> {dbButton} </span>
            </button>
          </div>
          )
        }
          
        <Row className="content-row">
          <Contents />  
        </Row>
        </Card>
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
  isActive: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,

};

export default DefaultTemplate;
