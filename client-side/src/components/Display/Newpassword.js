import React , {useState, useContext} from 'react';
import { Link, useHistory,useParams} from 'react-router-dom';
import M from 'materialize-css';

const Login = () => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const {token} = useParams();
  console.log(token);
  const PostData = () => {
    fetch("/new-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password,
        token
      })
      }).then(res=>res.json())
      .then((data) => {
        if (data.error) {
          M.toast({html: data.error, classes:"#c62828 red darken-3"})
        }
        else{
          M.toast({html: data.message, classes:"#2e7d32 green darken-3"})
          history.push('/login')
        }
    })
    .catch((err)=> {
      console.log(err);
    })
  }
    return(
      <div className= "mycard">
          <div className= "card auth-card input-field ">
             <h2>MeetUp</h2>
              <input
              type="password"
              placeholder= "Enter a New Password"
              value = {password}
              onChange ={(e) => setPassword(e.target.value)}
              />
             <button className = "btn waves-effect waves-light #4caf50 green darken-2"
             onClick= {() => PostData()}>
                 Update Password
             </button>
          </div>
      </div>
    );
}

export default Login;