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
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" integrity="sha512-5Hs3dF2AEPkpNAR7UiOHba+lRSJNeM2ECkwxUIxC1Q/FLycGTbNapWXB4tP889k5T5Ju8fs4b1P5z/iB4nMfSQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
