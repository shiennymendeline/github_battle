import React from 'react'
import PropTypes from 'prop-types'
import {fetchPopularRepos} from '../utils/api'
import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle } from 'react-icons/fa'
import Card from './Card'
import Loading from './Loading'
import Tooltip from './Tooltip'

function LanguagesNav({ selected, onUpdateLanguage }){
    const languages = [ 'All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python' ]
        
    //In react:
    //"class" is reserved word in javascript
    //"className" to refer css class
    return (
        <ul className="flex-center">
            {
                languages.map((language) =>(
                    <li key={language}>
                        <button 
                            style={language === selected? { color : 'rgb(187, 6, 31)' } : null}
                            className="btn-clear nav-link"
                            //should be an arrow function, so that the onUpdateLanguage not invoked
                            //immediately after the component is loaded
                            onClick={() => onUpdateLanguage(language)}>
                            {language}
                        </button>
                    </li>
                ))
            }
        </ul>
    )
}

LanguagesNav.propTypes = {
    selected: PropTypes.string.isRequired,
    onUpdateLanguage: PropTypes.func.isRequired
}

function ReposGrid({ repos }){
    return (
        <ul className='grid space-around'>
            {repos.map((repo, index) => {
                const { name, owner, html_url, stargazers_count, forks, open_issues } = repo
                const { login, avatar_url } = owner

                return (
                    <li key={html_url}>
                        <Card
                            header={`#${index + 1}`}
                            avatar={avatar_url}
                            href={html_url}
                            name={login}
                        >
                            <ul className='card-list'>
                                <li>
                                    <Tooltip text='Github username'>
                                        <FaUser color='rgb(255,191,116)' size={22} />
                                        <a href={`https://github.com/${login}`}>
                                            {login}
                                        </a>
                                    </Tooltip>
                                </li>
                                <li>
                                    <FaStar color='rgb(255,215,0)' size={22} />
                                    {stargazers_count.toLocaleString()} stars
                                </li>
                                <li>
                                    <FaCodeBranch color='rgb(129,195,245)' size={22} />
                                    {forks.toLocaleString()} forks
                                </li>
                                <li>
                                    <FaExclamationTriangle color='rgb(241,138,147)' size={22} />
                                    {open_issues.toLocaleString()} open
                                </li>
                            </ul>
                        </Card>
                    </li>
                )
            })}
        </ul>
    )
}

ReposGrid.propTypes = {
    repos: PropTypes.array.isRequired
}

export default class Popular extends React.Component{
    state = {
        selectedLanguage : 'All',
        repos: {},
        error: null
    }

    componentDidMount(){
        this.updateLanguage(this.state.selectedLanguage)
    }

    updateLanguage = (selectedLanguage) => {
        this.setState({
            selectedLanguage : selectedLanguage,
            error: null
        })

        /*
            Spread syntax (...) allows an iterable such as an array expression or string to be expanded in places 
            where zero or more arguments (for function calls) or elements (for array literals) are expected, 
            or an object expression to be expanded in places where zero or more key-value pairs (for object literals) are expected.

            Without spread syntax, to create a new array using an existing array as one part of it, 
            the array literal syntax is no longer sufficient and imperative code must be used instead 
            using a combination of push(), splice(), concat(), etc. With spread syntax this becomes much more succinct:

            const parts = ['shoulders', 'knees']; 
            const lyrics = ['head', ...parts, 'and', 'toes']; 
            //  ["head", "shoulders", "knees", "and", "toes"]
        */

        if (!this.state.repos[selectedLanguage]){
            fetchPopularRepos(selectedLanguage)
            .then((data) =>
            {
                this.setState(({repos}) =>({
                        repos: {
                            ...repos,
                            [selectedLanguage]: data
                        }
                    }
                ))
            })
            .catch(() => { //can be (error) => {
                console.warn('Error fetching repos: ', error)

                this.setState({
                    error: `there was an error fetching the repositories`
                })
            })
        }
    }

    isLoading = () => {
        const {selectedLanguage, repos, error} = this.state
        return !repos[selectedLanguage] && error === null
    }

    render(){
        const {selectedLanguage, repos, error} = this.state

        return(
            <React.Fragment>
                <LanguagesNav 
                    selected = {selectedLanguage}
                    onUpdateLanguage = {this.updateLanguage}
                />

                {this.isLoading() && <Loading text='Fetching repos' />}
                {error && <p className='center-text error'>{error}</p>}
                {repos[selectedLanguage] && <ReposGrid repos={repos[selectedLanguage]} />}
            </React.Fragment>
        )
    }
}