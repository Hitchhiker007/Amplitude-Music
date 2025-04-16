import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";

import './css/App.css';
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import LoggedIn from "./LoggedIn";

import AuthRoute from "./routes/authRoutes";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="header">
          <NavLink exact activeClassName="active" to="/">Home</NavLink>
          <NavLink activeClassName="active" to="/register">Register</NavLink>
          <NavLink activeClassName="active" to="/login">Login</NavLink>
          <NavLink activeClassName="active" to="/loggedin">User Content</NavLink>
        </div>
        <div className="main-header">Welcome</div>
        <div className="content">
          {/* create private and public routes so user content is unavaliable to users who are not logged in */}
          {/* when logged in login and register are then subsequently unavaliable */}
          <Routes>
            <Route exact path="/" element={<Home />}/>
            <Route element={<AuthRoute type="public" redirectTo="/loggedin" />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route element={<AuthRoute type="private" />}>
              <Route path="/loggedin" element={<LoggedIn />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
