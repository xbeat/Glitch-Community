import React from 'react';

import LayoutPresenter from '../layout';

import {DataLoader, } from '../includes/loader.jsx';
import {ProjectsUL} from "../projects-list.jsx";
import Categories from "../categories.jsx";
import Reactlet from "../reactlet";

/*
export default function(application) {

    
  var self = {

    application,
    category: application.category,

    projects() {
      const projects = self.category().projects().filter(project => project.fetched());
      const props = {
        closeAllPopOvers: application.closeAllPopOvers, 
        projects: projects.map(project => project.asProps()),
        categoryColor: self.category().color(),
      };
      return Reactlet(ProjectsUL, props);
    },

    Categories() {
      const props = {
        categories: application.categories,
      };
      return Reactlet(Categories, props);
    },

    name() {
      return self.category().name();
    },

    avatarUrl() {
      return self.category().avatarUrl();
    },

    description() {
      return self.category().description();
    },

    backgroundColor() {
      return self.category().backgroundColor();
    },

    style() {
      return {backgroundColor: self.backgroundColor()};
    },

    hiddenIfCategoryProjectsLoaded() {
      if (application.categoryProjectsLoaded()) { return 'hidden'; }
    },
  };
    
  const content = CategoryPageTemplate(self);
  return LayoutPresenter(application, content);
}
*/

const CategoryPageWrap = ({category, categories, children}) => (
  <React.Fragment>
    <main className="category-page">
      <article className="projects" style={{backgroundColor: category.backgroundColor}}>
        <header className="category">
          <h2 className="category-name">{category.name}</h2>
          <span className="category-image-container">
            <img src={category.avatarUrl} alt=""/>
          </span>
          <p className="description">{category.description}</p>
        </header>
        {children}
      </article>
    </main>
    <Categories categories={categories}/>
  </React.Fragment>
);

const CategoryPageLoader = ({...props}) => (
  <CategoryPageWrap {...props}>
    <Loader/>
  </CategoryPageWrap>
);

const CategoryPageError = ({...props}) => (
  <CategoryPageWrap {...props}>
    Something went wrong. Try refreshing?
  </CategoryPageWrap>
);

const CategoryPage = ({api, category, ...props}) => (
  <DataLoader
    get={() => ({data: category})}
    renderLoader={() => <CategoryPageLoader category={category} {...props}/>}
    renderError={() => <CategoryPageError category={category} {...props}/>}
  >
    {({data}) => (
      <CategoryPageWrap category={data} {...props}>
        data!
      </CategoryPageWrap>
    )}
  </DataLoader>
);

export default function(application, category) {
  const props = {
    api: application.api(),
    category,
    categories: application.categories,
  };
  const content = Reactlet(CategoryPage, props);
  return LayoutPresenter(application, content);
}