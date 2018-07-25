import QuestionsPageTemplate from '../../templates/pages/questions';
import LayoutPresenter from '../layout';
import Questions from '../questions.jsx';
import Reactlet from '../reactlet';

import Categories from "../categories.jsx";

export default function(application) {
  const self = {

    application,

    questions() {
      const props = {
        api: application.api(),
        max: 12,
      };
      return Reactlet(Questions, props);
    },

    Categories() {
      const props = {
        categories: application.categories,
      };
     
      return Reactlet(Categories, props);
    },
  };
      
  const content = QuestionsPageTemplate(self);

  return LayoutPresenter(application, content);
}
