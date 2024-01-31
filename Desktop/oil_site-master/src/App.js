import Header from "./component/Header";
import Main_page from "./component/Main_page";
import Mission from "./component/mission";
import Values from "./component/Values";
import History from "./component/History";
import Down from "./component/down";
import Maps from "./component/maps";

function App() {
  return (
    <div className="wrapper">
      <Header />
      <Main_page />
      <Mission />
      <Values />
      <History />
      <Down/>
    </div>
  );
}

export default App;
