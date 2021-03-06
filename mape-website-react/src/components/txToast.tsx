import { FC } from 'react';

import s from './txToast.module.scss';

interface IProps {
  txId: string;
}

const TxToast: FC<IProps> = ({ txId }) => (
  <span>
    Rinkeby scaner tx:{' '}
    <a
      className={s.link}
      target="_blank"
      rel="noreferrer noopener"
      href={`https://etherscan.io/tx/${txId}`}
    >
      {`${txId.slice(0, 5)}...${txId.slice(-5)}`}
    </a>
  </span>
);

export default TxToast;
