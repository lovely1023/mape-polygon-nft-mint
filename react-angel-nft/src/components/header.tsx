import { VFC } from 'react';

import s from './header.module.scss';

const Header: VFC = () => {
  return <header className={s.header}>
    <a href="https://metaangeldao.com">META ANGEL DAO</a></header>;
};

export default Header;
