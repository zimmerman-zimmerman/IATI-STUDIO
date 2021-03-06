"use strict"

import React, { PropTypes }   from 'react'
import { connect }            from 'react-redux'
import _                      from 'lodash'
import classNames             from 'classnames'
import { browserHistory }     from 'react-router'
import { toggleMainMenu }     from '../../actions/sync'

class OrgSettings extends React.Component {
  componentDidMount() {
    this.props.toggleMainMenu(true)
  }

  render() {
    let wrapClass = classNames('pusher',{
      'pushed' : this.props.navState.menuState
    })

    return (
      <div className={wrapClass}>
      	<div className="row controls">
	      <div className="columns small-12">
	        <h2 className="page-title">Your organisation settings</h2>
	        <hr />
	      </div>
	    </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) { 
	return {
		navState: state.navState,
	} 
}

export default connect(mapStateToProps, {toggleMainMenu,})(OrgSettings)