const Handlebars = require('handlebars')

const tmpl = `
<div class="columns">
    <div class="column">
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
              <a class="dropdown-item">
                  <form method="POST" action="/playlist/{{id}}/{{../songId}}">
                    <input class="dropdown-item-add-playlist" type="submit" value="{{name}}"/>
                  </form>
              </a>
              {{/each}}
            </div>
          </div>
        </div>
    </div>
    <div class="column">
        {{#if owned}}
          <form method="post" action="/playlist-delete/{{playlistId}}/{{songId}}">
              <button class="button is-danger" type="submit">
                <span class="icon is-small">
                  <i class="fas fa-trash"></i>
                </span>
              </button>
          </form>
        {{/if}}
    </div>
</div>
`

module.exports = Handlebars.compile(tmpl)
