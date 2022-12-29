import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout'
import Setting from '../setting';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Alert from 'react-bootstrap/Alert';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { default as port_data, DangerLevel } from '../common/ports';
import { PortscanResponse } from '../common/interface';

const title = `Let's ポートスキャン 👍`;
const waittime_min = 3;
const waittime_max = 60;

const NameResolvePage = () => {

  let interval: NodeJS.Timeout;

  let [domain, setDomain] = useState('google.com');
  let [ports, setPorts] = useState([] as number[]);
  let [from, setFrom] = useState(50);
  let [to, setTo] = useState(100);
  let [waittime, setWaittime] = useState(5);
  let [error, setError] = useState(null as string | null);
  let [scanning, setScanning] = useState(false as boolean);
  let [timecount, setTimecount] = useState(0 as number);

  function DomainIsVaid(): boolean {
    const doman_pattern = /^[a-zA-Z0-9]+([a-zA-Z0-9-]*[a-zA-Z0-9]+)*\.[a-zA-Z0-9]+([a-zA-Z0-9-]*[a-zA-Z0-9]+)*$/;
    return doman_pattern.test(domain);
  }

  useEffect(() => {
    setTimeout(() => {
      if (timecount >= waittime) return;
      setTimecount(timecount + 1);
    }, 1000);
  }, [timecount]);

  async function Scan() {
    try {
      setScanning(true);
      setTimecount(0);
      const uri = `${Setting.apiUri}/port-scan?domain=${domain}&from=${from}&to=${to}&waittime=${waittime}`;
      await fetch(uri)
      .then(res => res.json())
      .then((response: PortscanResponse) => {
        const open_ports = response.open.sort((a, b) => a - b);
        if (open_ports === null) {
          setError(response.message);
          return;
        }
        setPorts(open_ports);
        setError(null);
      })
      .catch((err: string) => {
        setPorts([]);
        setError(err.toString());
      });
    } catch (ex) {
      setPorts([]);
      setError(ex.toString());
    } finally {
      setScanning(false);
      clearInterval(interval);
    }
  }

  function AlertVar(port: number) {
    if (port_data[port] === undefined) {
      return 'secondary';
    }
    const danger_level = port_data[port].danger_level;
    switch (danger_level) {
      case DangerLevel.LOW:
        return 'success';
      case DangerLevel.MIDDLE:
        return 'warning';
      case DangerLevel.HIGH:
        return 'danger';
    }
  }

  return (
    <Layout title={title}>
      <div id='Portscan'>
        <h1>{title}</h1>
        <p>ポートスキャンしてみましょう♪</p>
        <div id='PortscanForm'>
          <FloatingLabel label="Domain">
            <Form.Control type="text" value={domain} onInput={(e) => {setPorts([]); setDomain((e.currentTarget as HTMLInputElement).value);}} />
          </FloatingLabel>
          <div className='number waittime'>Wait time: '{waittime}' sec</div>
          <Form.Range className='value waittime' min={waittime_min} max={waittime_max} onInput={(e) => {setPorts([]); setWaittime(parseInt((e.currentTarget as HTMLInputElement).value));}} />
          <div className='number from'>From: </div>
          <Form.Control type="number" className=' value from' value={from} onInput={(e) => {setPorts([]); setFrom(parseInt((e.currentTarget as HTMLInputElement).value));}} />
          <div className='number to'>To: </div>
          <Form.Control type="number" className='value to' value={to} onInput={(e) => {setPorts([]); setTo(parseInt((e.currentTarget as HTMLInputElement).value));}} />
          <Button disabled={DomainIsVaid() === false || scanning === true} onClick={() => {setPorts([]); Scan();}}>
            {
              scanning === true ?
              <><Spinner animation="grow" variant="info" size="sm" />&nbsp;Scanning</>
              :
              <>Scan {DomainIsVaid() ? '🤖' : '😈'}</>
            }
          </Button>
        </div>
        <div id='PortscanProgress'>
          {
            scanning === true &&
            <ProgressBar striped variant="info" animated now={timecount / waittime * 100} label={`${Math.floor(timecount / waittime * 100)}%`} />
          }
        </div>
        <div id='PortscanResult'>
          {
            ports.map((port, _) => {
              return (
                <Alert key={port} variant={AlertVar(port)}>
                  <div>Port "{port}" is open.</div>
                  <div>{port_data.map((_port, _) => {return _port.port === port ?
                    <OverlayTrigger
                      key={_port.port}
                      placement='top'
                      overlay={
                        <Tooltip>{_port.description_ja}</Tooltip>
                      }
                      >
                        <Button variant="secondary">{_port.description}</Button>
                    </OverlayTrigger>
                    : <div key={_port.port}></div>})}
                  </div>
                </Alert>
              )
            })
          }
        </div>
        {
          error !== null &&
          <Alert variant="danger">
            <p>Error: {error}</p>
          </Alert>
        }
      </div>
    </Layout>
  )
};

export default NameResolvePage;
