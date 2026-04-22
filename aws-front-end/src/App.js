import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";

import './css/App.css';
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import LoggedIn from "./LoggedIn";
import LastFmDashboard from "./LastFmDashboard";
import AuthRoute from "./routes/authRoutes";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav className="amp-nav">
          <div className="amp-nav-brand">
            AMPLITUDE
          </div>
          <div className="amp-nav-links">
            <NavLink to="/" className={({ isActive }) => isActive ? 'amp-nav-link active' : 'amp-nav-link'}>
              // HOME
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => isActive ? 'amp-nav-link active' : 'amp-nav-link'}>
              // REGISTER
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => isActive ? 'amp-nav-link active' : 'amp-nav-link'}>
              // LOGIN
            </NavLink>
            <NavLink to="/loggedin" className={({ isActive }) => isActive ? 'amp-nav-link active' : 'amp-nav-link'}>
              // ACCOUNT
            </NavLink>
            <NavLink to="/lastFmDashboard" className={({ isActive }) => isActive ? 'amp-nav-link amp-nav-link-dashboard active' : 'amp-nav-link amp-nav-link-dashboard'}>
              ▶ DASHBOARD
            </NavLink>
          </div>
        </nav>
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
            <Route element={<AuthRoute type="private" />}>
              <Route path="/lastFmDashboard" element={<LastFmDashboard />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;         
