interface DefaultPageLayoutProps {
    className?: string;
    children: React.ReactNode;
}

export const DefaultPageLayout: React.FC<DefaultPageLayoutProps> = ({
    className="",
    children,
}) => {
  return (
    <div className={"w-full flex-1 p-6 sm:p-10 min-h-0" + " " + className}>
        {children}
    </div>
  );
}
