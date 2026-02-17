import React, { useEffect } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  EmailIcon,
  FacebookMessengerIcon,
  GabIcon,
  HatenaIcon,
  InstapaperIcon,
  LineIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PinterestIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  ViberIcon,
  VKIcon,
  WeiboIcon,
  WorkplaceIcon,
  XIcon,
  EmailShareButton,
  FacebookMessengerShareButton,
} from 'react-share';

const ShareProgress = ({ shareUrl, progressText }:any) => {
   // Customize this with your own URL
  const title = progressText; // The text or title to share
 
  return (
    <div className='flex justify-center gap-4 items-center'>
      <FacebookShareButton
        url={shareUrl}
        title={title} // For sharing images on Facebook
       
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton
        url={shareUrl}
        title={title}
      >
       <XIcon size={32} round />
      </TwitterShareButton>

      <LinkedinShareButton
        url={shareUrl}
        summary={title}
        source={shareUrl}
      >
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>

      <WhatsappShareButton
        url={shareUrl}
        title={title}
      >
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      <EmailShareButton
        url={shareUrl}
        subject={title}
        body={title}
      >
        <EmailIcon size={32} round />
      </EmailShareButton>

    <FacebookMessengerShareButton
        url={shareUrl}
        appId="your_app_id"
      >
        <FacebookMessengerIcon size={32} round />
      </FacebookMessengerShareButton>
     
    </div>
  );
};

export default ShareProgress;
