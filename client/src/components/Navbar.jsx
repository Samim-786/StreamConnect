import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{}}>

    <nav style={{ padding: '1rem', borderBottom: '1px solid gray',display:"flex",justifyContent:"space-around" }}>
      <Link to='/' style={{ marginRight: '1rem',fontSize:"20px",backgroundColor:"orange" ,width:"80px",borderRadius:"10px"}}>Home</Link>
      {!token ? (
        <>
          <Link to='/login' style={{ marginRight: '1rem',fontSize:"20px",backgroundColor:"orange" ,width:"80px",borderRadius:"10px" }}>Login</Link>
          <Link to='/signup' style={{ marginRight: '1rem',fontSize:"20px" ,backgroundColor:"orange" ,width:"80px",borderRadius:"10px"}}>Signup</Link>
        </>
      ) : (
        <button style={{backgroundColor:"orange" ,width:"80px",borderRadius:"10px",textAlign:"center"}} onClick={handleLogout}>Logout</button>
      )}
    </nav>
    </div>
  );
}

export default Navbar;
