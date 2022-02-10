import React, {useEffect,useState,useContext} from 'react';
import image1 from "../../assets/images/Lion.jpg";
import { UserContext } from '../../App';


const Profile = () => {
    const [mypics, setPics] = useState([]);
    const {state,dispatch} = useContext(UserContext);
    const [image,setImage] = useState("");
    useEffect(() => {
       fetch('/myPost', {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("jwt")
        }
       }).then((res)=> res.json())
       .then((result) => {
           setPics(result.mypost);
       })
    }, [])
    useEffect(()=> {
        if(image) {
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "meetup-clone");
            data.append("cloud_name", "hmn");
            fetch("https://api.cloudinary.com/v1_1/hmn/image/upload", {
                method: "post",
                body: data
            })
            .then((res) => res.json())
            .then((data) => {
                // localStorage.setItem("user", JSON.stringify({...state, pic: data.url}))
                // dispatch({type:"UPDATEPIC", payload:data.url})
                fetch('/updatepic', {
                    method: "put",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer "+ localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        pic: data.url
                    })
                }).then(res => res.json())
                .then(result=> {
                    console.log(result)
                    localStorage.setItem("user", JSON.stringify({...state, pic: data.pic}))
                    dispatch({type:"UPDATEPIC", payload:result.pic})
                })
            })
            .catch((err) => {
                console.log(err);
            })
        }
    },[image])
    const updatePhoto = (file) => {
        setImage(file)
 
    }
    return(
      <div className= "main-style">
          <div className="Profile-style">
              <div>
              <div className = "img-style">
                  <img src={state?state.pic:"loading"} />
              </div>
             <div className="file-field input-field">
                <div className="btn3 #4caf50 green">
                    <span>Update Picture</span>
                    <input type="file" onChange = {(e) => updatePhoto(e.target.files[0])} />
                </div>
                </div>
             </div>
              <div className= "name-style">
                  <h5>{state?state.name:"loading"}</h5>
                  <h5>{state?state.email:"loading"}</h5>
                  <div className = "content-style">
                      <h6>{mypics.length} posts</h6>
                      <h6>{state?state.followers.length:"0"} followers</h6>
                      <h6>{state?state.following.length:"0"} following</h6>
                  </div>
              </div>
          </div>
          <div className = "gallery-style">
              {
                  mypics.map((item) => {
                      return(
                        <img key={item._id} className ="item" src ={item.image} alt={item.title}/>
                      )
                  })
              }
          </div>
      </div>
    );
}

export default Profile;