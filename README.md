# koobecafeht

A prototype/POC to test Facebook's Graph API and Javascript SDK with AngularJS.

## Features
 - Connects to Facebook's Graph API
 - Asks for permissions to manage a Facebook account linked to the user logged in
 - Displays list of published posts
 - Displays list of unpublished posts
 - Can make an immediate post
 - Can make an unpublished post
 - Can make an scheduled post

## Notes
- Created using a Gulp-Angular
- Requires setup of an Facebook App ID

## Tokens
- When dealing with Facebook's Graph API be sure to be aware of at least 3 tokens
- The first is the App token.  The App token identifies the app to the Graph API through the FB JS SDK
- The second is the User token.  This is requested after logging in and managed by the FB JS SDK
- The third is the Page Token.  This token is required to make any changes to a Facebook page.  It is not automatically managed by FB's Javascript SDK.
