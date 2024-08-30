import { useState, useEffect } from "react";
function useNetwork() {
  const [state, setState] = useState(() => {
    return {
      since: undefined,
      online: navigator.onLine,
      // ...getNetworkConnectionInfo(),
    };
  });
useEffect(() => {
    const handleOnline = () => {
      setState((prevState:any) => ({
        ...prevState,
        online: true,
        since: new Date().toString(),
      }));
    };
const handleOffline = () => {
      setState((prevState:any) => ({
        ...prevState,
        online: false,
        since: new Date().toString(),
      }));
    };
window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
return state;
}
export default useNetwork;