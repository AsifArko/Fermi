'use client';

import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
}

export const VideoPlayer = ({ url }: VideoPlayerProps) => {
  return (
    <div className='relative aspect-video'>
      <ReactPlayer
        src={url}
        width='100%'
        height='100%'
        controls
        playing={false}
      />
    </div>
  );
};
