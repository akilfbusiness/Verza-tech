const TOOLS_ROW_1 = [
  'Shopify', 'Klaviyo', 'HubSpot', 'Stripe', 'Gorgias',
  'Yotpo', 'Postscript', 'ReCharge', 'Monday.com', 'Notion',
  'Shopify', 'Klaviyo', 'HubSpot', 'Stripe', 'Gorgias',
  'Yotpo', 'Postscript', 'ReCharge', 'Monday.com', 'Notion',
]

const TOOLS_ROW_2 = [
  'Salesforce', 'Zendesk', 'Intercom', 'Mailchimp', 'WooCommerce',
  'BigCommerce', 'ActiveCampaign', 'Slack', 'Airtable', 'Attentive',
  'Salesforce', 'Zendesk', 'Intercom', 'Mailchimp', 'WooCommerce',
  'BigCommerce', 'ActiveCampaign', 'Slack', 'Airtable', 'Attentive',
]

export function LogosSection() {
  return (
    <section className="py-16 border-t border-b border-border overflow-hidden bg-background">
      <p className="text-center text-xs font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-10">
        Tools we review &amp; compare
      </p>

      {/* Row 1 — scrolls left */}
      <div className="relative mb-5 overflow-hidden">
        <div
          className="flex gap-10 whitespace-nowrap"
          style={{ animation: 'marquee 35s linear infinite' }}
        >
          {TOOLS_ROW_1.map((name, i) => (
            <span
              key={i}
              className="text-sm font-medium tracking-widest uppercase text-foreground/25 select-none shrink-0"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative overflow-hidden">
        <div
          className="flex gap-10 whitespace-nowrap"
          style={{ animation: 'marquee-reverse 40s linear infinite' }}
        >
          {TOOLS_ROW_2.map((name, i) => (
            <span
              key={i}
              className="text-sm font-medium tracking-widest uppercase text-foreground/20 select-none shrink-0"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
