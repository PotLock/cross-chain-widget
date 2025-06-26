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
      />
    </>
  );
}

export default App;
