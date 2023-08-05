import React, {useState} from 'react';
import './App.css';
import FactionManagement from "./management/FactionManagement";
import Nav from "./Nav";
import BattleManage from "./battles/BattleManage";

function App() {
  const [page, setPage] = useState<string>('build');
  return (
      <div>
        <Nav page={page} setPage={setPage}/>
          {page !== 'build' || <FactionManagement />}
          {page !== 'battle' || <BattleManage />}
      </div>
  );
}

export default App;
