import "./globals.css";

export const metadata = {
  title: "Future Rafay | Snake game",
  description: "Play the classic Snake game! Navigate the snake to eat food, grow longer, and avoid hitting walls or your own tail. Can you achieve the highest score? Fun, addictive, and perfect for all ages!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
