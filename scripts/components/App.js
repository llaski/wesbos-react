import React from 'react';
import Catalyst from 'react-catalyst';

import Rebase from 're-base';
var base = Rebase.createClass('https://wesbosreactlearning.firebaseio.com/');

import Header from './Header';
import Fish from './Fish';
import Order from './Order';
import Inventory from './Inventory';

var App = React.createClass({

    mixins: [Catalyst.LinkedStateMixin],

    getInitialState: function () {
        var localStorageRef = localStorage.getItem('order-' + this.props.params.storeId);

        return {
            fishes: {},
            order: localStorageRef ? JSON.parse(localStorageRef) : {}
        };
    },

    componentDidMount: function() {
        base.syncState(this.props.params.storeId + '/fishes', {
            context: this,
            state: 'fishes'
        });
    },

    componentWillUpdate: function(nextProps, nextState) {
        localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
    },

    addToOrder: function(key) {
        this.state.order[key] = this.state.order[key] + 1 || 1;

        this.setState({
            order: this.state.order
        });
    },

    removeFromOrder: function(key) {
        delete this.state.order[key];

        this.setState({
            order: this.state.order
        });
    },

    addFish: function(fish) {
        var timestamp = (new Date()).getTime();

        this.state.fishes['fish-' + timestamp] = fish;
        this.setState({
            fishes: this.state.fishes
        });
    },

    removeFish: function(key) {
        if (! confirm('Are you sure?')) {
            return;
        }

        this.state.fishes[key] = null;
        this.setState({
            fishes: this.state.fishes
        });
    },

    loadSamples: function() {
        this.setState({
            fishes: require('../sample-fishes')
        });
    },

    render: function() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market" />

                    <ul className="list-of-fishes">
                        {Object.keys(this.state.fishes).map(this.renderFish)}
                    </ul>
                </div>
                <Order
                    fishes={this.state.fishes}
                    order={this.state.order}
                    removeFromOrder={this.removeFromOrder}
                    />
                <Inventory
                    fishes={this.state.fishes}
                    addFish={this.addFish}
                    removeFish={this.removeFish}
                    loadSamples={this.loadSamples}
                    linkState={this.linkState}
                    {...this.props} />
            </div>
        );
    },

    renderFish: function(key) {
        return (
            <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>
        );
    }
});

export default App;