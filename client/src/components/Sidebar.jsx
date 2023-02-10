import React, {useState} from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import { faUser, faArrowLeft, faChevronLeft ,faChevronRight, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SidebarMenu from 'react-bootstrap-sidebar-menu';
import { Button, ButtonToolbar, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter} from 'react-bootstrap';
import '../css/theme1.css';
import '../css/sidebar.css'
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaRegChartBar,
    FaCommentAlt,
    FaShoppingBag,
    FaThList,
    FaKey
}from "react-icons/fa";
import {
    CgPassword
}from "react-icons/cg"; 
import { NavLink } from 'react-router-dom';
// import { faGear } from 'react-bootstrap-icons';


const Sidebar = ({children}) => {
    const[isOpen ,setIsOpen] = useState(true);
    const toggle = () => setIsOpen (!isOpen);
    const menuItem=[
        {
            path:"/",
            name:"Gallery",
            icon:<FaTh/>
        },
        {
            path:"/analytics",
            name:"Generator",
            icon:<CgPassword/>
        },
        {
            path:"/comment",
            name:"Comment",
            icon:<FaCommentAlt/>
        },
        {
            path:"/product",
            name:"Product",
            icon:<FaShoppingBag/>
        },
        {
            path:"/productList",
            name:"List",
            icon:<FaThList/>
        },
        {
            path:"/about",
            name:"About",
            icon:<FaUserAlt/>
        },
    ]
    return (
        <div className="sidebar-container">
            {/* <div className={isOpen ? "sidebar wrapper--wgYc0yYGn1" : "sidebar wrapper--wgYc0yYGn1 collapsed--BrviRkpKCo" }> */}
            <div style={{width: isOpen ? "270px" : "60px"}} className="sidebar">
                <div className="top_section">
                    <h1 style={{display: isOpen ? "block" : "none"}} className="logo">Manager</h1>
                    <div style={{marginLeft: isOpen ? "50px" : "0px"}} className="bars">
                        <FaBars className="logo-icon" onClick={toggle}/>
                    </div>
                </div>
                {
                    menuItem.map((item, index)=>(
                        <NavLink to={item.path} key={index} className="link" activeclassName="active">
                            <div className="icon">{item.icon}</div>
                            <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                        </NavLink>
                    ))
                }
            </div>
            {/* <main>{children}</main> */}
            {/* Modal */}
            <Modal
                    onHide={toggle}
                    show={modal}
                >
                    
                    <Modal.Dialog>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Header closeButton>
                        <Modal.Title id="modalName">{data.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Form.Group className="form-group">
                            <Form.Label className="label" >Email</Form.Label>
                            <Form.Control id="modalEmail" name="email" type="email" value={data.email} onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group className="form-group">
                            <Form.Label className="label">Username</Form.Label>
                            <Form.Control id="modalUsername" name="username" type="text" value={data.username} onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group className="form-group">
                            <Form.Label className="label">Password</Form.Label>
                            <Form.Control id="modalPassword" name="password" type="password" value={data.password} onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group className="form-group">
                            <Form.Label className="label">Website</Form.Label>
                            <Form.Control id="modalUrl" name="url" type="url" value={data.url} onChange={handleChange}/>
                        </Form.Group>
                        </Modal.Body>
                    </Form>
                    
                    <Modal.Footer>
                    <Button variant="secondary" onClick={toggle}>
                        Close
                    </Button>
                    <Button variant="primary">Understood</Button>
                    </Modal.Footer>
                    </Modal.Dialog>
                </Modal>
        </div>
    );
};

export default Sidebar