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

interface RoasteryNotificationProps {
  orderNumber: string;
  bagSize: string;
  bagColour: string;
  roastProfile: string;
  grind: string;
  quantity: number;
  turnaroundDays: string;
  deliveryAddress?: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    postal_code: string;
  } | null;
}

export function RoasteryNotification({
  orderNumber,
  bagSize,
  bagColour,
  roastProfile,
  grind,
  quantity,
  turnaroundDays,
  deliveryAddress,
}: RoasteryNotificationProps) {
  // Calculate a dispatch-by date (rough estimate: turnaround days from now)
  const dispatchDays = parseInt(turnaroundDays) || 10;
  const dispatchBy = new Date();
  dispatchBy.setDate(dispatchBy.getDate() + dispatchDays);
  const dispatchByFormatted = dispatchBy.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Html>
      <Head />
      <Preview>
        {`Roast order ${orderNumber} — ${quantity}× ${roastProfile} (${grind})`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Roast Order</Heading>

          <Section style={orderBox}>
            <Text style={orderNumberText}>
              {`${orderNumber}`}
            </Text>
            <Hr style={hr} />

            <Text style={sectionTitle}>Roast Specification</Text>
            <table style={table}>
              <tbody>
                <tr>
                  <td style={labelCell}>Roast Profile</td>
                  <td style={valueCell}>{roastProfile}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Grind</td>
                  <td style={valueCell}>{grind}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Bag Size</td>
                  <td style={valueCell}>{bagSize}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Bag Colour</td>
                  <td style={valueCell}>{bagColour}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Quantity</td>
                  <td style={quantityCell}>{`${quantity} bags`}</td>
                </tr>
              </tbody>
            </table>

            <Hr style={hr} />
            <Text style={sectionTitle}>Timeline</Text>
            <Text style={dispatchText}>
              {`Dispatch by: ${dispatchByFormatted}`}
            </Text>
            <Text style={subText}>
              {`Turnaround: ${turnaroundDays}`}
            </Text>
          </Section>

          {deliveryAddress && (
            <Section style={addressSection}>
              <Text style={sectionTitle}>Ship To</Text>
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
  margin: "0",
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
  fontSize: "14px",
  padding: "4px 0",
};

const valueCell = {
  color: "#0D0D0D",
  fontSize: "14px",
  fontWeight: "500" as const,
  textAlign: "right" as const,
  padding: "4px 0",
};

const quantityCell = {
  ...valueCell,
  fontWeight: "700" as const,
  fontSize: "16px",
  color: "#D97706",
};

const dispatchText = {
  color: "#0D0D0D",
  fontSize: "16px",
  fontWeight: "600" as const,
  margin: "4px 0",
};

const subText = {
  color: "#737373",
  fontSize: "13px",
  margin: "2px 0",
};

const addressSection = {
  backgroundColor: "#FAFAFA",
  border: "1px solid #E5E5E5",
  borderRadius: "12px",
  padding: "24px",
  margin: "16px 0",
};

const addressText = {
  color: "#404040",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "4px 0",
};
