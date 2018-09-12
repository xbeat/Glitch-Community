import React from 'react';

import categories from '../curated/categories';

import Link from './includes/link.jsx';
  
const Categories = () => (
  <section className="categories" role="navigation">
    <h2>More Ideas</h2>
    <ul>
      { categories.map(({avatarUrl, color, id, name, url}) => (
        <li key={id}>
          <Link className="category-box-link" to={`/${url}`}>
            <div className="category-box centered" style={{backgroundColor: color}}>
              <img src={avatarUrl} alt={name}/>
            </div>
            <div className="category-box-label centered" style={{backgroundColor: color}}>{name}</div>
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default Categories;
