import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { customerName, email, address, total, orderId } = await req.json();

    const { data, error } = await resend.emails.send({
      from: "ISHHAQ & CO <orders@ishhaqco.com>",
      to: email,
      subject: `Your Order Confirmation — #${orderId.slice(0, 8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Georgia, serif; background: #faf9f6; margin: 0; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: white; border: 1px solid #e5e5e5;">
            <!-- Header -->
            <div style="background: #121c2d; padding: 40px; text-align: center;">
              <p style="color: #c5a059; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; margin: 0 0 8px 0;">Order Confirmed</p>
              <h1 style="color: white; font-size: 28px; margin: 0; font-weight: normal;">ISHHAQ &amp; CO</h1>
              <p style="color: #aaa; font-size: 11px; letter-spacing: 0.2em; margin: 8px 0 0 0; text-transform: uppercase;">Timepiece</p>
            </div>

            <!-- Body -->
            <div style="padding: 40px;">
              <p style="color: #121c2d; font-size: 16px; margin: 0 0 20px 0;">
                Dear ${customerName},
              </p>
              <p style="color: #555; font-size: 14px; line-height: 1.8; margin: 0 0 30px 0;">
                Thank you for choosing <strong>ISHHAQ &amp; CO</strong>. Your order has been received and our team will personally ensure your timepiece is prepared and dispatched with the utmost care.
              </p>

              <!-- Order Details -->
              <div style="background: #faf9f6; border: 1px solid #e5e5e5; padding: 24px; margin-bottom: 30px;">
                <p style="color: #999; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; margin: 0 0 16px 0;">Order Details</p>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #555; font-size: 13px;">Order ID</td>
                    <td style="padding: 8px 0; color: #121c2d; font-size: 13px; text-align: right; font-family: monospace;">#${orderId.slice(0, 8).toUpperCase()}</td>
                  </tr>
                  <tr style="border-top: 1px solid #f0f0f0;">
                    <td style="padding: 8px 0; color: #555; font-size: 13px;">Ship To</td>
                    <td style="padding: 8px 0; color: #121c2d; font-size: 13px; text-align: right;">${address}</td>
                  </tr>
                  <tr style="border-top: 1px solid #f0f0f0;">
                    <td style="padding: 8px 0; color: #555; font-size: 13px; font-weight: bold;">Total Paid</td>
                    <td style="padding: 8px 0; color: #c5a059; font-size: 18px; font-weight: bold; text-align: right;">₹${Number(total).toLocaleString("en-IN")}</td>
                  </tr>
                </table>
              </div>

              <p style="color: #555; font-size: 13px; line-height: 1.8; margin: 0 0 30px 0;">
                You can track your order status anytime at:<br/>
                <a href="https://ishhaqco.com/account/orders" style="color: #c5a059;">ishhaqco.com/account/orders</a>
              </p>

              <p style="color: #555; font-size: 13px; line-height: 1.8; margin: 0;">
                If you have any questions, reply to this email or message us on WhatsApp.<br/><br/>
                Warm regards,<br/>
                <strong style="color: #121c2d;">The ISHHAQ &amp; CO Team</strong>
              </p>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #e5e5e5; padding: 24px 40px; text-align: center;">
              <p style="color: #bbb; font-size: 11px; margin: 0; letter-spacing: 0.1em; text-transform: uppercase;">
                © ${new Date().getFullYear()} ISHHAQ &amp; CO · Crafted with Precision
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
