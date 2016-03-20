import React from 'react';

import './Logo.sass';


export default React.createClass({
  displayName: 'Logo',

  getStyles() {
    return {
      text: {
        color: '#2C93D1',
        fontSize: '1.3em'
      }
    };
  },

  render() {
    const styles = this.getStyles();

    return (
      <div style={styles.text}>HACKLAG</div>
    );
  }
});
