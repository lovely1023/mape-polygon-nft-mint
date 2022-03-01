import { useState, VFC } from 'react';

import s from './Password.module.scss';

import { password } from 'config';

interface IProps {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Password: VFC<IProps> = ({ setIsLogin }) => {
  const [pass, setPass] = useState('');

  const handleButtonClick = () => {
    if (password === pass) {
      setIsLogin(true);
    }
  };

  return (
    <section className={s.pass}>
      <div className={s.block}>
        <input
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <button onClick={handleButtonClick} type="button">
          Enter
        </button>
      </div>
    </section>
  );
};

export default Password;
