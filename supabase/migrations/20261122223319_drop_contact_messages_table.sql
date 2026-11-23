/*
# Remove leftover contact_messages table

## Summary
The site previously allowed visitors to send a message through a contact form. That feature has been removed from the app: the form is gone, the edge function that handled it was deleted, and no code references the table anymore.

## Change
- Drop `public.contact_messages` and all of its data, since the feature is retired.

## Security
This table carried broad permissions: anonymous and signed-in users were granted full SELECT, INSERT, UPDATE, and DELETE on every column (the RLS policy only allowed INSERT, but the overly-broad grants should never have existed). Removing the table eliminates that dead attack surface completely.

## Note
The table currently holds zero rows, so no data is lost.
*/

DROP TABLE IF EXISTS public.contact_messages;
