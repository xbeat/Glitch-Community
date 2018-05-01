
import CategoryTemplate from '../templates/includes/category';

import {ProjectsUL} from "./projects-list.jsx";
import Reactlet from "./reactlet";


export default function(application, category) {
  const self = {

    category,

    style() {
      return {backgroundColor: category.backgroundColor()};
    },

    url() {
      return category.url();
    },

    name() {
      return category.name();
    },
    
    description() {
      return category.description();
    },
    
    projects() {
      const { projects } = category;
      if(!projects.length) {
        return;
      }
      const props = {
        closeAllPopOvers: application.closeAllPopOvers,
        projects: projects.map(project => project.asProps()),
        categoryColor: category.color(),
      };

      return Reactlet(ProjectsUL, props);
    }
  };

  return CategoryTemplate(self);
}

export (application, category) => {
  return (
    <article className="projects" style={backgroundColor: category.backgroundColor()}>
      <header className="category">
        <
        
article.projects(@style)
  header.category
    a.category-name(href=@url)
      h2= @name
        span.arrow →
    span.category-image-container
      a.category-image(href=@url)
        img(src=@category.avatarUrl alt=@name)
    p.category-description= @description

  = @projects()

}
