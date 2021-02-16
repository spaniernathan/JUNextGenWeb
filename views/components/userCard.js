const Handlebars = require('handlebars')

const tmpl = `
<a class="card is-clickable" href="/users/{{id}}">
  <div class="card-image">
    <figure class="image">
      {{#if imgUrl}}
        <img src="{{imgUrl}}" alt="Playlist image">
      {{ else }}
        <img src="https://via.placeholder.com/128" alt="Placeholder image">
      {{/if}}
    </figure>
  </div>
  <div class="card-content">
    <div class="content">
        <p class="title is-6">{{displayname}}</p>
    </div>
  </div>
</a>
`
module.exports = Handlebars.compile(tmpl)
