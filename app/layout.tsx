import { FC, PropsWithChildren } from "react";
import '@/app/ui/globals.css';
import "react-modern-gantt/dist/index.css";
//import "@svar-ui/react-gantt/all.css";
import { roboto } from "./ui/font";
import { ThemeProvider } from "./components/providers/ThemeProvider";

const RootLayout: FC<PropsWithChildren>=({children}) => {
    return (
        <html lang="es" suppressHydrationWarning>
            <body className={`${roboto.className} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
};

export default RootLayout;