# Supabase setup — Baypath Electronics

This site uses Supabase for private inventory records, sign-in, role-based access, and inventory audit history.

## Site entry points

- Live site: https://urbestestfriend1.github.io/Baypath-RVTHS-Electronics/
- Sign in and account management: https://urbestestfriend1.github.io/Baypath-RVTHS-Electronics/#/account
- Supabase project: https://supabase.com/dashboard/project/kdvgslhidfuckcevjsxl

## Roles

- **Viewer:** can view the shared live inventory database.
- **Inventory editor:** can view, add, and update the shared inventory records.
- **Administrator:** can also delete inventory records, invite users, change roles, and remove user accounts.

The database enforces these permissions with Row Level Security (RLS). Inventory reads are public; writes require an active profile, confirmed email, and editor/admin role. Part numbers are normalized and checked case-insensitively for duplicates; quantity and minimum stock cannot be negative. Hiding editor controls in the web interface is not the only security layer.

## Add a user

Use the **Account → Invite a user** form while signed in as an active administrator. It sends an invitation email and assigns the selected role. New invitation profiles may be marked active by the database trigger, but database writes and administrator tools additionally require a confirmed email. An administrator can activate a pre-existing account only after its email has been confirmed. Self-registered or manually created accounts without approval stay unable to edit inventory.

Do not use **Authentication → Add user** for routine new accounts: manually created users are inactive by default unless an administrator explicitly activates them. Inactive accounts cannot read or change live inventory.

## Inventory

The Supabase inventory table is the single source of truth for every visitor. Anonymous visitors and signed-in users all read the same `public.inventory_items` rows, with live change notifications refreshing open inventory pages. The former fictional sample rows were removed from `data/inventory.js`; it is intentionally empty and should not be used to store real stock.

Use **Inventory → Add item** to create real records. Part number, item name, and category are required. Leave quantity blank if it has not been counted; use zero only for confirmed empty stock. Export CSV downloads the current filtered view.

Inventory changes are logged in `public.inventory_audit_log`. The log is readable only by administrators.

## Configuration and security notes

- `data/supabase-config.js` contains only the Supabase URL and publishable browser key. Publishable keys are designed for client-side use; never put a service-role or secret key in the repository.
- The `admin-users` Edge Function is required for invitations, role changes, user lists, and account removal. It validates the signed-in caller and checks the database role server-side.
- Keep the `private` schema out of Supabase's exposed Data API schemas.
- Supabase's Security Advisor reported **Leaked Password Protection Disabled** when this integration was reviewed. Enable it from the project's Auth password-security settings when supported by the project's plan.
- GitHub Pages is static hosting. Client-side passwords are sent directly to Supabase Auth over HTTPS; they are not stored in this repository.
