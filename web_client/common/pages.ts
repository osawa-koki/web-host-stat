
type _Page = {
  name: string;
  name_ja: string;
  path: string;
  is_active: boolean;
};

const _pages: _Page[] = [
  {
    name: "Home",
    name_ja: "ホーム",
    path: "/",
    is_active: true,
  },
  {
    name: "About",
    name_ja: "このサイトについて",
    path: "/about",
    is_active: true,
  },
  {
    name: "NameResolve",
    name_ja: "名前解決",
    path: "/name-resolve",
    is_active: true,
  },
  {
    name: "PortScan",
    name_ja: "ポートスキャン",
    path: "/port-scan",
    is_active: true,
  }
];

const pages = _pages.filter((page) => page.is_active);

export default pages;
