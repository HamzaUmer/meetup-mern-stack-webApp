import React,{useState, useEffect, useContext} from 'react';
import {UserContext} from '../../App';
import { Link } from 'react-router-dom';

const Home = () => {
    const [data,setData] = useState([]);
    const {state,dispatch} = useContext(UserContext);
    useEffect(() => {
       fetch('/allpost', {
           headers: {
               "Authorization": "Bearer " + localStorage.getItem("jwt")
           }
       }).then((res)=> res.json())
       .then((result) => {
           console.log(result)
           setData(result.post)
       })
    }, [])

    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId : id
            })
            }).then((res) => res.json())
            .then((result) => {
               // console.log(result)
               const newData = data.map(item => {
                   if(item._id == result._id) {
                       return result
                   }
                   else {
                       return item
                   }
               })
               setData(newData)
        }).catch((err) => {
            console.log(err)
        })
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId : id
            })
            }).then((res) => res.json())
            .then((result) => {
                // console.log(result)
               const newData = data.map(item => {
                if(item._id == result._id) {
                    return result
                }
                else {
                    return item
                }
               })
                setData(newData)
            }).catch((err) => {
                console.log(err)
        })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then((res)=> res.json())
        .then((result)=> {
            console.log(result)
            const newData = data.map(item => {
                if(item._id == result._id) {
                    return result
                }
                else {
                    return item
                }
               })
                setData(newData)
            }).catch((err) => {
                console.log(err)
        })
    }
    
    const deletepost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then((res) => res.json())
        .then((result) => {
            console.log(result)
            const newData = data.filter(item => {
                return item._id !== result._id
            })
            setData(newData)
        })
    }

    const deletecomment = (postId,commentId) => {
        fetch(`/deletecomment/${postId}/${commentId}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then((res) => res.json())
        .then((result) => {
            console.log(result)
            const newData = data.map(item => {
                if(item._id == result._id) {
                    return result
                }
                else {
                    return item
                }
            })
            setData(newData)
        })
    }

    return(
      <div className = "home-style">
                  {
            data.map((item) => {
                return(
                <div className = "card home-card" key={item._id}>
                    <h5 style={{padding:"5px"}}><Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"  }><img className="img-style1" src={item.postedBy.pic}/>{item.postedBy.name}</Link> {item.postedBy._id == state._id 
                    && <i className="material-icons" style={{
                        float:"right"
                    }} 
                    onClick={()=>deletepost(item._id)}
                    >delete</i>

                    }</h5>
                <div className = "card-image">
                    <img src = {item.image} />
                </div>
                <div className = "card-content">
                {item.likes.includes(state._id)
                ?
                <i className="material-icons unlike"
                onClick = {() => {unlikePost(item._id)}}
                >thumb_down</i>
                :
                <i className="material-icons like"
                onClick = {() => {likePost(item._id)}}
                >thumb_up</i>
               }
                    <h6>{item.likes.length} Likes</h6>
                    <h6 className="title-edit">{item.title}</h6>
                    <p>{item.body}</p>
                    {
                        item.comments.map((record)=> {
                            return(
                                <h6 key={record._id}><span style={{fontWeight:"600"}}><img className="img-style2" src={record.postedBy.pic}/>{record.postedBy.name} </span>{""} {record.text} 
                                {(item.postedBy._id || record.postedBy._id) == state._id && (<i className="material-icons unlike" 
                                style={{float: 'right'}}
                                onClick = {() => deletecomment(item._id, record._id)}
                                >delete</i>)}
                            </h6>
                            )
                        })
                    }
                    <form onSubmit = {(e) => {
                        e.preventDefault()
                        makeComment(e.target[0].value,item._id)
                    }}>
                        <input className="input-field" type="text" placeholder = "Add a comment" />
                    </form>
                </div>
            </div>
                )
            })
        }
      </div>
    );
}

export default Home;