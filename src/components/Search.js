import { useState, useEffect, useContext } from "react";
import { useSearchParams, Link, useNavigate  } from "react-router-dom";
import axios from 'axios';
import { motion } from 'framer-motion';
import Profile from "./Profile";
import { UserContext } from "../App"; 


function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('query') || '';
    const [query, setQuery] = useState(initialQuery);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const {profile, setProfile} = useContext(UserContext);

    const updateInputText = (text) => {
        setQuery(text);
        setError('');
    }

    const fetchGitHubUsers = async () => {
        try {
            const response = await axios.get(`https://api.github.com/users/${query}`);
            console.log(response.data);
            const profile = new Profile(response.data);
            setProfile(profile);
            navigate(`/user/${response.data.login}`);
        } catch (error) {
            console.error(error);
            setError('User Not Found');
            setQuery('');
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        fetchGitHubUsers(); 
    };

    useEffect(() => {
        
        if (query !== initialQuery) {
            setSearchParams({ query: query || ''}, { replace: true });
        }     
    }, [initialQuery, query]);



    return (
        <motion.div
        initial={{ opacity: 0, backgroundColor: '#ffffff' }} // Initial background color
        animate={{ opacity: 1, backgroundColor: '#ff0000' }} // Final background color
        exit={{ opacity: 0, backgroundColor: '#ffffff' }} // Exit background color
        transition={{ duration: 1 }}
        >
        <div className="search-container">
            <form onSubmit={handleFormSubmit}>
                <input 
                    type='text' 
                    value={query}
                    onChange={event => updateInputText(event.target.value)}
                    placeholder="Username" />
            </form>
            <h1>Welcome to Github Finder</h1>
            <p>{error}</p>
        </div>
        </motion.div>
    )
}

export default Search;