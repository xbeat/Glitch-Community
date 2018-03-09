import React from 'react';
  
const Categories = ({categories}) => (
  <section class="categories" role="navigation">
    <h2>More Ideas</h2>
    <ul>
      { categories.map(({avatarUrl, color, name, url}) => (
        <a class="category-box-link" href={url}>
          <li>
            <div class="category-box centered" style={`background-color: ${color()}`}>
              <img src={avatarUrl} alt={name}/>
            </div>
            <div class="category-box-label centered" style={`background-color: ${color()}`}>{name}</div>
          </li>
        </a>
      ))}
    </ul>
  </section>
);

export default Categories;
