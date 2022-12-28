import React, { useState } from 'react';
import Layout from '../components/Layout'
import Setting from '../setting';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Alert from 'react-bootstrap/Alert';
import { LookupHostResponse } from '../common/interface';

const title = `Let's ホスト検索 👍`;
const copy_before_text = 'copy to clipboard';
const copy_after_text = 'copied 💞💞💞';

const LookupHostPage = () => {

  let [domain, setDomain] = useState('google.com');
  let [addresses, setAddresses] = useState(null as string[] | null);
  let [error, setError] = useState(null as string | null);
  let [tooltip_comment, setTooltipComment] = useState(copy_before_text as string);

  function DomainIsValid(): boolean {
    return Setting.domainPattern.test(domain);
  }

  function Solve() {
    try {
      const uri = `${Setting.apiUri}/lookup-host?domain=${domain}`;
      fetch(uri)
      .then(res => res.json())
      .then((response: LookupHostResponse) => {
        const ip = response.address;
        setAddresses(ip);
        setError(null);
      })
      .catch((err: string) => {
        setAddresses(null);
        setError(err.toString());
      });
    } catch (ex) {
      setAddresses(null);
      setError(ex.toString());
    }
  }

  function CopyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    .then(() => {
      setTooltipComment(copy_after_text);
      setTimeout(() => {
        setTooltipComment(copy_before_text);
      }, 1000);
    })
    .catch((err: string) => {
      setError(err.toString());
    });
  }

  return (
    <Layout title={title}>
      <div id='LookupHost'>
        <h1>{title}</h1>
        <p>名前解決と異なり、複数のIPアドレスが検索可能です。</p>
        <div id='LookupHostForm'>
          <FloatingLabel label="Domain">
            <Form.Control type="text" value={domain} onInput={(e) => {setAddresses([]); setDomain((e.currentTarget as HTMLInputElement).value);}} />
          </FloatingLabel>
          <Button disabled={DomainIsValid() === false} onClick={Solve}>Solve {DomainIsValid() ? '🤖' : '😈'}</Button>
        </div>
        {
          addresses !== null &&
          addresses.map((address, _) => {
            return (
              <Alert variant="info">
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
