import React, { useState } from 'react';
import Layout from '../components/Layout'
import Setting from '../setting';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { LookupHostResponse } from '../common/interface';

const title = `Let's ホスト検索 👍`;
const copy_before_text = 'copy to clipboard';
const copy_after_text = 'copied 💞💞💞';

const LookupHostPage = () => {

  let [domain, setDomain] = useState('google.com');
  let [addresses, setAddresses] = useState([] as string[]);
  let [error, setError] = useState(null as string | null);
  let [tooltip_comment, setTooltipComment] = useState(copy_before_text as string);
  let [searching, setSearching] = useState(false);

  function DomainIsValid(): boolean {
    return Setting.domainPattern.test(domain);
  }

  async function Solve() {
    try {
      setSearching(true);
      const uri = `${Setting.apiUri}/lookup-host?domain=${domain}`;
      await fetch(uri)
      .then(res => res.json())
      .then((response: LookupHostResponse) => {
        const ip = response.address;
        if (ip === null) {
          setAddresses([]);
          setError('No IP address found');
          return;
        }
        setAddresses(ip);
        setError(null);
      })
      .catch((err: string) => {
        setAddresses([]);
        setError(err.toString());
      });
    } catch (ex) {
      setAddresses([]);
      setError(ex.toString());
    } finally {
      setSearching(false);
    }
  }

  function CopyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    .then(async () => {
      setTooltipComment(copy_after_text);
      await new Promise(resolve => setTimeout(resolve, Setting.copyWaitTime));
      setTooltipComment(copy_before_text);
    })
    .catch((err: string) => {
      setError(err.toString());
    });
  }

  function Reset() {
    setAddresses([]);
    setError(null);
    setTooltipComment(copy_before_text);
  }

  return (
    <Layout title={title}>
      <div id='LookupHost'>
        <h1>{title}</h1>
        <p>名前解決と異なり、複数のIPアドレスが検索可能です。</p>
        <div id='LookupHostForm'>
          <FloatingLabel label="Domain">
            <Form.Control type="text" value={domain} onInput={(e) => {Reset(); setDomain((e.currentTarget as HTMLInputElement).value);}} />
          </FloatingLabel>
          <Button disabled={DomainIsValid() === false || searching === true} onClick={() => {Reset(); Solve();}}>
            {
              searching === true ?
              <><Spinner animation="border" variant="info" size="sm" />&nbsp;Solving</>
              :
              <>Solve&nbsp;{DomainIsValid() ? '🤖' : '😈'}</>
            }
          </Button>
        </div>
        {
          addresses.map((address, _) => {
            return (
              <Alert key={address} variant="info">
                <div>IP Address: </div>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>{tooltip_comment}</Tooltip>}
                >
                  <Button variant="outline-primary" onClick={() => {CopyToClipboard(address)}}>{address}</Button>
                </OverlayTrigger>
              </Alert>
            )
          })
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

export default LookupHostPage;
