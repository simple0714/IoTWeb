import React, { useState } from "react";
import { Box, Drawer, IconButton, useMediaQuery, useTheme, AppBar, Toolbar } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AdHeader from "../components/AdminHeader";
import Dashboard from "../components/AdminDashboard";
import AdNav from "../components/AdminNav";
import AdAbout from "../components/AdminAbout";
import AdminAddAbout from "../components/AdminAddAbout";
import AdUpdateAbout from "../components/AdminUpdateAbout";
import AdContact from "../components/AdminContact";
import ProjectList from "../components/AdminProjectList"; 
import ProjectUpdate from "../components/AdminProjectUpdate";
import AddProject from "../components/AdminAddProject";
import AdPartnerList from "../components/AdminPartnerList";
import AdminAddPartner from "../components/AdminAddPartner";
import AdminUpdatePartner from "../components/AdminUpdatePartner";
import AdminStack from "../components/AdminStack";
import { useRecoilValue } from 'recoil';
import { selectedProjectIdState } from '../atoms';

const drawerWidth = 240;

function Admin() {
    const [selectedNav, setSelectedNav] = useState('dashboard');
    const selectedProjectId = useRecoilValue(selectedProjectIdState);
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    
    const renderContent = () => {
        switch (selectedNav) {
            case 'dashboard':
                return <Dashboard setSelectedNav={setSelectedNav}/>;
            case 'about':
                return <AdAbout setSelectedNav={setSelectedNav} />;
            case 'addabout':
                return <AdminAddAbout setSelectedNav={setSelectedNav} />;
            case 'updateabout':
                return <AdUpdateAbout setSelectedNav={setSelectedNav} />;
            case 'contact':
                return <AdContact setSelectedNav={setSelectedNav} />;
            case 'project':
                return <ProjectList setSelectedNav={setSelectedNav} />;
            case 'addproject':
                return <AddProject setSelectedNav={setSelectedNav} />
            case 'updateproject':
                return <ProjectUpdate setSelectedNav={setSelectedNav} />;
            case 'partner':
                return <AdPartnerList setSelectedNav={setSelectedNav}/>;
            case 'addpartner':
                return <AdminAddPartner setSelectedNav={setSelectedNav} />;
            case 'updatepartner':
                return <AdminUpdatePartner setSelectedNav={setSelectedNav}/>;
            case 'stack':
                return <AdminStack setSelectedNav={setSelectedNav}/>;
            default:
                return <Dashboard />;
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    bgcolor: 'black',
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <AdHeader />
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            >
                <Drawer
                    variant={isMobile ? "temporary" : "permanent"}
                    open={isMobile ? mobileOpen : true}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    <AdNav onSelect={(nav) => { setSelectedNav(nav); if(isMobile) setMobileOpen(false); }} />
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 2,
                    width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
                    mt: '64px',
                }}
            >
                <Box sx={{ maxWidth: '100%' }}>
                    {renderContent()}
                </Box>
            </Box>
        </Box>
    );
}

export default Admin;
