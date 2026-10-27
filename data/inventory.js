/*
  INVENTORY IS STORED IN SUPABASE
  The browser app loads the shared live catalog from public.inventory_items.
  Do not add real stock counts to this static file. All visitors (signed in or not)
  receive the same shared dataset; only approved editors/admins may modify it.
*/
window.SHOP_INVENTORY = [];
