import React from 'react';
import PropTypes from 'prop-types';

import randomColor from 'randomcolor';
import {sample} from 'lodash';

const iconHelp = 'https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fask-for-help.svg?1494954687906';

const kaomojis = [
  '八(＾□＾*)',
  '(ノ^_^)ノ',
  'ヽ(*ﾟｰﾟ*)ﾉ',
  '♪(┌・。・)┌',
  'ヽ(๏∀๏ )ﾉ',
  'ヽ(^。^)丿',
];

const QuestionItem = ({domain, colorOuter, colorInner, userAva}) => (
  <React.Fragment>
    <img className="help-icon" src={iconHelp} alt=""/>
    <a href={projectUrl} data-track="question" data-track-label={domain}>
      <div className="project" style={{backgroundColor: colorOuter}}>
        <div className="project-container" style={{backgroundColor: colorInner}}>
          <img className="avatar" src={
        </div>
      </div>
    </a>
  
  a(href=@projectUrl)
    .project(data-track="question" data-track-label=@domain style=@outerColor)
      .project-container(style=@innerColor)

        img.avatar(src=@userAvatar style=@userColor)

        button= "Help #{@userLogin()}"

        .description.question(title=@fullQuestion)=@filteredQuestion

        .description.tags
          - context = @
          - @question.tags().forEach (tag) ->
            - filteredTag = context.filteredTag tag
            .tag(alt=tag)= filteredTag

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
      const question = JSON.parse(details);
      const [colorInner, colorOuter] = randomColor({luminosity: 'light', count: 2});
      return {colorInner, colorOuter, ...question};
    });
    this.setState({
      kaomoji: sample(kaomojis),
      loading: false,
      questions,
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
            <ul className="projects-container">
              {questions.map(question => (
                <li key={question.questionId}>
                  <QuestionItem question={question}/>
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