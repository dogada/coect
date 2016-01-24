'use strict';

/**
   Access level are used to restrict access of users to the content.
   Admins have no restrictions and have full access to all content ('root' account in Linux).
   Owner of a channnel and channel's admins have full access to channel's
   content only.
   
   USER access level allows to hide hide content from search spiders but all
   registered users of the hub will have access.

   CUSTOMER level usually assigned by channel's or hub's owner to some users that bought
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

   Levels related to a group of users end with zero. Levels for special content states
   (DELETED, TRASH, REJECTED, MODERATION) have values between close user related levels.

   During moderation same entry can move between MODERATOR and REJECTED states
   several times (owner can improve entry after moderator's review). Moderator
   can also lock entry in REJECTED state and owner will not be able to resubmit
   it (usefull for spam).

   Rejected entries and spam are deleted by users with ADMIN access level or an
   crontab job that deleted rejected entries older than X days. Depending on the
   project entry can be deleted physically from the database or just marked as
   DELETED (with clearing of entry content (name, text,etc). 

   DELETED entry can't be restored, because only ids assotiated with the entry
   are left. If you want to restore entity change it access level to TRASH
   (content will not be altered but entry will not be visible on site). Entries
   with TRASH access level visible to owner only (and admins as everything rest)
   on special page like 'Trash Bin' where entry can be restored.

   If it's need to hide entry from other but still show to owner on site
   pages user OWNER access level.

   Access level can be valid for site context, channel context or both.
   Site context: ROOT, USER, STAFF, CUSTOMER, EVERYONE.
   Channel context: MEMBER, TAG.
   Both: ADMIN, MODERATOR.
   Project owner should decide will it use global moderators or moderators will
   be asssigned on channel basis.
   OWNER role is valid for entity context only (channel or entry).

   ROOT can access any channel and any content on the site. ADMIN can access
   channel entries with access greater or equal to Access.ADMIN. Admin can
   access channel only if channel doesn't have ACL (Access Control List) or ACL
   allows access to this admin. Channel owner always have ADMIN access level
   inside channel (it looks like root user for the channel). So even if a user
   assigned to global groups 'moderators' it will not have access to closed
   community and will not be able to admin, moderate or even read it (root user
   however can do all this).
   Site-wide moderators can moderate only group with owner from 'staff' group.
   
*/
class Access {

  static valueName(value) {
    for (let x in this) {
      if (this[x] === value) return x.toLowerCase()
    }
  }

  static nameValue(name) {
    return this[name.toUpperCase()]
  }
}

Access.ROOT =  0  // only root users (hub's admins) can access content

Access.ADMIN =  10  // admins have full access to the content too

Access.DELETED = 13 // access to deleted entries (if content only is physically removed)

Access.TRASH = 15  // access to the entries in Trash (Recycle Bin)

Access.OWNER = 20 // content's owner have full access to the content

Access.REJECTED = 25 // entries that was rejected by moderators

Access.MODERATOR = 30 // at least moderator status is required

Access.MODERATION = 35 // content on moderation

Access.STAFF = 40

Access.TAG = 50 // users with tag assigned by channel's owner (family, friends, etc)

Access.CUSTOMER = 60 // users added to 'customers' group

Access.MEMBER = 70 // community members, followers of public channels, subscribers, etc

Access.USER = 80  // at least logged user status is required

Access.EVERYONE = 90 // everyone including search spider's can access content

module.exports = Access
