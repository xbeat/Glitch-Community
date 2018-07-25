import React from 'react';

import QuestionsTemplate from '../templates/includes/questions';
import QuestionItemPresenter from './question-item';
import Observable from 'o_0';
import randomColor from 'randomcolor';
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

const QuestionTimer = ({animating, callback}) => (
  <div className="loader-pie" title="Looking for more questions...">
    <div className="left-side"><div className={`slice ${animating ? 'animated' : ''}`} onAnimationEnd={callback}></div></div>
    <div className="right-side"><div className={`slice ${animating ? 'animated' : ''}`}></div></div>
  </div>
);

class Questions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kaomoji: '',
      loading: true,
      questions: [],
    };
  }
  
  async load() {
    this.timeout = null;
    this.setState({loading: true});
    const {data} = await this.props.api.get('projects/questions');
    const questions = data.map(({details}) => {
      const [colorInner, colorOuter] = randomColor({luminosity: 'light', count: 2});
      return {
        ...JSON.parse(details),
        colorInner, colorOuter,
      };
    });
    this.setState({
      kaomoji: sample(kaomojis),
      loading: false,
    });
  }
  
  componentDidMount() {
    this.load();
  }
  
  render() {
    const {kaomoji, loading, questions} = this.state;
    return (
      <section className="questions">
        <h2>
          <a href="/questions">Help Others, Get Thanks →</a>{' '}
          <QuestionTimer animating={!loading} callback={() => this.load()}/>
        </h2>
        <article className="projects">
          {questions.length ? (
            'asdf'
          ) : (
            <React.Fragment>
              {kaomoji} Looks like nobody is asking for help right now.{' '}
              <a className="general-link" href="/help/how-can-i-get-help-with-code-in-my-project/">Learn about helping</a>
            </React.Fragment>
          )}
        </article>
      </section>
    );
  }
}

export default Questions;