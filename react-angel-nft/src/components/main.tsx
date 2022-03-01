// import { useCallback, useEffect, useState, VFC } from 'react';
import { useEffect, useState, VFC } from 'react';
import Web3 from 'web3';

import { contractConfig } from 'config';
import TxHash from './txToast';
import s from './main.module.scss'

import gif from '../assets/MAPE.gif';
import { notify } from 'utils/toaster';

const Main: VFC = () => {
  const [value, setValue] = useState('1');
  const [userAddress, setUserAddress] = useState('');
  const [signedIn, setSignedIn] = useState(false)


  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (+e.target.value >= 10) {
      setValue('10');
    } else setValue(e.target.value);
  };

  const ethWindow = window as any;

  const loginWithMetaMask = async () => {
    if (typeof ethWindow.web3 !== 'undefined') {
      // Use existing gateway
      ethWindow.web3 = new Web3(ethWindow.ethereum);
     
      ethWindow.ethereum.enable()
        .then(function (accounts : any) {
          ethWindow.web3.eth.net.getNetworkType()
            // checks if connected network is mainnet (change this to rinkeby if you wanna test on testnet)
            .then((network : any) => {
                console.log(network);
              // setNetwork(network)
                if(network !== "main"){                  
                  // notify(`You are on ${network} network. Change network to mainnet or you won't be able to do anything here.`, 'info');
                } 
            }).catch(function (err: any) {
                console.log(err)
            });  

            // const wallet : any = accounts[0]
            const userAcc = accounts[0];
            setUserAddress(userAcc);
            notify('Wallet connected!', 'success');
            ethWindow.userWalletAddress = userAcc;
            // setWalletAddress(wallet)
            // setSignedIn(true)
            // console.log(wallet);
            // callContractData(wallet)
        })
        .catch(function (error: any) {
        // Handle error. Likely the user rejected the login
        console.error(error)
        })

        const chainId = await ethWindow.ethereum.request({ method: 'eth_chainId' });
        const chainNum = parseInt(chainId, 16)
        if (chainNum === 0x89){
          notify('Network: Polygon mainnet', 'success');
        } else if (chainNum === 0x13881){  //  0x13881 - 80001
          notify('Network: Polygon testnet', 'success');
        } else {
          notify('Please connect Polygon network', 'error');
        }
        console.log('network id --- ', chainId)    
        
        setSignedIn(true)
    } else {
      notify("No Pologon interface injected into browser. Read-only access", 'error');   
    }
  };

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
    setSignedIn(false)
  }, []);

  return (
    <main className={s.main}>
      <div className={s.left}>
        <div className={s.gif}>
          <img src={gif} alt="gif" />
        </div>
      </div>
      <div className={s.right}>
        <div className={s.title}>MAPE</div>
        <div className={s.subtitle}>Spread Your Wings 🦋</div>

        <div className={s.price}>
          <span>Presale:</span> 99 Matic + Gas
        </div>
        <div className={s.price}>
          <span>Public sale:</span> 130 Matic + Gas
        </div>
        { signedIn ? 
          <>
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
                  ? `Matic Wallet Address: ${userAddress}`
                  : 'Please connect to MetaMask'
                : 'Please Install Metamask'}
            </div>
          </>
          :
          <>
            <div className={s.mint}>
              <button             
                type="button"
                onClick={() => loginWithMetaMask()}
                className={s.button}
              >          
              Connect
              </button>
            </div>
            <div className={s.info}>
              {ethWindow.ethereum
                ? 'Please connect to MetaMask'
                : 'Please Install Metamask'}             
            </div>
          </>
        }
      </div>
    </main>
  );
};

export default Main;
