import React from 'react';

import QuestionsTemplate from '../templates/includes/questions';
import QuestionItemPresenter from './question-item';
import Observable from 'o_0';
import {sample} from 'lodash';

const DEFAULT_MAX_QUESTIONS = 3;

const kaomojis = [
  '八(＾□＾*)',
  '(ノ^_^)ノ',
  'ヽ(*ﾟｰﾟ*)ﾉ',
  '♪(┌・。・)┌',
  'ヽ(๏∀๏ )ﾉ',
  'ヽ(^。^)丿',
];

function old(application, maxQuestions) {
  var self = {

    maxQuestions() {
      return maxQuestions || DEFAULT_MAX_QUESTIONS;
    },

    kaomoji: Observable('八(＾□＾*)'),

    randomKaomoji() {
      const kaomojis = [
        '八(＾□＾*)',
        '(ノ^_^)ノ',
        'ヽ(*ﾟｰﾟ*)ﾉ',
        '♪(┌・。・)┌',
        'ヽ(๏∀๏ )ﾉ',
        'ヽ(^。^)丿',
      ];
      return self.kaomoji(sample(kaomojis));
    },

    hiddenIfQuestions() {
      if (application.questions().length) { return 'hidden'; }
    },

    hiddenUnlessQuestions() {
      if (!application.questions().length) { return 'hidden'; }
    },

    questions() {
      return application.questions().map(question => QuestionItemPresenter(application, question));
    },

    animatedUnlessLookingForQuestions() {
      if (!application.gettingQuestions()) { return 'animated'; }
    },
  };


  setInterval(function() {
    application.getQuestions();
    return self.randomKaomoji();
  }
    , 10000);

  return QuestionsTemplate(self);
}

const QuestionItem = ({}) => (
  <React.Fragment>
    asdf
  </React.Fragment>
);

const QuestionTimer = ({animating}) => (
  <div className="loader-pie" title="Looking for more questions...">
    <div className="left-side"><div className={`slice ${animating ? 'animated' : ''}`}></div></div>
    <div className="right-side"><div className={`slice ${animating ? 'animated' : ''}`}></div></div>
  </div>
);

class Questions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kaomoji: kaomojis[0],
      loading: false,
      questions: [],
    };
    this.timeout = null;
  }
  
  async load() {
    this.timeout = null;
    this.setState({loading: true});
    await new Promise(resolve => window.setTimeout(resolve, 1000));
    this.setState({loading: false});
    this.timeout = window.setTimeout(() => this.load(), 10000);
  }
  
  componentDidMount() {
    this.load();
  }
  
  componentWillUnmount() {
    if (this.timeout !== null) {
      window.clearTimeout(this.timeout);
    }
  }
  
  render() {
    const {kaomoji, loading, questions} = this.state;
    return (
      <section className="questions">
        <h2>
          <a href="/questions">Help Others, Get Thanks →</a>
          {' '}
          <QuestionTimer animating={!loading}/>
        </h2>
      </section>
    );
  }
}

export default Questions;