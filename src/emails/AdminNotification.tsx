import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
  Preview,
} from "@react-email/components";

interface AdminNotificationProps {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  bagSize: string;
  bagColour: string;
  roastProfile: string;
  grind: string;
  quantity: number;
  pricePerBag: number;
  totalPrice: number;
  labelFileUrl: string | null;
  stripeSessionId: string;
  stripePaymentId: string;
  deliveryAddress?: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    postal_code: string;
  } | null;
}

export function AdminNotification({
  orderNumber,
  customerEmail,
  customerName,
  bagSize,
  bagColour,
  roastProfile,
  grind,
  quantity,
  pricePerBag,
  totalPrice,
  labelFileUrl,
  stripeSessionId,
  stripePaymentId,
  deliveryAddress,
}: AdminNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {`New order ${orderNumber} — ${quantity}× ${bagSize} ${roastProfile}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Order Received</Heading>

          <Section style={orderBox}>
            <Text style={orderNumberText}>
              {`${orderNumber}`}
            </Text>
            <Hr style={hr} />

            <Text style={sectionTitle}>Customer</Text>
            <Text style={text}>
              {`${customerName} — `}
              <Link href={`mailto:${customerEmail}`} style={link}>
                {customerEmail}
              </Link>
            </Text>

            <Hr style={hr} />
            <Text style={sectionTitle}>Order Details</Text>
            <table style={table}>
              <tbody>
                <tr>
                  <td style={labelCell}>Bag Size</td>
                  <td style={valueCell}>{bagSize}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Colour</td>
                  <td style={valueCell}>{bagColour}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Roast Profile</td>
                  <td style={valueCell}>{roastProfile}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Grind</td>
                  <td style={valueCell}>{grind}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Quantity</td>
                  <td style={valueCell}>{`${quantity} bags`}</td>
                </tr>
              </tbody>
            </table>

            <Hr style={hr} />
            <Text style={sectionTitle}>Revenue</Text>
            <table style={table}>
              <tbody>
                <tr>
                  <td style={labelCell}>Price per bag</td>
                  <td style={valueCell}>{`£${pricePerBag.toFixed(2)}`}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Total</td>
                  <td style={valueBold}>{`£${totalPrice.toFixed(2)}`}</td>
                </tr>
              </tbody>
            </table>

            {labelFileUrl && (
              <>
                <Hr style={hr} />
                <Text style={sectionTitle}>Label File</Text>
                <Link href={labelFileUrl} style={link}>
                  Download label
                </Link>
              </>
            )}

            {deliveryAddress && (
              <>
                <Hr style={hr} />
                <Text style={sectionTitle}>Delivery Address</Text>
                <Text style={addressText}>
                  {deliveryAddress.name}
                  <br />
                  {deliveryAddress.line1}
                  {deliveryAddress.line2 && (
                    <>
                      <br />
                      {deliveryAddress.line2}
                    </>
                  )}
                  <br />
                  {deliveryAddress.city}
                  <br />
                  {deliveryAddress.postal_code}
                </Text>
              </>
            )}
          </Section>

          <Section style={metaBox}>
            <Text style={metaText}>
              {`Stripe Session: ${stripeSessionId}`}
            </Text>
            <Text style={metaText}>
              {`Payment Intent: ${stripePaymentId}`}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "Arial, sans-serif",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "40px 20px",
};

const h1 = {
  color: "#0D0D0D",
  fontSize: "24px",
  fontWeight: "700" as const,
  marginBottom: "16px",
};

const text = {
  color: "#404040",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "4px 0",
};

const orderBox = {
  backgroundColor: "#FAFAFA",
  border: "1px solid #E5E5E5",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
};

const orderNumberText = {
  color: "#0D0D0D",
  fontSize: "18px",
  fontWeight: "700" as const,
  margin: "0 0 8px 0",
};

const sectionTitle = {
  color: "#0D0D0D",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "8px 0 4px 0",
};

const hr = {
  borderColor: "#E5E5E5",
  margin: "12px 0",
};

const table = {
  width: "100%" as const,
};

const labelCell = {
  color: "#737373",
  fontSize: "13px",
  padding: "3px 0",
};

const valueCell = {
  color: "#0D0D0D",
  fontSize: "13px",
  fontWeight: "500" as const,
  textAlign: "right" as const,
  padding: "3px 0",
};

const valueBold = {
  ...valueCell,
  fontWeight: "700" as const,
  fontSize: "15px",
};

const link = {
  color: "#D97706",
  textDecoration: "underline" as const,
  fontSize: "14px",
};

const addressText = {
  color: "#404040",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "4px 0",
};

const metaBox = {
  margin: "16px 0",
};

const metaText = {
  color: "#A3A3A3",
  fontSize: "11px",
  fontFamily: "monospace",
  margin: "2px 0",
};
