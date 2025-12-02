import "./App.css";

import Widget from "./widget/components/Widget";


function App() {
  return (
    <>
      <Widget
        walletID={null}
        DonationType={"POTLOCK Campaigns"}
        color={"black"}
        AssetName={null}
        textColor = {"white"}
        fontType = {null}
        textInfo = {null}
        selectedCampaigns={null}
      />
    </>
  );
}


// function App() {
//   return (
//     <>
//       <Widget
//         walletID={ 't1Yf8KMstVBhiJATMqcqbbvMb8okxortfsN'}
//         DonationType={"POTLOCK "}
//         color={"black"}
//         AssetName={"nep141:zec.omft.near"}
//         textColor = {"white"}
//         fontType = {null}
//         textInfo = {null}
//         selectedCampaigns={null}
//       />
//     </>
//   );
// }


export default App;
