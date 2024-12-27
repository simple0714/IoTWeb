import React from 'react';
import AdHeader from '../components/AdminHeader';
import AdNav from '../components/AdminNav';

function AdminAboutList() {
  return (
    <main style={{
        display: "grid", gridTemplateColumns: "0.8fr 3fr", gridTemplateRows: "20px 800px", 
    }}>
        <AdNav />
        <AdHeader style={{
            gridColumn: "2/3", gridRow: "1/2",
        }} />
        <main style={{
            gridColumn: "2/3", gridRow: "2/3", width: "1000px", marginLeft: "20px",
        }}>
            <h1>About List</h1>
            
        </main>
    </main>
  );
};

export default AdminAboutList;
