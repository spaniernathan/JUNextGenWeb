const Handlebars = require('handlebars')

const tmpl = `
<div class="dropdown is-hoverable">
  <div class="dropdown-trigger">
    <button class="button" aria-haspopup="true" aria-controls="add-song-dropdown-menu">
      <span>Add to playlist</span>
      <span class="icon is-small">
        <i class="fas fa-angle-down" aria-hidden="true"></i>
      </span>
    </button>
  </div>
  <div>
  </div>
  <div class="dropdown-menu" id="add-song-dropdown-menu" role="menu">
    <div class="dropdown-content">
      <a class="dropdown-item" href="/playlist-create">Create playlist</a>
      <div class="dropdown-divider"></div>
      {{#each currentUser.playlists}}
      <form method="POST" action="/playlist/{{id}}/{{../songId}}">
        <input class="dropdown-item dropdown-item-add-playlist" type="submit" value="{{name}}"/>
      </form>
      {{/each}}
    </div>
  </div>
</div>
`

module.exports = Handlebars.compile(tmpl)
