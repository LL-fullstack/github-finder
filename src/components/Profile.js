export default class Profile {
    avatar_url;
    html_url;
    login;
    repos_url;
    followers;
    following;
    public_repos;
    name;

    constructor(data) {
        this.avatar_url = data.avatar_url || ''; 
        this.html_url = data.html_url || ''; 
        this.login = data.login || ''; 
        this.repos_url = data.repos_url || ''; 
        this.followers = data.followers || 0;
        this.following = data.following || 0;
        this.public_repos = data.public_repos || 0;
        this.name = data.name || '';
    }
} 