import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const dbPassword = process.env.SUPABASE_DB_PASSWORD!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Direct DB connection string for raw SQL (bcrypt hash copy)
const DB_URL = `postgresql://postgres.zaryzynzbpxmscggufdc:${dbPassword}@aws-0-eu-west-2.pooler.supabase.com:5432/postgres`;

async function migrate() {
  console.log("Migrating partner_roasters to Supabase Auth...\n");

  // Fetch all roasters
  const { data: roasters, error } = await supabase
    .from("partner_roasters")
    .select("id, email, password_hash, business_name, contact_name, user_id");

  if (error) {
    console.error("Failed to fetch roasters:", error.message);
    process.exit(1);
  }

  if (!roasters || roasters.length === 0) {
    console.log("No roasters found. Nothing to migrate.");
    return;
  }

  console.log(`Found ${roasters.length} roaster(s) to process.\n`);

  for (const roaster of roasters) {
    // Skip if already linked
    if (roaster.user_id) {
      console.log(`✓ ${roaster.email} — already linked (user_id: ${roaster.user_id})`);
      continue;
    }

    console.log(`Processing: ${roaster.email}`);

    // Check if email already exists in auth.users (main site customer)
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === roaster.email.toLowerCase()
    );

    let authUserId: string;

    if (existingUser) {
      // User already exists in auth — link them, don't overwrite password
      authUserId = existingUser.id;
      console.log(`  → Found existing auth user (${authUserId}), linking without password change`);
    } else {
      // Create new auth user with a temporary password, then overwrite hash via SQL
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: roaster.email,
        email_confirm: true,
        user_metadata: {
          full_name: roaster.contact_name,
          business_name: roaster.business_name,
        },
      });

      if (createError) {
        console.error(`  ✗ Failed to create auth user: ${createError.message}`);
        continue;
      }

      authUserId = newUser.user.id;
      console.log(`  → Created auth user (${authUserId})`);

      // Copy the existing bcrypt hash directly into auth.users.encrypted_password
      // Supabase uses the same bcrypt format, so this preserves the original password
      if (roaster.password_hash) {
        const { error: hashError } = await supabase.rpc("exec_sql" as string, {
          query: `UPDATE auth.users SET encrypted_password = '${roaster.password_hash.replace(/'/g, "''")}' WHERE id = '${authUserId}'`,
        });

        // If RPC doesn't exist, use the REST Data API workaround via raw postgres
        if (hashError) {
          console.log(`  → Note: Could not copy bcrypt hash via RPC (${hashError.message}).`);
          console.log(`    Run manually: UPDATE auth.users SET encrypted_password = '${roaster.password_hash}' WHERE id = '${authUserId}';`);
        } else {
          console.log(`  → Copied bcrypt password hash`);
        }
      }
    }

    // Ensure public.users row exists (trigger should have created it, but be safe)
    const { error: upsertError } = await supabase.from("users").upsert(
      {
        id: authUserId,
        email: roaster.email,
        full_name: roaster.contact_name,
        business_name: roaster.business_name,
      },
      { onConflict: "id" }
    );

    if (upsertError) {
      console.error(`  ✗ Failed to upsert public.users: ${upsertError.message}`);
    }

    // Grant roaster role
    const { error: roleError } = await supabase.from("user_roles").upsert(
      {
        user_id: authUserId,
        role_id: "roaster",
        roaster_id: roaster.id,
      },
      { onConflict: "user_id,role_id,roaster_id" }
    );

    if (roleError) {
      console.error(`  ✗ Failed to grant roaster role: ${roleError.message}`);
    } else {
      console.log(`  → Granted roaster role`);
    }

    // Link partner_roasters.user_id
    const { error: linkError } = await supabase
      .from("partner_roasters")
      .update({ user_id: authUserId })
      .eq("id", roaster.id);

    if (linkError) {
      console.error(`  ✗ Failed to link user_id: ${linkError.message}`);
    } else {
      console.log(`  → Linked partner_roasters.user_id`);
    }

    console.log(`  ✓ Done\n`);
  }

  console.log("Migration complete.");
}

migrate().catch(console.error);
