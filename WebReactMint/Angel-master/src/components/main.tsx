import { useCallback, useEffect, useState, VFC } from 'react';
import Web3 from 'web3';

import { contractConfig } from 'config';
import TxHash from './txToast';
import s from './main.module.scss';

import gif from '../assets/metaangeldao.gif';
import { notify } from 'utils/toaster';

const Main: VFC = () => {
  const [value, setValue] = useState('1');
  const [userAddress, setUserAddress] = useState('');

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (+e.target.value >= 99) {
      setValue('99');
    } else setValue(e.target.value);
  };

  const ethWindow = window as any;

  const loginWithMetaMask = useCallback(async () => {
    if (ethWindow.ethereum) {
      const accounts = await ethWindow.ethereum.request({ method: 'eth_requestAccounts' });
      const userAcc = accounts[0];
      setUserAddress(userAcc);
      notify('Wallet connected!', 'success');
      ethWindow.userWalletAddress = userAcc;
    }

    // eslint-disable-next-line
  }, [ethWindow.ethereum, ethWindow.userWalletAddress]);

  const mintNft = async (amount: string) => {
    const web3 = new Web3(ethWindow.ethereum);
    const erc_721 = new web3.eth.Contract(contractConfig.abi, contractConfig.address);
    const price = await erc_721.methods.cost().call();
    console.log(price);

    await erc_721.methods
      .createAngel(amount)
      .send({ from: ethWindow.userWalletAddress, value: +amount * price })
      .on('transactionHash', (transactionHash: string) => {
        notify(<TxHash txId={transactionHash} />, 'info', 10000);
      })
      .then((result: any) => {
        if (Array.isArray(result.events.Transfer)) {
          notify('The NFTs are minted', 'success', 10000);
        } else {
          notify('The NFT is minted!', 'success', 10000);
        }
      });
  };

  useEffect(() => {
    loginWithMetaMask();
  }, [loginWithMetaMask]);

  return (
    <main className={s.main}>
      <div className={s.left}>
        <div className={s.gif}>
          <img src={gif} alt="gif" />
        </div>
      </div>
      <div className={s.right}>
        <div className={s.title}>Meta Angel DAO NFT</div>
        <div className={s.subtitle}>A seat on our investor board</div>

        <div className={s.price}>
          <span>Presale:</span> 0.8 ETH + Gas
        </div>
        <div className={s.price}>
          <span>Public sale:</span> 1 ETH + Gas
        </div>

        <div className={s.mint}>
          <input value={value} onChange={(e) => onInputChange(e)} type="text" />
          <button
            disabled={!userAddress}
            type="button"
            onClick={() => mintNft(value)}
            className={s.button}
          >
            mint
          </button>
        </div>

        <div className={s.info}>
          {/* eslint-disable */}
          {ethWindow.ethereum
            ? userAddress
              ? `ETH Wallet Address: ${userAddress}`
              : 'Please connect to MetaMask'
            : 'Please Install Metamask'}
        </div>
      </div>
    </main>
  );
};

export default Main;
