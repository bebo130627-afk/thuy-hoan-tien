export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const apiKey = process.env.ADDLIVETAG_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      error: "Chưa cấu hình ADDLIVETAG_API_KEY trên Vercel."
    });
  }

  try {
    const { originUrl, subId } = req.body || {};

    if (!originUrl || typeof originUrl !== "string") {
      return res.status(400).json({ ok: false, error: "Thiếu link Shopee." });
    }

    let url;
    try {
      url = new URL(originUrl.trim());
    } catch {
      return res.status(400).json({ ok: false, error: "Link không hợp lệ." });
    }

    const host = url.hostname.toLowerCase();
    const isShopee =
      host === "shopee.vn" ||
      host.endsWith(".shopee.vn") ||
      host === "shope.ee" ||
      host === "s.shopee.vn" ||
      host === "vn.shp.ee";

    if (!isShopee) {
      return res.status(400).json({
        ok: false,
        error: "Vui lòng dán link Shopee Việt Nam."
      });
    }

    const safeSubId = String(subId || "demo-user")
      .trim()
      .replace(/[^A-Za-z0-9_-]/g, "_")
      .slice(0, 64) || "demo-user";

    const query = `
      mutation {
        generateShortLink(input: {
          originUrl: ${JSON.stringify(originUrl.trim())},
          subIds: [${JSON.stringify(safeSubId)}]
        }) {
          shortLink
        }
      }
    `;

    const response = await fetch("https://open-api.affiliate.shopee.vn/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();

    if (!response.ok || data.errors?.length) {
      return res.status(502).json({
        ok: false,
        error: "AddLiveTag/Shopee API trả về lỗi.",
        details: data.errors || data
      });
    }

    const shortLink = data?.data?.generateShortLink?.shortLink;
    if (!shortLink) {
      return res.status(502).json({
        ok: false,
        error: "Không nhận được link affiliate từ API.",
        details: data
      });
    }

    return res.status(200).json({
      ok: true,
      shortLink,
      subId: safeSubId
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Lỗi máy chủ.",
      details: process.env.NODE_ENV === "development" ? String(error) : undefined
    });
  }
}
