import React from 'react';
import helpers from '../helpers';

var Fish = React.createClass({

    propTypes: {
        details: React.PropTypes.object.isRequired
    },

    render: function() {
        var details = this.props.details;
        var isAvailable = (details.status === 'available' ? true : false);
        var buttonText = (isAvailable ? 'Add To Order' : 'Sold Out!');

        return (
            <li className="menu-fish">
                <img src={details.image} alt={details.name}/>
                <h3 classNmae="fish-name">
                    {details.name}
                    <span className="price">{helpers.formatPrice(details.price)}</span>
                </h3>
                <p>{details.desc}</p>
                <button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
            </li>
        );
    },

    onButtonClick: function() {
        this.props.addToOrder(this.props.index);
    }
});

export default Fish;
