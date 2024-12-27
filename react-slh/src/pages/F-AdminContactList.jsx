import React from 'react';
import { Box } from '@mui/material';
import AdHeader from '../components/AdminHeader';
import AdNav from '../components/AdminNav';
import AdContact from '../components/AdminContact';


function AdminContactList() {
    return (
        <Box sx={{
            display: "grid",
            gridTemplateColumns: "230px 1fr",
            gridTemplateRows: "auto 1fr",
            minHeight: '100vh',
            width: '100%',
        }}>
            <Box sx={{ 
                gridColumn: "1 / 2", 
                gridRow: "1 / 3",
            }}>
                <AdNav />
            </Box>
            <Box sx={{ gridColumn: "2 / 3", gridRow: "1 / 2" }}>
                <AdHeader />
            </Box>
            <Box sx={{
                gridColumn: "2 / 3",
                gridRow: "2 / 3",
                p: 2,
                overflowY: "auto",
            }}>
                <AdContact />
            </Box>
        </Box>
    );
}

export default AdminContactList;
