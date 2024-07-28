import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { logout } from "../../context/AuthActions";

export default function Topbar() {
  const { user,dispatch } = useContext(AuthContext);
  const navigate = useNavigate()
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [username, setUsername] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [error, setError] = useState(false);
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchData(null);
    setError(false)
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}users?username=` + username
      );
      setSearchData(res.data);
    } catch (err) {
      setError(true);
      console.log(err);
    }
  };
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="topbarLogo">MySocialApp</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <div onClick={handleSearch} style={{ cursor: "pointer" }}>
            <Search className="searchIcon" />
          </div>
          <input
            placeholder="Search for friends, posts or videos"
            className="searchInput"
            onChange={(e) => {
              if (!username) {
                setSearchData(null);
                setError(false);
              }
              setUsername(e.target.value);
            }}
          />
        </div>
        {username && (
          <div className="person">
            {searchData && (
              <Link style={{color: 'inherit', textDecoration: 'none'}} to={`/profile/${searchData.username}`}>
                <div className="userInfo">
                  <div className="imageInfo">
                    <img
                      src={
                        searchData.profilePicture
                          ? searchData.profilePicture
                          : PF + "person/noAvatar.png"
                      }
                      alt=""
                    />
                  </div>
                  <h3>{searchData.username}</h3>
                </div>
              </Link>
            )}
            {!error && !searchData && <span>Click search icon to search.</span>}
            {error && "No user found"}
          </div>
        )}
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <div className="topbarLink">HomePage</div>
          <div className="topbarLink">Timeline</div>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="logout" onClick={() => {dispatch(logout());navigate('/login')}} >
            logout
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
