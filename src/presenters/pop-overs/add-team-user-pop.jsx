import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

import Loader from '../includes/loader.jsx';
import UserResultItem from '../includes/user-result-item.jsx';

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

const UserSearchResults = ({users, action}) => (
  (users.length > 0) ? (
    <ul className="results">
      {users.map(user => (
        <li key={user.id}>
          <UserResultItem user={user} action={() => action(user.id)} />
        </li>
      ))}
    </ul>
  ) : (
    <p className="results">nothing found</p>
  )
);

UserSearchResults.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired).isRequired,
  action: PropTypes.func.isRequired,
};

class AddTeamUserPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      query: '', //The actual search text
      maybeRequest: null, //The active request promise
      maybeResults: null, //Null means still waiting vs empty -- [jude: i suggest the 'maybe' convention for nullable fields with meaning.  'maybeResults'] --greg: i like it
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.startSearch = debounce(this.startSearch.bind(this), 300);
  }
  
  handleChange(evt) {
    const query = evt.currentTarget.value.trim();
    this.setState({ query });
    if (query) {
      this.startSearch();
    } else {
      this.clearSearch();
    }
  }
  
  clearSearch() {
    this.setState({
      maybeRequest: null,
      maybeResults: null,
    });
  }
  
  // jude: I wish you could use async!  it won't work well. :-'( 
  // for the moment only promises are supported, but we can chat obout if we want to target async/await
  // the main problem is that Babel has to fake it, and it fakes it rather brutally
  // :`(
  // right! but we have es6 promises at least.
  
  startSearch() {
    if (!this.state.query) {
      return this.clearSearch();
    }
    
    const request = this.props.search(this.state.query);
    this.setState({ maybeRequest: request });
    
    request.then(results => {
      this.setState(({ maybeRequest }) => {
        return (request === maybeRequest) ? {
          maybeRequest: null,
          maybeResults: results.slice(0, 5).map(user => user.asProps()),
        } : {};
      });
    });
  }
  
  render() {
    const isLoading = (!!this.state.maybeRequest || !this.state.maybeResults);
    return (
      <dialog className="pop-over add-team-user-pop">
        <section className="pop-over-info">
          <input id="team-user-search"
            className="pop-over-input search-input pop-over-search"
            value={this.state.query} onChange={this.handleChange}
            placeholder="Search for a user or email"
          />
        </section>
        {!!this.state.query && <section className="pop-over-actions last-section results-list">
          {isLoading && <Loader />}
          {!!this.state.maybeResults && <UserSearchResults users={this.state.maybeResults} action={this.props.action} />}
        </section>}
      </dialog>
    );
  }
}

AddTeamUserPop.propTypes = {
  search: PropTypes.func.isRequired,
  action: PropTypes.func.isRequired,
};

export default AddTeamUserPop;