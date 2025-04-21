interface Props {
  children: React.ReactNode;
}
export function AuthLayout({ children }: Props) {
  return <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafbff]">{children}</div>;
}
