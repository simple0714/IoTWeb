// 관리자 네비게이션 컴포넌트
// 대시보드, 소개글, 프로젝트, 프로젝트 요청, 협력사 배너 관리 기능 추가 완료
// 수정 기능은 각각의 조회 페이지에서 추가

import React from "react";
import { List, ListItem, ListItemText, ListItemButton, Collapse } from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

function AdNav({ onSelect }) {
    const [openAbout, setOpenAbout] = React.useState(false);
    const [openProject, setOpenProject] = React.useState(false);
    const [openPartner, setOpenPartner] = React.useState(false);

    const handleClick = (section) => {
        switch(section) {
            case 'about':
                setOpenAbout(!openAbout);
                break;
            case 'project':
                setOpenProject(!openProject);
                break;
            case 'partner':
                setOpenPartner(!openPartner);
                break;
            default:
                break;
        }
    };

    return (
        <List component="nav" sx={{ width: "100%" }}>
            <ListItemButton onClick={() => onSelect("dashboard")}>
                <ListItemText primary="대시보드" primaryTypographyProps={{ variant: "h6" }} />
            </ListItemButton>

            <ListItemButton onClick={() => handleClick('about')}>
                <ListItemText primary="소개글 관리" primaryTypographyProps={{ variant: "h6" }} />
                {openAbout ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openAbout} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }} onClick={() => onSelect("about")}>
                        <ListItemText primary="소개글 조회" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }} onClick={() => onSelect("addabout")}>
                        <ListItemText primary="소개글 추가" />
                    </ListItemButton>
                </List>
            </Collapse>

            <ListItemButton onClick={() => handleClick('project')}>
                <ListItemText primary="프로젝트 관리" primaryTypographyProps={{ variant: "h6" }} />
                {openProject ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openProject} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }} onClick={() => onSelect("project")}>
                        <ListItemText primary="프로젝트 조회" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }} onClick={() => onSelect("addproject")}>
                        <ListItemText primary="프로젝트 추가" />
                    </ListItemButton>
                </List>
            </Collapse>

            <ListItemButton onClick={() => handleClick('partner')}>
                <ListItemText primary="협력사 배너관리" primaryTypographyProps={{ variant: "h6" }} />
                {openPartner ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openPartner} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }} onClick={() => onSelect("partner")}>
                        <ListItemText primary="협력사 조회" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }} onClick={() => onSelect("addpartner")}>
                        <ListItemText primary="협력사 추가" />
                    </ListItemButton>
                </List>
            </Collapse>

            <ListItemButton onClick={() => onSelect("contact")}>
                <ListItemText primary="프로젝트 요청 조회" primaryTypographyProps={{ variant: "h6" }} />
            </ListItemButton>
        </List>
    );
}

export default AdNav;
