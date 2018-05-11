import Observable from 'o_0';
import {debounce} from 'lodash';

import Reactlet from '../reactlet';
import Loader from '../includes/loader.jsx';
import UserResultItem from '../includes/user-result-item.jsx';

import React from 'react';
//import PropTypes from 'prop-types';

/*
function Old(application) {

  var self = {
  
    application,
  
    query: Observable(""),

    hiddenUnlessAddTeamUserPopVisible() {
      if (!application.addTeamUserPopVisible()) { return 'hidden'; }
    },

    stopPropagation(event) {
      return event.stopPropagation();
    },
    
    hiddenUnlessSearching() {
      if (!application.searchingForUsers()) { return 'hidden'; }
    },

    spacekeyDoesntClosePop(event) {
      event.stopPropagation();
      return event.preventDefault();
    },      

    search(event) {
      const query = event.target.value.trim();
      self.query(query);
      application.searchingForUsers(true);
      return self.searchUsers(query);
    },

    searchUsers: debounce(function(query) {
      if (query.length) {
        return application.searchUsers(self.query());
      } 
      return application.searchingForUsers(false);
        
    }
      , 500),

    searchResults() {
      const MAX_RESULTS = 5;
      if (self.query().length) {
        return application.searchResultsUsers().slice(0, MAX_RESULTS);
      } 
      return [];
      
    },

    hiddenIfNoSearch() {
      if (!self.searchResults().length && !application.searchingForUsers()) {
        return 'hidden';
      }
    }, 

    UserResultItem(user) {
      const action = () => {
        console.log("hi");
        //application.team().addUser(application, user);
      };
      const props = {
        user: user.asProps(),
        action,
      };
      
      return Reactlet(UserResultItem, props, `add-user-${user.id()}`);
    },
    
  };
            
  return AddTeamUserTemplate(self);
}
/*

/*
- Loader = require "../includes/loader"

dialog.pop-over.add-team-user-pop(class=@hiddenUnlessAddTeamUserPopVisible click=@stopPropagation)

  section.pop-over-info
    input#team-user-search.pop-over-input.search-input.pop-over-search(input=@search keyup=@spacekeyDoesntClosePop placeholder="Search for a user or email")

  section.pop-over-actions.last-section.results-list(class=@hiddenIfNoSearch)

    span(class=@hiddenUnlessSearching)
      = Loader(this)

    ul.results
      - application = @application
      - context = @
      - @searchResults().forEach (user) ->
        = context.UserResultItem(user)
*/

class AddTeamUserPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      search: '',
      searching: false,
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.updateSearch = debounce(this.updateSearch.bind(this), 200);
  }
  
  handleChange(evt) {
    this.setState({ search: evt.currentTarget.value.trim() });
    this.updateSearch();
  }
  
  updateSearch() {
    this.setState(({search}) => {
      return { searching: !!search };
    });
  }
  
  render() {
    const placeholder = "Search for a user or email";
    return (
      <dialog className="pop-over add-team-user-pop">
        <section className="pop-over-info">
          <input id="team-user-search" className="pop-over-input search-input pop-over-search"
            value={this.state.search} onChange={this.handleChange} placeholder={placeholder}
          />
        </section>
        {!!this.state.search && <section className="pop-over-actions last-section results-list">
          {this.state.searching && <Loader />}
        </section>}
      </dialog>
    );
  }
}

export default AddTeamUserPop;