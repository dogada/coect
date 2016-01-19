'use strict';

/**
   Access level are used to restrict access of users to the content.
   Admins have no restrictions and have full access to all content ('root' account in Linux).
   Owner of a channnel and channel's admins have full access to channel's
   content only.
   
   USER access level allows to hide hide content from search spiders but all
   registered users of the hub will have access.

   MEMBER level usually assigned by channel's or hub's owner to some users that bought
   some kind of subscription plan or smth like this.

   Owner of content have full access to it if access is greater or equal to
   OWNER.

   If content's access level is less than OWNER, only admins can access it (and even owner
   can't). Such access level are good when you need to hide content from web-site
   but don't want to delete it (yet).

   ROOT access level mean's that only site-wide admins can access it (and 
   channel's admin can't). Everyone can create a channel and
   then violate hub's content rules in own channel, then hub's admin can
   restrict access to the channel even for its owner until the solution of the
   probem will be found.
   
*/
class Access {
  
}

Access.ROOT =  0  // only root users (hub's admins) can access content

Access.ADMIN =  10  // channel's admins have full access to the content

Access.OWNER = 20 // content's owner have full access to the content

Access.MODERATOR = 30 // at least moderator status is required

Access.TAG = 40 // user need to have tag assigned by channel's owner (family, friends, etc)

Access.MEMBER = 50 // at least member status is required to access content

Access.FOLLOWER = 60 // at least channel's follower (subscriber) status is required

Access.USER = 70  // at least logged user status is required

Access.EVERYONE = 80 // everyone including search spider's can access content

module.exports = Access
