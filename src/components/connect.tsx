// import { useEthers, useLookupAddress } from '@usedapp/core'
import { FC } from 'react'
/* 
const Connect: FC = () => {
  const { active, account, activateBrowserWallet } = useEthers();
  const { ens } = useLookupAddress(account);
  return active && account ? (
    <p
      className="white-comp capped pointer-events-none "
      style={{
        opacity: "50%",
      }}
    >
      {ens ?? account}
    </p>
  ) : (
    <button
      className="white-comp capped cursor-pointer"
      onClick={activateBrowserWallet}
    >
      Connect
    </button>
  );
};
export default Connect; */
/*
const Connect: FC = () => {
  const { active, account, activateBrowserWallet } = useEthers();
  const { ens } = useLookupAddress(account);
  const { isLoggedIn, signIn, signOut } = useSiwe();

  return active && account ? (
    isLoggedIn ? (
      <button className="white-comp" onClick={() => signOut()}>
        Sign Out
      </button>
    ) : (
      <button className="white-comp" onClick={() => signIn()}>
        Sign In
      </button>
    )
  ) : (
    <button className="white-comp" onClick={activateBrowserWallet}>
      Connect
    </button>
  );
};
export default Connect;
 */
/* <p
        className="white-comp capped pointer-events-none "
        style={{
          opacity: "50%",
        }}
      >
        {ens ?? account}
      </p> */
