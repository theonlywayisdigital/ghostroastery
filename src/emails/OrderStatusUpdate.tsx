import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Preview,
} from "@react-email/components";

const STATUS_HEADINGS: Record<string, string> = {
  "In Production": "Your coffee is being roasted",
  Dispatched: "Your order is on its way",
  Delivered: "Your order has been delivered",
};

const STATUS_MESSAGES: Record<string, string> = {
  "In Production":
    "Great news! Your custom coffee order is now being roasted by our expert team.",
  Dispatched:
    "Your order has been packed and dispatched. It should arrive within 2-3 business days.",
  Delivered:
    "Your order has been delivered. We hope you love your custom coffee!",
};

interface OrderStatusUpdateProps {
  orderNumber: string;
  customerName: string;
  newStatus: string;
  bagSize: string;
  roastProfile: string;
  quantity: number;
}

export function OrderStatusUpdate({
  orderNumber,
  customerName,
  newStatus,
  bagSize,
  roastProfile,
  quantity,
}: OrderStatusUpdateProps) {
  const heading = STATUS_HEADINGS[newStatus] || `Order status: ${newStatus}`;
  const message =
    STATUS_MESSAGES[newStatus] || `Your order status has been updated to: ${newStatus}`;

  return (
    <Html>
      <Head />
      <Preview>{`${heading} — ${orderNumber}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{heading}</Heading>
          <Text style={text}>{`Hi ${customerName},`}</Text>
          <Text style={text}>{message}</Text>

          <Section style={orderBox}>
            <Text style={orderNumberText}>{`Order: ${orderNumber}`}</Text>
            <Hr style={hr} />
            <table style={table}>
              <tbody>
                <tr>
                  <td style={labelCell}>Bag Size</td>
                  <td style={valueCell}>{bagSize}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Roast Profile</td>
                  <td style={valueCell}>{roastProfile}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Quantity</td>
                  <td style={valueCell}>{`${quantity} bags`}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Status</td>
                  <td style={statusCell}>{newStatus}</td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Text style={footer}>
            {`Questions? Reply to this email and we'll get back to you.`}
          </Text>
          <Text style={footer}>Ghost Roastery</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#0D0D0D",
  fontFamily: "Arial, sans-serif",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "40px 20px",
};

const h1 = {
  color: "#F5F5F0",
  fontSize: "28px",
  fontWeight: "700" as const,
  marginBottom: "16px",
};

const text = {
  color: "#A3A3A3",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "8px 0",
};

const orderBox = {
  backgroundColor: "#171717",
  border: "1px solid #262626",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
};

const orderNumberText = {
  color: "#F5F5F0",
  fontSize: "16px",
  fontWeight: "600" as const,
  margin: "0 0 12px 0",
};

const hr = {
  borderColor: "#262626",
  margin: "12px 0",
};

const table = {
  width: "100%" as const,
};

const labelCell = {
  color: "#A3A3A3",
  fontSize: "14px",
  padding: "4px 0",
};

const valueCell = {
  color: "#F5F5F0",
  fontSize: "14px",
  fontWeight: "500" as const,
  textAlign: "right" as const,
  padding: "4px 0",
};

const statusCell = {
  color: "#D97706",
  fontSize: "14px",
  fontWeight: "600" as const,
  textAlign: "right" as const,
  padding: "4px 0",
};

const footer = {
  color: "#525252",
  fontSize: "13px",
  marginTop: "32px",
};
