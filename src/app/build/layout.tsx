export default function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The builder has its own shell with minimal header
  // No global navbar/footer in the builder
  return <>{children}</>;
}
