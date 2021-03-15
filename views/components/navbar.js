const Handlebars = require('handlebars')

const tmpl = `
<nav class="navbar is-primary" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item">
      <img src="/icons/PlayLister.svg" width="112" height="28">
    </a>
  </div>

  <div class="navbar-menu">
    <div class="navbar-start">
      <a class="navbar-item {{#if navbar.home}}is-active{{/if}}" href="/">
        Home
      </a>

      {{#if currentUser.logged}}
        <a class="navbar-item {{#if navbar.songs}}is-active{{/if}}" href="/songs">
          Songs
        </a>
        <a class="navbar-item" href="/playlists">
          Playlists
        </a>
        <a class="navbar-item {{#if navbar.users}}is-active{{/if}}" href="/users">
          Users
        </a>
      {{/if}}

      

      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">
          More
        </a>

        <div class="navbar-dropdown">
          <a class="navbar-item {{#if navbar.about}}is-active{{/if}}" href="/about">
            About
          </a>

          <a class="navbar-item {{#if navbar.contact}}is-active{{/if}}" href="/contact">
            Contact
          </a>
        </div>
      </div>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        {{#if currentUser.logged}}
        <div class="buttons">
            <a class="button is-primary" href="/profile">
                <strong>Profile</strong>
            </a>
            <form action="/signout" method="POST">
                <button class="button is-danger" type="submit">Log out</button>
            </form>
        </div>
        {{else}}
          <div class="buttons">
            <a class="button is-primary" href="/signup">
              <strong>Sign up</strong>
            </a>
            <a class="button is-light" href="/login">
              Log in
            </a>
          </div>
        {{/if}}
      </div>
    </div>
  </div>
</nav>`

module.exports = Handlebars.compile(tmpl)
