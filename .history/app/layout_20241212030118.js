import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./css/breakpoints_prefixed.css";
import "./css/slick.css";
import "./css/styles_prefixed.css";
import Script from "next/script";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Script src="/js/TweenMax.min.js"/> 
 <Script src="/js/ScrollToPlugin.min.js"/> 


 <Script src="/js/jquery.min.js"/> 
 <Script src="/js/modernizr-custom.js"/> 
 <Script src="/js/jquery.inview.min.js"/> 
 <Script src="/js/social-icons.js"/>
 <Script src="/js/smartresize.js"/> 
 <Script src="/js/slick.min.js"/> 
 <Script src="/js/imagesloaded.js"/> 
 <Script src="/js/isotope.pkgd.min.js"/> 
 <Script src="/js/player.js"/> 
 <Script src="/js/site.js"/> 


      </body>
    </html>
  );
}
