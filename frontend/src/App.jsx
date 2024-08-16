import {BrowserRouter , Routes, Route} from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { UserData } from './context/UserContext.jsx';
import { Loading } from './components/Loading.jsx';
import Navbar from './components/Navbar.jsx';
import Pinpage from './pages/PinPage.jsx';
import Create from './pages/Create.jsx';
import Account from './pages/Account.jsx';
import UserProfile from './pages/UserProfile.jsx';

const App = () => {
  const {loading,isAuth,user} = UserData();
  return (
    <>
    {
      loading ? <Loading/> : 
      <BrowserRouter>
      {isAuth && <Navbar user={user}/>}
      <Routes>
        <Route path='/' element={isAuth ?<Home/> : <Login/>}/>
        <Route path='/account' element={isAuth ?<Account user={user}/> : <Login/>}/>
        <Route path='/user/:id' element={isAuth ?<UserProfile user={user}/> : <Login/>}/>
        <Route path='/create' element={isAuth ?<Create/> : <Login/>}/>
        <Route path='/pin/:id' element={isAuth ?<Pinpage user={user}/> : <Login/>}/>
        <Route path='/login' element={isAuth ?<Home/> : <Login/>}/>
        <Route path='/register' element={isAuth ?<Home/> : <Register/>}/>
      </Routes>    
      </BrowserRouter>
    }
    
    
    </>
  )
}

export default App;