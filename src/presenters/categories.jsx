import React from 'react';
  
const Categories = ({categories}) => (
  <section class="categories" role="navigation">
    <h2>More Ideas</h2>
    <ul>
      { categories.map((category) => (
        <a class="category-box-link" href="hello-worlds">
          <li>
            <div class="category-box centered" style="background-color: #FCF3AF">
              <img src="https://cdn.hyperdev.com/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Fcomputer.svg" alt="Hello Worlds"/>
            </div>
            <div class="category-box-label centered" style="background-color: #FCF3AF">Hello Worlds</div>
          </li>
        </a>
      ))}
    </ul>
  </section>
);

export default Categories;


/*
section.categories(role="navigation")
      h2 More Ideas
      ul
        - @categories().forEach (category) ->

          - avatarUrl = category.avatarUrl
          - color = category.color()
          - name = category.name
          - url = category.url

          a.category-box-link(href=url)
            li
              .category-box.centered(style="background-color: #{color}")
                img(src=avatarUrl alt=name)
              .category-box-label.centered(style="background-color: #{color}")= name
*/