
import React from 'react';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import './MainLayout.scss';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout d-flex">
      <Sidebar />
      <div className="content flex-grow-1">
        <Header />
        <div className="p-3">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
