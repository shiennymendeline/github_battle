import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
// import Popular from './components/Popular'
// import Battle from './components/Battle'
// import Results from './components/Results'
import { ThemeProvider } from './contexts/theme'
import Nav from './components/Nav'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Loading from './components/Loading'
/*
we pass a function and the function needs to return a promise that resolves with
a particular module / particular component

.lazy => react will make sure that we don't import the component until it's needed
*/
const Popular = React.lazy(() => import('./components/Popular'))
const Battle = React.lazy(() => import('./components/Battle'))
const Results = React.lazy(() => import('./components/Results'))

class App extends React.Component {
    state = {
        theme: 'light',
        toggleTheme: () => {
            this.setState(({theme}) => ({
                theme: theme === 'light' ? 'dark' : 'light'
            }))
        }
    }

    render() {
        return (
            <Router>
                <ThemeProvider value={this.state}>
                    <div className={this.state.theme}>
                        <div className="container">
                            <Nav />
                            {/*
                                Adding exact keyword, means :
                                please render only if the path match exact the defined path

                                Switch:
                                only renders the first match route

                                <React.Suspense>
                                is needed when we use React.Lazy import.
                                the fallback component will be display if these 
                                particular modules take too long to import

                                Conclusion:
                                1. Dynamic import syntax allows us to import modules dynamically
                                2. React.Lazy allows us to render a dynamic import just as a regular component
                                In the end, Popular won't be loaded until it matches the route path
                                <Route exact path='/' component={Popular} />
                            */}
                            <React.Suspense fallback={<Loading />}>
                                <Switch>
                                    <Route exact path='/' component={Popular} />
                                    <Route exact path='/battle' component={Battle} />
                                    <Route path='/battle/results' component={Results} />
                                    <Route render={() => <h1>404</h1>} />
                                </Switch>
                            </React.Suspense>
                            {
                                /*
                                In local, webpack dev server will throw error:
                                Cannot GET /battle

                                This isn't a React router issue. It has to do with the server that's
                                serving our application which in this case is web pack div server.

                                So, without going too far into this, basically what's happening is when we hit
                                Enter here we are making a get request to the /battle route inside of our application.

                                At that moment, React hasn't been loaded, React router hasn't been loaded.
                                All we have is a get request going to battle.

                                And so, the browser is going to say, "Hey, I don't have any instructions for how
                                to serve or how to handle the get request that comes to battle."

                                So, what we want to do instead, and again, this is just a server thing.
                                Is want to tell web pack, whenever you get any requests, instead of trying to handle like your
                                normally would, like a server, just redirect all requests to our index page.

                                And then from there, our index page is going to load React, it's going to load React router.

                                And then the React router is going to say, "Oh, it's looks like we have a request
                                to battle, so, let's go ahead and handle that."

                                So, basically what we're doing is we're telling the server, don't behave like you
                                usually behave, don't try to go ahead and handle any get request that we have.

                                Instead, just redirect everything to the index page and then React router will actually
                                handle all the routing.

                                So, the way we can do that with web pack DEV server is inside of your web pack
                                config file, come down here and add a new property called DevServer.

                                devServer: {
                                    historyApiFallback: true
                                }

                                In output, add publicPath
                                output: {
                                    publicPath: '/'
                                },

                                So again, this tells web pack dev server, "Hey, don't try to handle any request that
                                come in to the server, instead, just fall back to whatever the public path
                                is which is just our main index page."

                                if you restart the webpack, you'll notice that there is an output:
                                i ｢wds｣: 404s will fallback to /index.html
                                */
                            }
                        </div>
                    </div>
                </ThemeProvider>
            </Router>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
)