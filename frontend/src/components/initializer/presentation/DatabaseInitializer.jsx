import React from 'react';
import PropTypes from 'prop-types';
import {
    Input, InputNumber, Form
} from 'antd';
import { Modal, Row, Col, Button, Spinner, Alert,
} from 'react-bootstrap';
import { connectToDatabase as connectToDatabaseApi, changeGraph } from '../../../features/database/DatabaseSlice';
import { addAlert } from '../../../features/alert/AlertSlice';
import { addFrame, trimFrame } from '../../../features/frame/FrameSlice';
import { getMetaData } from '../../../features/database/MetadataSlice';
import './Databaseinit.scss';
import { useDispatch } from 'react-redux';

const FormInitialValue = {
    database: '',
    graph: '',
    host: '',
    password: '',
    port: null,
    user: '',
};


const DatabaseInitializerModal = ({ show, setShow }) => {
    const dispatch = useDispatch()

    const connectToDatabase = (data) => dispatch(connectToDatabaseApi(data)).then((response) => {
            if (response.type === 'database/connectToDatabase/fulfilled') {
                dispatch(addAlert('NoticeServerConnected'))
                dispatch(getMetaData({ currentGraph})).then((metadataResponse) => {
                    if (metadataResponse.type === 'database/getMetaData/fulfilled') {
                        const graphName = Object.keys(metadataResponse.payload)[0];
                        dispatch(changeGraph({ graphName }))
                    }

                    if (metadataResponse.type === 'database/getMetaData/rejected') {
                        dispatch(addAlert('ErrorMetaFail'));
                    }
                });
            } else if ( response.type === 'database/connectToDatabase/rejected') {
                dispatch(addAlert('ErrorServerConnectFail', response.error.message));
            }
        })
    return (
    <Modal className="ModalContainer" show={show} onHide={() => setShow(!show)}>
        <Modal.Header closeButton>
          <Row id="headerRow">
            <Modal.Title>Connect to Database</Modal.Title>

          </Row>
        </Modal.Header>
        <div>
            <Form
              initialValues={FormInitialValue}
              layout="vertical"
              onFinish={connectToDatabase}
            >
        <Modal.Body>
          <Col className="modalCol">
          <p>Database access might require an authenticated connection.</p>
        
              <Form.Item name="host" label="Connect URL" rules={[{ required: true }]}>
                <Input placeholder="192.168.0.1" />
              </Form.Item>
              <Form.Item name="port" label="Connect Port" rules={[{ required: true }]}>
                <InputNumber placeholder="5432"/>
              </Form.Item>
              <Form.Item name="database" label="Database Name" rules={[{ required: true }]}>
                <Input placeholder="postgres" />
              </Form.Item>
              <Form.Item name="user" label="User Name" rules={[{ required: true }]}>
                <Input placeholder="postgres" />
              </Form.Item>
              <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                <Input.Password placeholder="postgres" />
              </Form.Item>

            
          </Col>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button id="clearButton" onClick={clearState}>
            Clear
          </Button>
          <Button onClick={handleSubmit}>
            Done
          </Button> */}
              <Form.Item>
                <Button type="primary" htmlType="submit">Connect</Button>
              </Form.Item>
        </Modal.Footer>
        </Form>
          </div>
    </Modal>
    )

}


DatabaseInitializerModal.propTypes = {
    show: PropTypes.bool.isRequired,
    setShow: PropTypes.func.isRequired,
  };

export default DatabaseInitializerModal;