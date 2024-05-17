import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserContext } from "../App"; 
import { useState, useEffect, useContext } from "react";
import axios from 'axios';
import Profile from './Profile';

function User() {
    const { userId } = useParams();
    const { profile, setProfile } = useContext(UserContext);
    const [ repos, setRepos ] = useState([]);

    useEffect(() => {
        if(profile === undefined) {
            fetchGitHubUser();
        } else {
            fetchRepositories();
        }
        
    }, [profile, userId]); 

    const fetchRepositories = async () => {
        try {
            const response = await axios.get(profile.repos_url);
            console.log(response.data);
            setRepos(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getFormattedDate = (timestamp) => {
        const date = new Date(timestamp)
        const options = { month: 'short', day: '2-digit', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        console.log(formattedDate);
        return formattedDate;
    }

    const showRepos = () => {
        return repos.sort((a, b) => {
            const dateA = new Date(a.updated_at);
            const dateB = new Date(b.updated_at);

            return dateB - dateA;
        }).map( repo =>
            <div key={repo.id} className='repo-detail'>
                <div className='repo-name-time'>
                    <a href={repo.html_url}>{repo.name}</a>
                    <p>Updated at {getFormattedDate(repo.updated_at)}</p>
                </div>     
                <p>{repo.description}</p>     
            </div>
        )
    }

    const fetchGitHubUser = async () => {
        try {
            const response = await axios.get(`https://api.github.com/users/${userId}`);
            console.log(response.data);
            const profile = new Profile(response.data);
            setProfile(profile);
        } catch (error) {
            console.error(error);
        }
    };

    const noRepos = <div></div>


  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1 }}
>
    <div className="user-profile-container">
        <section className='user-profile-section'>
            {profile && profile.avatar_url && <img src={profile.avatar_url} alt="Avatar" />}
            {profile && profile.name && <div className='user-name'>{profile.name}</div>}
            <div className='repo-follower-following'>
                {profile && <div className='repos-num'><span>{profile.public_repos}</span>repositories</div>}
                {profile && <div className='followers-num'><span>{profile.followers}</span>followers</div>}
                {profile && <div className='following-num'><span>{profile.following}</span>following</div>}
            </div>
            {profile && profile.html_url && <button className='btn-github'><a href={profile.html_url}>Go to Github</a></button>}
        </section>
    </div>
    <section className='repos-detail-section'>
        <h2>My repositories</h2>
        <div className='show-repos'>
            {repos.length > 0 ? <div className='repo-details'>{showRepos()}</div> : <div className='repo-not-found'>No repositories found</div>}
        </div>
    </section>
    
</motion.div> 
  )
}

export default User;