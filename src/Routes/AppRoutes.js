import {Routes, Route, Navigate, useNavigate} from "react-router-dom";
import { useEffect } from "react";
import Gacha from "../Pages/Gacha";
import Home from "../Pages/Home";
import Cards from "../Pages/Cards";

const AppRoute = () => {

    const navigate = useNavigate();

    return (
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/stark_banner" element={<Gacha />}/>
            <Route path="/cards" element={<Cards />} />

            <Route path="*" element={<Navigate to='/'/>}/>
        </Routes>
    )
}

export default AppRoute;