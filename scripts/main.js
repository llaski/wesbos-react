var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History;

var createBrowserHistory = require('history/lib/createBrowserHistory');

var helpers = require('./helpers');

//App
var App = React.createClass({

	render: function() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market" />
				</div>
				<Order />
				<Inventory />
			</div>
		);
	}
});

//Header
var Header = React.createClass({

	render: function() {
		return (
			<header className="top">
				<h1>Catch
					<span className="ofThe">
						<span className="of">of</span>
						<span className="the">the</span>
					</span>
					Day</h1>
				<h3 className="tagline"><span>{this.props.tagline}</span></h3>
			</header>
		);
	}

});

var Order = React.createClass({

	render: function() {
		return (
			<p>Order</p>
		);
	}

});

var Inventory = React.createClass({

	render: function() {
		return (
			<p>Inventory</p>
		);
	}

});

//Store Picker Componenet
var StorePicker = React.createClass({

    mixins: [History],

    goToStore: function(evt) {
        evt.preventDefault();

        let storeId = this.refs.storeId.value;
        this.history.pushState(null, '/store/' + storeId);
    },

	render: function() {
		return (
			<form className="store-selector" onSubmit={this.goToStore}>
				<h2>Please Enter a Store</h2>
				<input type="text" ref="storeId" required defaultValue={helpers.getFunName()} />
				<input type="Submit" />
			</form>
		);
	}

});

//Not found
var NotFound = React.createClass({

    render: function() {
        return (
            <h1>Where do you think your going?</h1>
        );
    }

});

//Routes
var routes = (
    <Router history={createBrowserHistory()}>
        <Route path="/" component={StorePicker} />
        <Route path="/store/:storeId" component={App} />
        <Route path="*" component={NotFound} />
    </Router>
);

ReactDOM.render(routes, document.querySelector('#main'));