import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserContext } from "../App"; 
import { useState, useEffect, useContext } from "react";
import axios from 'axios';
import Profile from './Profile';

function User() {
    const { userId } = useParams();
    const {profile, setProfile} = useContext(UserContext);
    const [repos, setRepos] = useState([]);

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
            <div key={repo.id}>
                <a href={repo.html_url}>{repo.name}</a>
                <p>{repo.description}</p>
                <p>Updated at {getFormattedDate(repo.updated_at)}</p>
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
    initial={{ opacity: 0, backgroundColor: '#ffffff' }} // Initial background color
    animate={{ opacity: 1, backgroundColor: '#ff0000' }} // Final background color
    exit={{ opacity: 0, backgroundColor: '#ffffff' }} // Exit background color
    transition={{ duration: 1 }}
        >
    {
        profile && profile.avatar_url && <img src={profile.avatar_url} alt="Avatar" />
    }
    {
       profile && profile.name && <div>{profile.name}</div>
    }
    {
       profile && profile.html_url && <a href={profile.html_url}>Go to Github</a>
    }
    {
    profile && profile.repos_url && <div>{profile.repos_url}</div>
    }
    {
    profile && profile.followers && <div>{profile.followers}</div>
    }
    {
    profile && profile.following && <div>{profile.following}</div>
    }
    {
    profile && profile.public_repos && <div>{profile.public_repos}</div>
    }
   <div>
                {repos.length > 0 ? showRepos() : <div>No repositories found</div>}
    </div>
    </motion.div>
  )
}

export default User;