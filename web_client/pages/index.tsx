import Link from 'next/link';
import pages from '../common/pages';
import Layout from '../components/Layout';
import Setting from '../setting';

const title = `Hello "web-host-stat" 👋`

const IndexPage = () => (
  <Layout title={title}>
    <div id='Index'>
      <div id="IndexHead">
        <h1>{title}</h1>
        <img src={`${Setting.basePath}/tako.png`} alt="Logo" />
      </div>
      <div id='IndexContents'>
        {
          pages.map((page, index) => (
            <Link key={index} href={page.path}>{page.name}</Link>
          ))
        }
      </div>
    </div>
  </Layout>
);

export default IndexPage;
