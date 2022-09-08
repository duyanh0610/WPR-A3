import { Route, Switch } from "react-router-dom";

import Menu from "./components/menu/Menu";
import HomePage from "./pages/homepage/HomePage.jsx";
import AddPage from "./pages/addpage/AddPage.jsx";
import UpdatePage from "./pages/updatepage/UpdatePage.jsx";



export default function App() { 
    return <>
       <Menu /> 

       <Switch>
           <Route exact path="/" component = {HomePage}/> 
           <Route  path="/add" component = {AddPage}/> 
           <Route   path ="/:id/edit" component={UpdatePage} />
       </Switch>

    </> 
}