import React from 'react';
import AddFishForm from './AddFishForm';
import Firebase from 'firebase';

const ref = new Firebase('https://wesbosreactlearning.firebaseio.com/');

var Inventory = React.createClass({

    propTypes: {
        fishes: React.PropTypes.object.isRequired,
        addFish: React.PropTypes.func.isRequired,
        removeFish: React.PropTypes.func.isRequired,
        loadSamples: React.PropTypes.func.isRequired,
        linkState: React.PropTypes.func.isRequired,
    },

    getInitialState: function() {
        return {
            'uid': ''
        };
    },

    componentWillMount: function() {
        let token = localStorage.getItem('token');

        if (token) {
            ref.authWithCustomToken(token, this.authHandler);
        }
    },

    logout: function() {
        ref.unauth();
        localStorage.removeItem('token');
        this.setState({
            uid: null
        });
    },

    renderLogin: function() {
        return (
            <nav className="login">
                <h2>Inventory</h2>
                <p>Sign in to manage your store's inventory</p>
                <button className="github" onClick={this.authenticate.bind(this, 'github')}>Log In with Github</button>
                <button className="facebook" onClick={this.authenticate.bind(this, 'facebook')}>Log In with Facebook</button>
                <button className="twitter" onClick={this.authenticate.bind(this, 'twitter')}>Log In with Twitter</button>
            </nav>
        );
    },

    authenticate: function(provider) {
        ref.authWithOAuthPopup(provider, this.authHandler);
    },

    authHandler: function(err, authData) {
        if (err) {
            console.error(err);
            return;
        }

        //Save login token in browser
        localStorage.setItem('token', authData.token);

        const storeRef = ref.child(this.props.params.storeId);
        storeRef.on('value', (snapshot) => {
            var data = snapshot.val() || {};

            if ( ! data.owner) {
                storeRef.set({
                    owner: authData.uid
                });
            }

            this.setState({
                uid: authData.uid,
                owner: data.owner || authData.uid
            });
        });
    },

    renderInventory: function(key) {
        var linkState = this.props.linkState;

        return (
            <div className="fish-edit" key={key}>
                <input type="text" valueLink={linkState('fishes.' + key + '.name')} />
                <input type="text" valueLink={linkState('fishes.' + key + '.price')} />
                <select valueLink={linkState('fishes.' + key + '.status')}>
                    <option value="unavailable">Sold Out!</option>
                    <option value="available">Fresh!</option>
                </select>
                <textarea valueLink={linkState('fishes.' + key + '.desc')}></textarea>
                <input type="text" valueLink={linkState('fishes.' + key + '.image')} />
                <button onClick={this.props.removeFish.bind(null, key)}>Remove Fish</button>
            </div>
        );
    },

    render: function() {

        let logoutBtn = <button onClick={this.logout}>Log Out</button>

        if (!this.state.uid) {
            return (
                <div>
                    {this.renderLogin()}
                </div>
            );
        }

        if (this.state.uid !== this.state.owner) {
            return (
                <div>
                    <p>Sorry, you are not the owner of this store.</p>
                    {logoutBtn}
                </div>
            );
        }

        return (
            <div>
                <h2>Inventory</h2>
                {logoutBtn}
                {Object.keys(this.props.fishes).map(this.renderInventory)}

                <AddFishForm {...this.props} />

                <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
            </div>
        );
    }

});

export default Inventory;