/*===============================================*/
  C O N F I G U R A T I O N S
/*===============================================*/
1. run "npm init -y"
2. run "npm install react react-dom"
3. create new file .gitignore and then add these 3 objects to it:
- node_modules: other developer can get this folder when they run npm install (lighten the repo)
- .DS_Store: for mac
- dist: folder that contains our generated bundle files, we don't need this to be published because these files will automatically build when we run npm start/build
s
4. create folder app, place html, css, and js files in this folder
5. run this:
"npm install --save-dev @babel/core @babel/preset-env @babel/preset-react webpack webpack-cli webpack-dev-server babel-loader css-loader style-loader html-webpack-plugin"
6. create new file webpack.config.js (on the same level as package.json)

/*===============================================*/
Notes:
"ls package.json" to see when lastWriteTime, length, and other info about package.json
/*===============================================*/

/*===============================================*/
  C O D I N G  T I M E
/*===============================================*/

There are 3 different aspects about React Component
1. State: It can have some states that it manages
2. Lifecycle: Example, fetching data from API or doing some event when the component is added to the DOM itself
3. UI

render()
Method to describe what the UI of the component


We can return HTML like this:
render(){
    return <div>Hello World!</div>
}

But this is a violation of the "separation of conserns" principle that says
we should keep our CSS separated from your Javascript

But since the concerns of Components only state, lifecycle and UI, this is not a violation


"return <div>Hello World!</div>", this style of coding called JSX

that's why we need babel to compile and convert it from JSX and react into old javascript syntax
return <div>Hello World!</div>
is equals
return React.createElement("div", null, "Hello World")
So, whenever we use JSX, means we create a react element

==================
ReactDOM
==================
ReactDOM.render() has 2 arguments, such as:
1. React element
2. where to render the element

ReactDOM.render(
    <App />, 
    document.getElementById('app')
)

the element App will be placed inside a html component with id "app"

React DOM is decoupled from react beacause if the app we build is an iOS app or xbox or etc that not use browser, 
we don't need to render objects to DOM environment

=======
Webpack
=======
Bundles all modules and its dependecies into single bundle file. All we need to do is reference that bundle inside our HTML page

=======
 BABEL
=======
"babel": {
    "presets" : [
      "@babel/preset-env", -- To target specific browser, env is default setting
      "@babel/preset-react" -- to convert it to normal javascript
    ]
  },

=====================
 HtmlWebpackPlugin
=====================
generates a index html and then add the bundled script inside the html
  plugins: [
        new HtmlWebpackPlugin({
            template: 'app/index.html'
        })
    ]

==========================================
other commands need to run:
==========================================
npm install babel-plugin-syntax-dynamic-import