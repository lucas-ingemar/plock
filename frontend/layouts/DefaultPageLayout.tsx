interface DefaultPageLayoutProps {
    className?: string;
    children: React.ReactNode;
}

export const DefaultPageLayout: React.FC<DefaultPageLayoutProps> = ({
    className="",
    children,
}) => {
  return (
    <div className={"w-full h-full p-8" + " " + className}>
        {children}
    </div>
  );
}
