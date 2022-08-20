/* import { useCallback, useEffect } from "react";

const AccountObserver = ({ children }) => {
  const handleAccountChange = useCallback(() => {
    window.location.reload(false);
  }, []);
  useEffect(() => {
    window.ethereum.on("chainChanged", (_) => {
      handleAccountChange();
    });
    return () => {};
  }, [handleAccountChange]);

  return children;
};
export default AccountObserver;
 */
