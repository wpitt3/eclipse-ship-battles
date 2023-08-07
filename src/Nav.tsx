import React from 'react';
import './Nav.css';

function Nav( {setPage}: {
    setPage: (page:string) => void;
    page: string,
}) {
    return (
        <div className="navbar">
            <button onClick={() => setPage('build')} >Build</button>
            <button onClick={() => setPage('battle')} >Battle</button>
        </div>
    );
}

export default Nav;
