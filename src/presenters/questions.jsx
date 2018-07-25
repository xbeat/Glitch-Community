import React from 'react';
import PropTypes from 'prop-types';

import randomColor from 'randomcolor';
import {sample} from 'lodash';

import {getEditorUrl} from '../models/project';

const iconHelp = 'https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fask-for-help.svg?1494954687906';

const kaomojis = [
  '八(＾□＾*)',
  '(ノ^_^)ノ',
  'ヽ(*ﾟｰﾟ*)ﾉ',
  '♪(┌・。・)┌',
  'ヽ(๏∀๏ )ﾉ',
  'ヽ(^。^)丿',
];

function truncateQuestion(question) {
  const max = 140;
  if (question.length > max) {
    return question.substring(0, max - 3) + '…';
  } 
  return question;
}

function truncateTag(tag) {
  const max = 15;
  return tag.substring(0, max);
}

const QuestionItem = ({colorOuter, colorInner, domain, question, tags, userAvatar, userColor, userLogin, path, line, character}) => (
  <React.Fragment>
    <img className="help-icon" src={iconHelp} alt=""/>
    <a href={getEditorUrl(domain, path, line, character)} data-track="question" data-track-label={domain}>
      <div className="project" style={{backgroundColor: colorOuter}}>
        <div className="project-container" style={{backgroundColor: colorInner}}>
          <img className="avatar" src={userAvatar} style={{backgroundColor: userColor}} alt=""/>
          <div className="button">Help {userLogin}</div>
          <div className="description question" title={question}>{truncateQuestion(question)}</div>
          <div className="description tags">
            {tags.map(tag => <div key={tag} className="tag" title={tag}>{truncateTag(tag)}</div>)}
          </div>
        </div>
      </div>
    </a>
  </React.Fragment>
);
QuestionItem.propTypes = {
  colorOuter: PropTypes.string.isRequired,
  colorInner: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  userAvatar: PropTypes.string.isRequired,
  userColor: PropTypes.string.isRequired,
  userLogin: PropTypes.string.isRequired,
  path: PropTypes.string,
  line: PropTypes.number,
  character: PropTypes.number,
};

const QuestionTimer = ({animating, callback}) => (
  <div className="loader-pie" title="Looking for more questions...">
    <div className="left-side"><div className={`slice ${animating ? 'animated' : ''}`} onAnimationEnd={callback}></div></div>
    <div className="right-side"><div className={`slice ${animating ? 'animated' : ''}`}></div></div>
  </div>
);
QuestionTimer.propTypes = {
  animating: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
};

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
    this.setState({loading: true});
    try {
      const {data} = await this.props.api.get('projects/questions');
      const questions = data.slice(0, this.props.max).map(({details}) => {
        const question = JSON.parse(details);
        const [colorInner, colorOuter] = randomColor({luminosity: 'light', count: 2});
        return {colorInner, colorOuter, ...question};
      });
      this.setState({
        kaomoji: sample(kaomojis),
        questions,
      });
    } catch (error) {
      console.error(error);
    }
    this.setState({loading: false});
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
            <ul className="projects-container">
              {questions.map(question => (
                <li key={question.questionId}>
                  <QuestionItem {...question}/>
                </li>
              ))}
            </ul>
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
Questions.propTypes = {
  api: PropTypes.any.isRequired,
  max: PropTypes.number,
};
Questions.defaultProps = {
  max: 3,
};

export default Questions;