import Link from 'next/link';
import Layout from '../components/Layout';
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ports from '../common/ports';

const PortPage = () => (
  <Layout title="ポート一覧">
    <div id='Port'>
      <h1>ポート一覧</h1>
      <p>ポート番号とそれに紐づけられたサービス、そのポートを開放することの危険性を記載しています。</p>
      <div id='Portlist'>
        <Table bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Service</th>
              <th>IsDanger</th>
              <th>Protocol</th>
            </tr>
          </thead>
          <tbody>
            {
              ports.map((port, _) => (
                <tr key={port.port}>
                  <td>{port.port}</td>
                  <td>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>{port.description}</Tooltip>}
                  >
                    <div>{port.service}</div>
                  </OverlayTrigger>
                  </td>
                  <td className={`danger-level ${port.danger_level.toString()}`}>{port.danger_level.toString()}</td>
                  <td className='protocol'>{port.protocol.map((proto) => <div key={proto}>{proto}</div>)}</td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </div>
    </div>
  </Layout>
)

export default PortPage
