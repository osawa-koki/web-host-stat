import React, { useState } from 'react';
import Layout from '../components/Layout'
import Setting from '../setting';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Alert from 'react-bootstrap/Alert';
import { NameResolverResponse } from '../common/interface';
import Spinner from 'react-bootstrap/Spinner';

const title = `Let's 名前解決 👍`;
const copy_before_text = 'copy to clipboard';
const copy_after_text = 'copied 💞💞💞';

const NameResolvePage = () => {

  let [domain, setDomain] = useState('google.com');
  let [address, setAddress] = useState(null as string | null);
  let [error, setError] = useState(null as string | null);
  let [tooltip_comment, setTooltipComment] = useState(copy_before_text as string);
  let [solving, setSolving] = useState(false);

  function DomainIsVaid(): boolean {
    const doman_pattern = /^[a-zA-Z0-9]+([a-zA-Z0-9-]*[a-zA-Z0-9]+)*\.[a-zA-Z0-9]+([a-zA-Z0-9-]*[a-zA-Z0-9]+)*$/;
    return doman_pattern.test(domain);
  }

  async function Solve() {
    try {
      setSolving(true);
      const uri = `${Setting.apiUri}/name-resolve?domain=${domain}`;
      await fetch(uri)
      .then(res => res.json())
      .then((response: NameResolverResponse) => {
        const ip = response.address;
        setAddress(ip);
        setError(null);
      })
      .catch((err: string) => {
        setAddress(null);
        setError(err.toString());
      });
    } catch (ex) {
      setAddress(null);
      setError(ex.toString());
    } finally {
      setSolving(false);
    }
  }

  function CopyToClipboard() {
    if (address === null) {
      return;
    }
    navigator.clipboard.writeText(address)
    .then(async () => {
      setTooltipComment(copy_after_text);
      await new Promise(resolve => setTimeout(resolve, Setting.copyWaitTime));
      setTooltipComment(copy_before_text);
    })
    .catch((err) => {
      setTooltipComment(err.toString());
    });
  }

  function Reset() {
    setAddress(null);
    setError(null);
    setTooltipComment(copy_before_text);
  }

  return (
    <Layout title={title}>
      <div id='NameResolve'>
        <h1>{title}</h1>
        <p>名前解決してみませんか。</p>
        <div id='NameResolveForm'>
          <Form.Label>Enter Domain</Form.Label>
          <Form.Control type="text" value={domain} onInput={(e) => {Reset(); setDomain((e.target as HTMLInputElement).value);}} />
          <Form.Text>
            Guess the IP address of the domain name!
          </Form.Text>
          <Button disabled={DomainIsVaid() === false || solving === true} onClick={() => {Reset(); Solve();}}>
            {
              solving === true ?
              <><Spinner animation="grow" variant="light" size="sm" />&nbsp;Solving</>
              :
              <>Solve&nbsp;{DomainIsVaid() ? '🤖' : '😈'}</>
            }
          </Button>
        </div>
        {
          address !== null &&
          <Alert variant="info">
            <div>IP Address: </div>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{tooltip_comment}</Tooltip>}
            >
              <Button variant="outline-primary" onClick={CopyToClipboard}>{address}</Button>
            </OverlayTrigger>
          </Alert>
        }
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
