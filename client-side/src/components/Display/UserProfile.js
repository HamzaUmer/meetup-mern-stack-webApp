import React, {useEffect,useState,useContext} from 'react';
import image1 from "../../assets/images/Lion.jpg";
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';

const Profile = () => {
    const [userProfile, setProfile] = useState(null);
    const {state,dispatch} = useContext(UserContext);
    const {userid} = useParams();
    const [showFollow, setShowFollow] = useState(state?!state.following.includes(userid):true);
    console.log(userid)
    useEffect(() => {
       fetch(`/user/${userid}`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("jwt")
        }
       }).then((res)=> res.json())
       .then((result) => {
           setProfile(result);
       })
    }, [])

    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+ localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
        .then((data) => {
            dispatch({type:"UPDATE", payload:{following: data.following, followers: data.followers}})
            localStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState) => {
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers:[...prevState.user.followers, data._id]
                    }
                }
            })
            setShowFollow(false);
        })
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+ localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
        .then((data) => {
            dispatch({type:"UPDATE", payload:{following: data.following, followers: data.followers}})
            localStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState) => {
                const newFollower = prevState.user.followers.filter(item => item != data._id)
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
            setShowFollow(true);
        })
    }
    return(
        <>
        {userProfile ? 
              <div className= "main-style">
              <div className="Profile-style">
                  <div className = "img-style">
                      <img src={userProfile.user.pic} />
                  </div>
                  <div className= "name-style">
                      <h4>{userProfile.user.name}</h4>
                      <h5>{userProfile.user.email}</h5>
                      <div className = "content-style">
                          <h6>{userProfile.posts.length} posts</h6>
                          <h6>{userProfile.user.followers.length} followers</h6>
                          <h6>{userProfile.user.following.length} following</h6>
                      </div>
                      {
                        showFollow?
                        <button className = "btn2  #4caf50 green darken-2"
                        onClick= {() => followUser()}>
                            Follow
                        </button>
                        :
                        <button className = "btn2  #4caf50 green darken-2"
                        onClick= {() => unfollowUser()}>
                            Unfollow
                        </button>
                      }

                  </div>
              </div>
              <div className = "gallery-style">
                  {
                      userProfile.posts.map((item) => {
                          return(
                            <img key={item._id} className ="item" src ={item.image} alt={item.title}/>
                          )
                      })
                  }
              </div>
          </div>
        
        
        : <h2>Loading...</h2>}

      </>
    );
}

export default Profile;