import { supabaseAdmin } from "./supabase";
import { ICreateShopData } from "@/types/shop";
import { safeLogger } from "./security";

export async function createShop(shopData: ICreateShopData) {
  try {
    const { data, error } = await supabaseAdmin
      .from("shops")
      .insert([shopData])
      .select()
      .single();

    if (error) {
      safeLogger.error("Error creating shop", { error: error.message });
      throw new Error(`Failed to create shop: ${error.message}`);
    }

    await logAuditEvent("server", "oauth_success", data.id, {
      shopDomain: shopData.shopDomain,
      apiScope: shopData.apiScope,
    });

    return data;
  } catch (error) {
    await logAuditEvent("server", "oauth_failure", null, {
      error: error instanceof Error ? error.message : String(error),
      shopDomain: shopData.shopDomain,
    });
    throw error;
  }
}

export async function getShopByDomain(shopDomain: string) {
  const { data, error } = await supabaseAdmin
    .from("shops")
    .select("*")
    .eq("shop_domain", shopDomain)
    .single();

  if (error && error.code !== "PGRST116") {
    safeLogger.error("Error fetching shop by domain", { error: error.message });
    throw new Error(`Failed to fetch shop: ${error.message}`);
  }

  return data;
}

export async function logAuditEvent(
  actor: string,
  action: string,
  shopId: string | null,
  meta: any = null
) {
  try {
    await supabaseAdmin.from("audit_logs").insert([
      {
        actor,
        action,
        shop_id: shopId,
        meta,
      },
    ]);
  } catch (error) {
    safeLogger.error("Error logging audit event", { 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
}
