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

interface OrderConfirmationProps {
  orderNumber: string;
  customerName: string;
  bagSize: string;
  bagColour: string;
  roastProfile: string;
  grind: string;
  quantity: number;
  pricePerBag: number;
  totalPrice: number;
  turnaroundDays: string;
  deliveryAddress?: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    postal_code: string;
  } | null;
}

export function OrderConfirmation({
  orderNumber,
  customerName,
  bagSize,
  bagColour,
  roastProfile,
  grind,
  quantity,
  pricePerBag,
  totalPrice,
  turnaroundDays,
  deliveryAddress,
}: OrderConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {`Order ${orderNumber} confirmed — your coffee is being prepared`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Order Confirmed</Heading>
          <Text style={text}>
            {`Hi ${customerName},`}
          </Text>
          <Text style={text}>
            {`Thank you for your order! We're getting your custom coffee ready.`}
          </Text>

          <Section style={orderBox}>
            <Text style={orderNumberText}>
              {`Order: ${orderNumber}`}
            </Text>
            <Hr style={hr} />
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
            <table style={table}>
              <tbody>
                <tr>
                  <td style={labelCell}>
                    {`${quantity} × £${pricePerBag.toFixed(2)}`}
                  </td>
                  <td style={valueCell}>
                    {`£${totalPrice.toFixed(2)}`}
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {deliveryAddress && (
            <Section style={addressBox}>
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
            </Section>
          )}

          <Section style={timelineBox}>
            <Text style={sectionTitle}>What happens next</Text>
            <Text style={text}>
              {`1. Our team reviews your order and label file`}
            </Text>
            <Text style={text}>
              {`2. Your coffee is small-batch roasted to your profile`}
            </Text>
            <Text style={text}>
              {`3. Packed with your labels and dispatched`}
            </Text>
            <Text style={turnaroundText}>
              {`Estimated turnaround: ${turnaroundDays}`}
            </Text>
          </Section>

          <Text style={footer}>
            {`Questions? Reply to this email and we'll get back to you.`}
          </Text>
          <Text style={footer}>
            Ghost Roastery
          </Text>
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

const addressBox = {
  backgroundColor: "#171717",
  border: "1px solid #262626",
  borderRadius: "12px",
  padding: "24px",
  margin: "16px 0",
};

const sectionTitle = {
  color: "#F5F5F0",
  fontSize: "15px",
  fontWeight: "600" as const,
  margin: "0 0 8px 0",
};

const addressText = {
  color: "#A3A3A3",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
};

const timelineBox = {
  margin: "24px 0",
};

const turnaroundText = {
  color: "#D97706",
  fontSize: "18px",
  fontWeight: "700" as const,
  marginTop: "16px",
};

const footer = {
  color: "#525252",
  fontSize: "13px",
  marginTop: "32px",
};
