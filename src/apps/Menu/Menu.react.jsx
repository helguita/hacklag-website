import React from 'react';
import Radium from 'radium';
import {Grid, Row, Col} from 'react-flexbox-grid';

export default Radium(React.createClass({
  displayName: 'Menu',

  getInitialState() {
    return {
      toogle: false
    };
  },

  getStyles() {
    return {
      menuText: {
        color: '#565A5F',
        whiteSpace: 'nowrap',
        WebkitTransition: '0.2s ease',
        textDecoration: 'none',
        ':hover': {
          color: '#38B7EA',
          textDecoration: 'none'
        }
      },
      menu: {
        '@media (max-width: 48em)': {
          display: 'none'
        }
      },
      menuSlideDown: {
        display: 'block'
      },
      toogle: {
        display: 'none',
        '@media (max-width: 48em)': {
          display: 'block'
        }
      },
      menuItem: {
        textAlign: 'center'
      }
    };
  },

  handleClick(event) {
    this.setState({toggle: !this.state.toggle});
  },

  render() {
    let styles = this.getStyles();

    return (
      <div>
        <div key="menu" style={this.state.toggle ? styles.menuSlideDown : styles.menu}>
          <Grid >
            <Row end={'sm'} start={'xs'}>
              <Col xs={12} sm={2} md={1} style={styles.menuItem}>
                <a href="/#/home" key="home" style={styles.menuText}>Home</a>
              </Col>
              <Col xs={12} sm={2} md={1} style={styles.menuItem}>
                <a href="/#/events" key="events" style={styles.menuText}>Events</a>
              </Col>
              <Col xs={12} sm={2} md={1} style={styles.menuItem}>
                <a href="/#/blog" key="blog" style={styles.menuText}>Blog</a>
              </Col>
              <Col xs={12} sm={2} md={1} style={styles.menuItem}>
                <a href="/#/about" key="about" style={styles.menuText}>About</a>
              </Col>
            </Row>
          </Grid>
        </div>
        <div key="toogle" style={styles.toogle} onClick={this.handleClick}>toggle</div>
      </div>
    );
  }
}));
