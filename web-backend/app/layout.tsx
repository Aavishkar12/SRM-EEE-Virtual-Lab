import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AuthSessionProvider } from "@/components/auth-session-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
    title: {
        default: "SRM EEE Virtual Lab — 26EEE1001T",
        template: "%s | SRM EEE Virtual Lab",
    },
    description:
        "Interactive Virtual Laboratory for Electrical and Electronics Engineering (26EEE1001T) — SRM Institute of Science and Technology. Perform experiments, simulations, and quizzes online.",
    keywords: ["EEE", "virtual lab", "SRM", "electrical engineering", "electronics", "experiments", "KVL", "Thevenin", "circuits"],
    authors: [{ name: "SRM EEE Department" }],
    creator: "SRM Institute of Science and Technology",
};



export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className="overflow-x-hidden dark"
            style={{ colorScheme: "dark" }}
            suppressHydrationWarning
        >
            <body
                className={`${inter.variable} font-sans bg-[#050508] text-white overflow-x-hidden antialiased`}
            >
                <AuthSessionProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem={false}
                    >
                        <div className="relative flex min-h-screen flex-col overflow-x-hidden">
                            {children}
                            <Toaster
                                position="top-right"
                                toastOptions={{
                                    style: {
                                        background: "#0f1117",
                                        border: "1px solid rgba(59, 130, 246, 0.2)",
                                        color: "#e2e8f0",
                                    },
                                }}
                            />
                        </div>
                    </ThemeProvider>
                </AuthSessionProvider>
            </body>
        </html>
    );
}
